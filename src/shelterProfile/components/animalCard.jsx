import React, { useState } from 'react';
import Image from 'next/image';

const AnimalCard = ({ animal, onEdit }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [isTraitsVisible, setIsTraitsVisible] = useState(false);

  const showDescription = () => {
    setIsDescriptionVisible(true);
  };

  const hideDescription = () => {
    setIsDescriptionVisible(false);
  };

  const showTraits = () => {
    setIsTraitsVisible(true);
  };

  const hideTraits = () => {
    setIsTraitsVisible(false);
  };

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
    <div className="flex flex-col w-full h-full p-6 rounded-3xl shadow-2xl bg-white">
      {/* Animal Image Carousel */}
      <div className="w-full h-64 relative mb-4 ">
        <Image
          src={animal.images[currentImageIndex]}
          alt={animal.name}
          fill
          style={{ objectFit: 'cover' }}
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
          <div className="absolute bottom-2 right-2 bg-[#CE8455] text-[#fefaf7] text-sm px-3 py-1 rounded-full shadow-lg">
            {currentImageIndex + 1}/{animal.images.length}
          </div>
        )}
      </div>

      {/* Animal Info */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{animal.name}</h2>
      <p className="text-gray-600 mb-2">
        <strong>Wiek:</strong> {animal.age} lata
      </p>
      {/* Description */}
      <p className="text-gray-600 mb-2">
        <strong>Opis: </strong>
        {animal.description.length > 100 ? (
          <>
            {animal.description.slice(0, 100).trimEnd()}...{' '}
            <button
              className="text-[#d46622] hover:underline cursor-pointer ml-1"
              onClick={showDescription}
            >
              Więcej...
            </button>
          </>
        ) : (
          animal.description
        )}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Płeć:</strong> {animal.gender}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Typ:</strong> {animal.type}
      </p>
      {/* Traits */}
      <div className="flex flex-wrap items-center text-gray-600 mb-2 gap-1">
        <strong>Tagi: </strong>
        <div className="flex flex-wrap gap-2">
          {(animal.traits.length > 3
            ? animal.traits.slice(0, 3)
            : animal.traits
          ).map((trait, index) => (
            <span
              key={index}
              className="bg-[#fefaf7] text-[#CE8455] border border-[#CE8455] text-sm px-3 py-1 rounded-full shadow-lg"
            >
              {trait}
            </span>
          ))}
        </div>
        {animal.traits.length > 3 && (
          <button
            className="text-[#d46622] hover:underline cursor-pointer mt-2"
            onClick={showTraits}
          >
            Pokaż więcej
          </button>
        )}
      </div>

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
      {/* Description Card */}
      {isDescriptionVisible && (
        <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-sm opacity-100 z-50">
          <div className="relative w-[90%] max-w-lg bg-white p-6 rounded-3xl shadow-2xl">
            <button
              className="absolute top-2 right-2 bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] w-8 h-8 flex items-center justify-center rounded-full shadow-md cursor-pointer"
              onClick={hideDescription}
            >
              ✕
            </button>
            <p className="text-gray-600">{animal.description}</p>
          </div>
        </div>
      )}
      {/* Traits Card */}
      {isTraitsVisible && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm opacity-100 z-50">
          <div className="relative w-[90%] max-w-lg bg-white p-6 rounded-3xl shadow-2xl">
            <button
              className="absolute top-2 right-2 bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] w-8 h-8 flex items-center justify-center rounded-full shadow-md cursor-pointer"
              onClick={hideTraits}
            >
              ✕
            </button>
            <div className="flex flex-wrap gap-2 mb-4">
              {animal.traits.map((trait, index) => (
                <span
                  key={index}
                  className="bg-[#fefaf7] text-[#CE8455] border border-[#CE8455] text-sm px-3 py-1 rounded-full shadow-lg"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimalCard;
