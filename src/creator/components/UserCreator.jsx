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

const UserCreator = () => {
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
    await router.push(`/swipePage?created=false`);
  };

  const cancelSkip = () => {
    setShowSkipWarning(false);
  };

  const normalizeConflicts = (conflicts) => {
    if (!conflicts) return [];
    if (Array.isArray(conflicts)) return conflicts;
    if (typeof conflicts === 'string') return [conflicts];
    return [];
  };

  useEffect(() => {
    const fetchAllTraits = async () => {
      try {
        const response = await fetchData(
          `${API_BASE_URL}/user/getAllUsertraits`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userContext.token}`,
            },
          }
        );

        if (!response.ok) {
          console.error('Failed to fetch traits');
        }

        const data = await response.json();
        console.log('data:  ', data);
        const normalizedTraits = data.traits.map((trait) => ({
          ...trait,
          conflicts: normalizeConflicts(trait.conflicts),
        }));
        setAllTraits(normalizedTraits || []);
      } catch (error) {
        console.error('Error fetching traits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllTraits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userContext.user?._id && allTraits.length > 0) {
      const mapTag = async () => {
        try {
          const userTags = userContext.user.traits
            .map((traitId) =>
              allTraits.find((trait) => trait._id === traitId._id)
            )
            .filter((tag) => tag !== undefined)
            .map((tag) => tag._id);

          setSelectedTags(userTags);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      mapTag();
    }
  }, [userContext.user, allTraits]);

  // const mapTag = async () => {
  //   try {
  //     const userTags = userContext.user.traits
  //       .map((traitId) => allTraits.find((trait) => trait._id === traitId._id))
  //       .filter((tag) => tag !== undefined)
  //       .map((tag) => tag._id);
  //
  //     setSelectedTags(userTags);
  //   } catch (error) {
  //     console.error('Error fetching user data:', error);
  //   }
  // };

  const saveUserTraits = async () => {
    try {
      if (userContext.user?._id) {
        const response = await fetchData(`${API_BASE_URL}/user/removetrait`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`,
          },
          body: JSON.stringify({
            trait: userContext.user.traits.map((trait) => trait._id),
          }),
        });

        if (!response.ok) {
          console.error('Failed to delete user traits');
        }
      }

      if (userContext.user?._id) {
        const response = await fetchData(`${API_BASE_URL}/user/addtraits`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`,
          },
          body: JSON.stringify({
            trait: selectedTags.map((tag) => tag._id),
          }),
        });

        if (!response.ok) {
          console.error('Failed to save user traits');
        }
        const data = await response.json();
        userContext.setUser(data.user);
      }

      router.push('/swipePage?created=false');
    } catch (error) {
      console.error('Error saving user traits:', error);
    }
  };

  const preparedQuestions = questions.map((question) => {
    const questionTraits = allTraits.filter(
      (trait) => trait.collectionId === question.id
    );

    return {
      ...question,
      options: questionTraits.map((trait) => ({
        text: trait.text,
        tags: [trait._id],
        conflicts: normalizeConflicts(trait.conflicts),
      })),
    };
  });
  const handleOptionClick = (optionTags) => {
    setSelectedTags((prevTags) => {
      const clickedTagId = optionTags[0];
      const clickedTrait = allTraits.find((t) => t._id === clickedTagId);

      const isSelected = prevTags.some((tag) => tag._id === clickedTagId);
      if (isSelected) {
        return prevTags.filter((tag) => tag._id !== clickedTagId);
      }

      const conflicts = clickedTrait?.conflicts || [];
      const filteredTags = prevTags.filter(
        (tag) => !conflicts.includes(tag._id)
      );

      return [...filteredTags, clickedTrait];
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
        Loading...
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
        selectedTags={selectedTags}
        allTraits={allTraits}
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
      <div className="flex flex-col justify-center min-h-screen">
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
