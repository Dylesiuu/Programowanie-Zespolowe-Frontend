import React from 'react';
import InfoCard from './infoCard';
import AnimalsCard from './animalsCard';

const ShelterProfile = () => {
  const shelter = {
    name: 'Happy Paws Shelter',
    location: '123 Main Street, Springfield',
    phone: '+1 555-123-4567',
    email: 'contact@happypaws.com',
  };

  const animals = [
    {
      id: 1,
      name: 'Buddy',
      breed: 'Golden Retriever',
      image: '/img/dog.jpg',
    },
    {
      id: 2,
      name: 'Mittens',
      breed: 'Tabby Cat',
      image: '/img/cat.jpg',
    },
    {
      id: 3,
      name: 'Charlie',
      breed: 'Beagle',
      image: '/img/dog2.jpeg',
    },
  ];

  const handleEdit = () => {
    alert('Edit button clicked!');
  };

  const handleAnimalClick = (animal) => {
    alert(`You clicked on ${animal.name}`);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-between pt-15 px-4 space-x-2">
      {/* Info Card */}
      <div className="flex w-full h-full max-w-md items-center justify-center py-5">
        <InfoCard shelter={shelter} onEdit={handleEdit} />
      </div>
      <div className="flex w-full h-full items-center justify-center py-5">
        <AnimalsCard animals={animals} onAnimalClick={handleAnimalClick} />
      </div>
    </div>
  );
};

export default ShelterProfile;
