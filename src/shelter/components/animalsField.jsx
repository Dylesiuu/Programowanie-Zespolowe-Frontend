import React from 'react';
import Image from 'next/image';
import style from '../scrollbar.module.css';
import { useRouter } from 'next/router';

const AnimalsField = ({ animals, onAnimalClick, userContext, shelterId }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col w-full h-full px-2 rounded-3xl shadow-2xl bg-[#fefaf7]/80 justify-center items-center">
      <div
        className={`w-full h-full py-6 overflow-hidden hover:overflow-y-auto ${style.transparentScrollbar} justify-center`}
        style={{ scrollbarGutter: 'stable' }}
      >
        {animals.length > 0 ? (
          <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(3rem,12rem))] auto-rows-[minmax(2rem,11rem)] place-items-center place-content-center">
            {animals.map((animal) => (
              <div
                data-testid="animal-card"
                key={animal._id}
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
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-lg">
            Brak zwierzaków w schronisku.
          </div>
        )}
      </div>
      {/* Add Animal Button */}
      {userContext.user?.shelterId &&
        userContext.user.shelterId === shelterId && (
          <div className="flex justify-center items-center w-full h-[10%]">
            <button
              className="px-4 py-2 text-sm md:text-lg lg:text-xl
                 bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] rounded-full
                 transition-all duration-300 transform hover:scale-105 shadow-lg 
                 w-full max-w-[12.5rem] md:max-w-[15rem] lg:max-w-[17.5rem] cursor-pointer"
              onClick={() => {
                router.push(`/animalCreatorPage?animalId=null`);
              }}
              data-testid="add-animal-button"
            >
              Dodaj zwierzę
            </button>
          </div>
        )}
    </div>
  );
};

export default AnimalsField;
