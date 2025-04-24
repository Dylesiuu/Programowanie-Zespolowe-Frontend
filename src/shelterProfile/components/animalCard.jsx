import React, { useState } from 'react';
import Image from 'next/image';

const AnimalCard = ({ animal, onEdit }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === animal.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? animal.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="flex flex-col w-full max-w-md p-6 rounded-3xl shadow-2xl bg-white">
      {/* Animal Image Carousel */}
      <div className="w-full h-64 relative mb-4">
        <Image
          src={animal.images[currentImageIndex]}
          alt={animal.name}
          layout="fill"
          objectFit="cover"
          className="rounded-2xl"
        />
        {/* Navigation Buttons - Show only if more than one image */}
        {animal.images.length > 1 && (
          <>
            <button
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] p-2 rounded-full shadow-lg cursor-pointer"
              onClick={handlePreviousImage}
            >
              ‹
            </button>
            <button
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] p-2 rounded-full shadow-lg cursor-pointer"
              onClick={handleNextImage}
            >
              ›
            </button>
          </>
        )}
        {/* Image Counter - Show only if more than one image */}
        {animal.images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-[#AA673C] text-[#fefaf7] text-sm px-3 py-1 rounded-full shadow-lg">
            {currentImageIndex + 1}/{animal.images.length}
          </div>
        )}
      </div>

      {/* Animal Info */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{animal.name}</h2>
      <p className="text-gray-600 mb-2">
        <strong>Wiek:</strong> {animal.age} lata
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Opis:</strong> {animal.description}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Płeć:</strong> {animal.gender}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Typ:</strong> {animal.type}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Cechy:</strong> {animal.traits.join(', ')}
      </p>

      {/* Edit Button */}
      <button
        className="mt-4 px-4 py-2 text-lg md:text-xl
                     bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] rounded-full
                     transition-all duration-300 transform hover:scale-105 shadow-lg
                     w-full"
        onClick={onEdit}
      >
        Edytuj
      </button>
    </div>
  );
};

export default AnimalCard;
