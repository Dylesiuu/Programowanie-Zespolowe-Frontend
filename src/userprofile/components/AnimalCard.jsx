import React, { useState } from 'react';
import Image from 'next/image';

const AnimalCard = ({
  images = [],
  name,
  gender,
  age,
  location,
  description,
  traits = [],
  shelter,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Normal card view */}
      <div
        className="relative rounded-lg overflow-hidden shadow-md cursor-pointer bg-white h-full transition-transform hover:scale-[1.02]"
        onClick={toggleExpand}
      >
        {/* Image container */}
        <div className="relative h-64">
          {images.length > 0 ? (
            <>
              <Image
                width={500}
                height={500}
                src={images[currentImageIndex]}
                alt={name}
                className="object-cover"
                priority
              />
              <div className="absolute bottom-2 right-2 bg-[#CE8455] bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                {currentImageIndex + 1}/{images.length}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#CE8455] hover:bg-[#AA673C]  bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-all"
                  >
                    ‹
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#CE8455] hover:bg-[#AA673C] bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-all"
                  >
                    ›
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              Brak zdjęcia
            </div>
          )}
        </div>

        {/* Basic info */}
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800">{name}</h2>
          <p className="text-gray-600">
            {gender}, {age}
          </p>
        </div>
      </div>

      {/* Expanded card view */}
      {isExpanded && (
        <>
          <div
            className="fixed inset-0 backdrop-blur-sm bg-[#CE8455]/30  z-40 transition-opacity duration-300"
            onClick={toggleExpand}
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={toggleExpand}
                className="absolute top-4 right-4 bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100 transition-all z-50"
                aria-label="Zamknij"
              >
                <span className="text-2xl font-bold">×</span>
              </button>

              <div className="flex flex-col md:flex-row flex-shrink-0">
                <div className="relative h-64 md:h-[400px] md:w-1/2">
                  {images.length > 0 ? (
                    <>
                      <Image
                        width={500}
                        height={500}
                        src={images[currentImageIndex]}
                        alt={name}
                        className="object-cover"
                        priority
                      />
                      <div className="absolute bottom-4 right-4 bg-[#CE8455] hover:bg-[#AA673C] bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1}/{images.length}
                      </div>

                      {images.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#CE8455] hover:bg-[#AA673C] bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-all"
                          >
                            ‹
                          </button>
                          <button
                            onClick={handleNextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#CE8455] hover:bg-[#AA673C] bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-all"
                          >
                            ›
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                      Brak zdjęcia
                    </div>
                  )}
                </div>

                <div className="p-6 md:w-1/2 space-y-4">
                  <h2 className="text-3xl font-bold text-[#CE8455]">{name}</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-[#CE8455] text-sm">
                        WIEK
                      </h3>
                      <p className="text-gray-800">{age}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#CE8455] text-sm">
                        PŁEĆ
                      </h3>
                      <p className="text-gray-800">{gender}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#CE8455] text-sm">
                        LOKALIZACJA
                      </h3>
                      <p className="text-gray-800">{location}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#CE8455] text-sm">
                        SCHRONISKO
                      </h3>
                      <p className="text-gray-800">{shelter}</p>
                    </div>
                  </div>

                  {traits.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-[#CE8455] text-sm">
                        CECHY
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {traits.map((trait, index) => (
                          <span
                            key={index}
                            className="bg-[#FDF4EE] text-[#CE8455] px-3 py-1 rounded-full text-sm"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 p-6 overflow-y-auto">
                <h3 className="font-semibold text-[#CE8455] text-sm mb-2">
                  OPIS
                </h3>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {description || 'Brak opisu'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add these to your globals.css */}
      {/*<style jsx global>{`*/}
      {/*  @keyframes fadeIn {*/}
      {/*    from {*/}
      {/*      opacity: 0;*/}
      {/*      transform: scale(0.95);*/}
      {/*    }*/}
      {/*    to {*/}
      {/*      opacity: 1;*/}
      {/*      transform: scale(1);*/}
      {/*    }*/}
      {/*  }*/}

      {/*  .animate-fadeIn {*/}
      {/*    animation: fadeIn 0.3s ease-out forwards;*/}
      {/*  }*/}
      {/*`}</style>*/}
    </>
  );
};

export default AnimalCard;
