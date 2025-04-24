import React from 'react';
import Image from 'next/image';
import style from '../scrollbar.module.css';

const AnimalsCard = ({ animals, onAnimalClick }) => {
  return (
    <div className="flex flex-col w-full h-full px-2 rounded-3xl shadow-2xl bg-white justify-center items-center">
      <div
        className={`w-full h-full py-6 overflow-hidden hover:overflow-y-auto ${style.transparentScrollbar} justify-center`}
        style={{ scrollbarGutter: 'stable' }}
      >
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(3rem,12rem))] auto-rows-[minmax(2rem,11rem)] place-items-center place-content-center">
          {animals.map((animal) => (
            <div
              key={animal.id}
              className="w-full h-full rounded-3xl shadow-2xl p-4 bg-white cursor-pointer transition-all duration-300 transform hover:scale-105"
              onClick={() => onAnimalClick(animal)}
            >
              <Image
                src={animal.images[0]}
                alt={animal.name}
                width={128}
                height={128}
                className="w-full h-[70%] object-cover rounded-md mb-2"
              />
              <h3 className="text-lg font-bold text-gray-800 text-center">
                {animal.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimalsCard;
