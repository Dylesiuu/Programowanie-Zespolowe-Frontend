import React, { useState } from 'react';
import InfoCard from './infoCard';
import AnimalsField from './animalsField';
import AnimalCard from './animalCard';
import MobileInfoCard from './mobileInfoCard';

const ShelterProfile = () => {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isMobileCardVisible, setIsMobileCardVisible] = useState(false);

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
      age: 3,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      gender: 'Samiec',
      type: 'Pies',
      shelterId: 101,
      traits: [
        'Playful',
        'Loyal',
        'Good with kids',
        'Playful',
        'Loyal',
        'Good with kids',
        'Playful',
        'Loyal',
        'Good with kids',
      ],
      images: ['/img/dog.jpg', '/img/dog2.jpeg'],
    },
    {
      id: 2,
      name: 'Mittens',
      age: 2,
      description: 'Ciekawski i czuły kot rasy tabby.',
      gender: 'Samica',
      type: 'Kot',
      shelterId: 102,
      traits: [
        'Independent',
        'Loves to cuddle',
        'Super długi tag, który zajmie dziwnie dużo miejsca',
        'A tu taki krótki',
      ],
      images: ['/img/cat.jpg'],
    },
    {
      id: 3,
      name: 'Charlie',
      age: 4,
      description: 'Zabawny i przygodowy beagle.',
      gender: 'Samiec',
      type: 'Pies',
      shelterId: 101,
      traits: ['Energetic', 'Friendly', 'Good with other dogs'],
      images: ['/img/dog2.jpeg', '/img/dog.jpg'],
    },
    {
      id: 4,
      name: 'Buddy',
      age: 3,
      description: 'Lojalny i kochający golden retriever.',
      gender: 'Samiec',
      type: 'Pies',
      shelterId: 101,
      traits: ['Loyal', 'Friendly', 'Good with kids'],
      images: ['/img/dog.jpg', '/img/dog2.jpeg'],
    },
    {
      id: 5,
      name: 'Mittens',
      age: 2,
      description: 'Zabawny i ciekawski kot rasy tabby.',
      gender: 'Samica',
      type: 'Kot',
      shelterId: 102,
      traits: ['Playful', 'Quiet', 'Loves attention'],
      images: ['/img/cat.jpg'],
    },
    {
      id: 6,
      name: 'Charlie',
      age: 4,
      description: 'Ciekawski i energiczny beagle.',
      gender: 'Samiec',
      type: 'Pies',
      shelterId: 101,
      traits: ['Adventurous', 'Friendly', 'Good with other pets'],
      images: ['/img/dog2.jpeg'],
    },
    {
      id: 7,
      name: 'Buddy',
      age: 3,
      description: 'Lojalny i kochający golden retriever.',
      gender: 'Samiec',
      type: 'Pies',
      shelterId: 101,
      traits: ['Loyal', 'Friendly', 'Good with kids'],
      images: ['/img/dog.jpg', '/img/dog2.jpeg'],
    },
    {
      id: 8,
      name: 'Mittens',
      age: 2,
      description: 'Zabawny i ciekawski kot rasy tabby.',
      gender: 'Samica',
      type: 'Kot',
      shelterId: 102,
      traits: ['Playful', 'Quiet', 'Loves attention'],
      images: ['/img/cat.jpg'],
    },
    {
      id: 9,
      name: 'Charlie',
      age: 4,
      description: 'Ciekawski i energiczny beagle.',
      gender: 'Samiec',
      type: 'Pies',
      shelterId: 101,
      traits: ['Adventurous', 'Friendly', 'Good with other pets'],
      images: ['/img/dog2.jpeg'],
    },
    {
      id: 10,
      name: 'Charlie',
      age: 4,
      description: 'Ciekawski i energiczny beagle.',
      gender: 'Samiec',
      type: 'Pies',
      shelterId: 101,
      traits: ['Adventurous', 'Friendly', 'Good with other pets'],
      images: ['/img/dog2.jpeg'],
    },
    {
      id: 11,
      name: 'Buddy',
      age: 3,
      description: 'Lojalny i kochający golden retriever.',
      gender: 'Samiec',
      type: 'Pies',
      shelterId: 101,
      traits: ['Loyal', 'Friendly', 'Good with kids'],
      images: ['/img/dog.jpg', '/img/dog2.jpeg'],
    },
    {
      id: 12,
      name: 'Mittens',
      age: 2,
      description: 'Zabawny i ciekawski kot rasy tabby.',
      gender: 'Samica',
      type: 'Kot',
      shelterId: 102,
      traits: ['Playful', 'Quiet', 'Loves attention'],
      images: ['/img/cat.jpg'],
    },
    {
      id: 13,
      name: 'Charlie',
      age: 4,
      description: 'Ciekawski i energiczny beagle.',
      gender: 'Samiec',
      type: 'Pies',
      shelterId: 101,
      traits: ['Adventurous', 'Friendly', 'Good with other pets'],
      images: ['/img/dog2.jpeg'],
    },
    {
      id: 14,
      name: 'Charlie',
      age: 4,
      description: 'Ciekawski i energiczny beagle.',
      gender: 'Samiec',
      type: 'Pies',
      shelterId: 101,
      traits: ['Adventurous', 'Friendly', 'Good with other pets'],
      images: ['/img/dog2.jpeg'],
    },
  ];

  const handleEdit = () => {
    alert('Edit button clicked!');
  };

  const handleAnimalClick = (animal) => {
    setSelectedAnimal(animal);
    setTimeout(() => setShowModal(true), 50);
  };

  const closeAnimalCard = () => {
    setShowModal(false);
    setTimeout(() => setSelectedAnimal(null), 300);
  };

  const toggleMobileCard = () => {
    setIsMobileCardVisible((prev) => !prev);
  };

  return (
    <div className="flex w-full h-full">
      {/* Mobile Info Card Background blur */}
      <div
        className={`
      fixed inset-0 transition-all duration-400 ease-in-out
      ${isMobileCardVisible ? 'backdrop-blur-md opacity-100' : 'opacity-0 pointer-events-none'}
      sm:hidden z-40
    `}
      ></div>
      {/* Mobile Info Card for Smaller Screens */}
      <div
        className={`
    fixed inset-0 z-50 transition-transform duration-500 ease-in-out sm:hidden
    ${isMobileCardVisible ? 'translate-x-0' : '-translate-x-[75%]'}
  `}
      >
        <MobileInfoCard
          shelter={shelter}
          onEdit={handleEdit}
          toggleCard={toggleMobileCard}
        />
      </div>

      <div className="flex h-full w-full items-center justify-between pt-15 px-7 space-x-3 sm:space-x-7">
        {/* Info Card for Larger Screens */}
        <div className="hidden sm:flex w-full h-full max-w-md items-center justify-center py-5">
          <InfoCard shelter={shelter} onEdit={handleEdit} />
        </div>

        {/* Animals Field */}
        <div className="flex w-full h-full items-center justify-center py-5">
          <AnimalsField animals={animals} onAnimalClick={handleAnimalClick} />
        </div>
      </div>

      {/* Animal Card Modal */}
      {selectedAnimal && (
        <div
          className={`fixed flex inset-0 items-center justify-center z-50 transition-all duration-500 ease-in-out ${
            showModal ? 'backdrop-blur-sm opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className={`relative w-[30%] h-[85%] min-w-[20rem] top-7 bg-[#fefaf7]/85 p-6 rounded-3xl shadow-2xl transform transition-all duration-300 ease-in-out ${
              showModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            <button
              className="absolute top-2 right-2 bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] w-8 h-8 flex items-center justify-center rounded-full shadow-md cursor-pointer"
              onClick={closeAnimalCard}
            >
              ✕
            </button>
            <AnimalCard
              animal={selectedAnimal}
              onEdit={() => alert(`Edytujesz zwierzę: ${selectedAnimal.name}`)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelterProfile;
