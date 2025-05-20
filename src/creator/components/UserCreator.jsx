import React, { useState, useContext, useEffect } from 'react';
import questions from '../data/questions';
import Question from './Question';
import NavigationButton from './NavigationButton';
import StartScreen from './StartScreen';
import CompletionScreen from './CompletionScreen';
import SkipWarning from './SkipWarning';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/userContext';
import { useAuthFetch } from '@/lib/authFetch';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const UserCreator = ({ givenUserId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTraits, setAllTraits] = useState([]);
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const userContext = useContext(UserContext);
  const fetchData = useAuthFetch();

  const handleSkip = () => {
    setShowSkipWarning(true);
  };

  const confirmSkip = async () => {
    setShowSkipWarning(false);
    await router.push('/swipePage');
  };

  const cancelSkip = () => {
    setShowSkipWarning(false);
  };

  // Fetch all available traits from backend
  useEffect(() => {
    const fetchAllTraits = async () => {
      try {
        const response = await fetchData(
          `${API_BASE_URL}/user/getAllUsertraits`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch traits');
        }

        const data = await response.json();
        setAllTraits(data.traits || []);
      } catch (error) {
        console.error('Error fetching traits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllTraits();
  }, []);

  // Fetch user data if editing existing user
  useEffect(() => {
    if (givenUserId && givenUserId !== 'null' && allTraits.length > 0) {
      fetchUserData(givenUserId);
    }
  }, [givenUserId, allTraits]);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetchData(`${API_BASE_URL}/user/searchUserById`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();

      // Map backend trait IDs to our local structure
      const userTags = userData.traits
        .map((traitId) => allTraits.find((trait) => trait._id === traitId))
        .filter((tag) => tag !== undefined)
        .map((tag) => tag._id);

      setSelectedTags(userTags);

      // Skip to completion if user already has traits
      if (userTags.length > 0) {
        setCurrentQuestionIndex(questions.length + 1);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const saveUserTraits = async () => {
    try {
      const response = await fetchData(`${API_BASE_URL}/user/updateTraits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: givenUserId || userContext.user._id,
          traits: selectedTags,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save user traits');
      }

      router.push('/swipePage');
    } catch (error) {
      console.error('Error saving user traits:', error);
    }
  };

  // Prepare questions with options from fetched traits
  const preparedQuestions = questions.map((question) => {
    const questionTraits = allTraits.filter(
      (trait) => trait.collectionId === question.id
    );

    return {
      ...question,
      options: questionTraits.map((trait) => ({
        text: trait.text,
        tags: [trait._id],
        conflicts: trait.conflicts || [],
      })),
    };
  });

  const handleOptionClick = (optionTags) => {
    setSelectedTags((prevTags) => {
      const isAnySelected = optionTags.some((tagId) =>
        prevTags.includes(tagId)
      );

      if (isAnySelected) {
        return prevTags.filter((tagId) => !optionTags.includes(tagId));
      }

      const newConflicts = optionTags.flatMap((tagId) => {
        const trait = allTraits.find((t) => t._id === tagId);
        return trait?.conflicts || [];
      });

      const existingConflicts = prevTags.filter((tagId) =>
        allTraits
          .find((t) => t._id === tagId)
          ?.conflicts?.some((conflictId) => optionTags.includes(conflictId))
      );

      const allConflicts = [
        ...new Set([...newConflicts, ...existingConflicts]),
      ];

      return [
        ...prevTags.filter((tagId) => !allConflicts.includes(tagId)),
        ...optionTags,
      ];
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < preparedQuestions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentQuestionIndex === preparedQuestions.length) {
      if (selectedTags.length === 0) {
        setShowSkipWarning(true);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Ładowanie...
      </div>
    );
  }

  if (currentQuestionIndex === 0) {
    return (
      <>
        <StartScreen
          onStart={() => setCurrentQuestionIndex(1)}
          onSkip={handleSkip}
        />
        {showSkipWarning && (
          <SkipWarning onConfirm={confirmSkip} onCancel={cancelSkip} />
        )}
      </>
    );
  }

  if (currentQuestionIndex > preparedQuestions.length) {
    return (
      <CompletionScreen
        selectedTags={selectedTags.map((tagId) => {
          const trait = allTraits.find((t) => t._id === tagId);
          return trait ? trait._id : tagId;
        })}
        onSubmit={saveUserTraits}
      />
    );
  }

  const currentQuestion = preparedQuestions[currentQuestionIndex - 1];

  return (
    <>
      {showSkipWarning && (
        <SkipWarning onConfirm={confirmSkip} onCancel={cancelSkip} />
      )}
      <div className="flex flex-col justify-center min-h-screen bg-[#fefaf7]">
        <div className="mx-auto p-6 w-full max-w-6xl flex-grow flex flex-col">
          <div className="flex-grow flex flex-col justify-center">
            <Question
              question={currentQuestion}
              selectedTags={selectedTags}
              onOptionClick={handleOptionClick}
            />
          </div>
          <div className="flex justify-between pt-6 w-full max-w-4xl mx-auto">
            <NavigationButton
              onNext={handleNext}
              onPrevious={handlePrevious}
              isLast={currentQuestionIndex === preparedQuestions.length}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCreator;
