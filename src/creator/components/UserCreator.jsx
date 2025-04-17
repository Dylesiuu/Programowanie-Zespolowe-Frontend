import React, { useState } from 'react';
import questions from '../data/questions';
import tags from '../data/tags';
import Question from './Question';
import NavigationButton from './NavigationButton';
import StartScreen from './StartScreen';
import CompletionScreen from './CompletionScreen';
import SkipWarning from './SkipWarning';
import { useRouter } from 'next/router';

const UserCreator = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  const router = useRouter();

  const handleSkip = () => {
    setShowSkipWarning(true);
  };

  const confirmSkip = () => {
    setShowSkipWarning(false);
    router.push('/swipePage');
  };

  const cancelSkip = () => {
    setShowSkipWarning(false);
  };

  const preparedQuestions = questions.map((question) => {
    const questionTags = tags.filter((tag) => tag.collectionId === question.id);
    return {
      ...question,
      options: questionTags.map((tag) => ({
        text: tag.text,
        tags: [tag.id],
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

      const newConflicts = optionTags.flatMap(
        (tagId) => tags.find((t) => t.id === tagId)?.conflicts || []
      );

      const existingConflicts = prevTags.filter((tagId) =>
        tags
          .find((t) => t.id === tagId)
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
    return <CompletionScreen selectedTags={selectedTags} />;
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
