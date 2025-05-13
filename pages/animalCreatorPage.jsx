import React, { useContext, useEffect } from 'react';
import AnimalCreator from '../src/animalcreator/components/AnimalCreator';
import animalTags from '../src/animalcreator/data/animalTags';
import animalQuestions from '../src/animalcreator/data/animalQuestions';
import { UserContext } from '@/context/userContext';
import { useRouter } from 'next/router';

export async function getStaticProps() {
  return {
    props: {
      tags: animalTags,
      questions: animalQuestions,
    },
  };
}

const AnimalCreatorPage = () => {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const { animalId } = router.query;

  useEffect(() => {
    if (userContext.isLoggedIn()) {
      return;
    }

    router.replace('/');
  }, [router, userContext]);

  return (
    <div className="min-h-screen bg-[#FFF0E9] bg-[url('/Union.svg')] bg-repeat bg-[length:150rem_100rem] bg-fixed">
      <AnimalCreator givenAnimalId={animalId} />
    </div>
  );
};

export default AnimalCreatorPage;
