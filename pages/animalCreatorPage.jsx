import React from 'react';
import AnimalCreator from '../src/animalcreator/components/AnimalCreator';
import animalTags from '../src/animalcreator/data/animalTags';
import animalQuestions from '../src/animalcreator/data/animalQuestions';

export async function getStaticProps() {
  return {
    props: {
      tags: animalTags,
      questions: animalQuestions,
    },
  };
}

const AnimalCreatorPage = () => {
  return (
    <div className="min-h-screen bg-[#FFF0E9] bg-[url('/Union.svg')] bg-repeat bg-[length:150rem_100rem] bg-fixed">
      <AnimalCreator />
    </div>
  );
};

export default AnimalCreatorPage;
