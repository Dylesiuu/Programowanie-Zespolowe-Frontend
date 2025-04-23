import React from 'react';
import Image from 'next/image';

const AnimalsCard = ({ animals, onAnimalClick }) => {
  return (
    <div className="flex flex-col w-full h-full border rounded-lg shadow-md p-6 bg-white max-w-4xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Animals in Shelter
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {animals.map((animal) => (
          <div
            key={animal.id}
            className="border rounded-lg shadow-md p-4 bg-white cursor-pointer transition-all duration-300 transform hover:scale-105"
            onClick={() => onAnimalClick(animal)}
          >
            <Image
              src={animal.image}
              alt={animal.name}
              width={128}
              height={128}
              className="w-full h-32 object-cover rounded-md mb-2"
            />
            <h3 className="text-lg font-bold text-gray-800 text-center">
              {animal.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimalsCard;
