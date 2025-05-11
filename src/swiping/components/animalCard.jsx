import React, { useState } from 'react';
import Image from 'next/image';

const AnimalCard = ({
  images = [],
  name,
  gender,
  age,
  location,
  traits = [],
  shelter,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullImage, setIsFullImage] = useState(false);

  const handleNextImage = (event) => {
    event.stopPropagation();
    setCurrentImageIndex((currentImageIndex + 1) % images.length);
  };

  const handlePrevImage = (event) => {
    event.stopPropagation();
    setCurrentImageIndex(
      (currentImageIndex - 1 + images.length) % images.length
    );
  };

  const toggleFullImage = () => {
    setIsFullImage(!isFullImage);
  };

  return (
    <div className="w-[90%] max-w-[350px] bg-[#FEFEFE] border-[3px] border-[#AF6B6B] rounded-[22px] shadow-md px-[22px] pt-[15px] pb-[30px] mx-auto mb-5 relative flex flex-col items-center cursor-pointer hover:shadow-lg transition">
      <div
        className="w-full aspect-[9/10] max-h-[350px] border border-[#AF6B6B] rounded-[22px] overflow-hidden flex items-center justify-center relative cursor-pointer"
        onClick={toggleFullImage}
      >
        {images.length > 0 ? (
          <>
            <Image
              src={images[currentImageIndex]}
              alt={name}
              width={400}
              height={400}
              unoptimized
              className={`transition-transform duration-300 rounded-[22px] ${
                isFullImage
                  ? 'fixed top-1/2 left-1/2 max-w-[60vw] max-h-[60vh] transform -translate-x-1/2 -translate-y-1/2 z-[1000] object-contain shadow-xl rounded-xl'
                  : 'w-full h-full object-cover'
              }`}
            />

            <div className="absolute bottom-2 right-2 bg-black/30 text-white text-xs px-2 py-1 rounded-md z-10">
              {currentImageIndex + 1} / {images.length}
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className={`absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-2 text-xl rounded z-[1001] hover:opacity-100 opacity-70 ${
                    isFullImage ? 'fixed left-[10%] px-6' : ''
                  }`}
                >
                  ‹
                </button>
                <button
                  onClick={handleNextImage}
                  className={`absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-2 text-xl rounded z-[1001] hover:opacity-100 opacity-70 ${
                    isFullImage ? 'fixed right-[10%] px-6' : ''
                  }`}
                >
                  ›
                </button>
              </>
            )}
          </>
        ) : (
          <div className="text-gray-500">No Image</div>
        )}
      </div>

      {isFullImage && (
        <div
          className="fixed inset-0 bg-black/80 z-[999] cursor-pointer"
          onClick={toggleFullImage}
        />
      )}

      <div className="w-full text-left mt-3 space-y-1">
        <h2 className="text-2xl font-bold">{name}</h2>
        <p className="text-gray-600 text-sm">
          {gender}, {age}
        </p>
        <p className="text-gray-500 text-sm">{location}</p>
      </div>

      <div className="flex flex-wrap gap-2 mt-3 w-full">
        {traits.map((trait) => (
          <span
            key={trait}
            className="bg-[#f4a261] text-[#3a281c] text-xs font-medium px-3 py-1 rounded-full"
          >
            {trait}
          </span>
        ))}
      </div>

      <div className="w-full mt-3 text-sm italic text-gray-600 text-left">
        {shelter}
      </div>
    </div>
  );
};

export default AnimalCard;
