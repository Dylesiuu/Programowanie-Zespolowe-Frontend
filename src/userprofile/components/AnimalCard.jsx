import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FaHeartBroken } from 'react-icons/fa';
import RemoveFavouriteWarning from './RemoveFavouriteWarning';

const AnimalCard = ({
  images = [],
  name,
  gender,
  age,
  description,
  traits = [],
  shelter,
  onRemoveFromFavourites,
  registrationNumber = '',
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRemoveWarning, setShowRemoveWarning] = useState(false);
  const [shelterDetails, setShelterDetails] = useState(null);
  const router = useRouter();
  const [showVirtualAdoptionModal, setShowVirtualAdoptionModal] =
    useState(false);

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

  const fetchShelterDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shelter/find-by-id`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ shelterId: shelter }),
        }
      );
      if (!response.ok) console.error('Failed to fetch shelter details');
      const data = await response.json();
      setShelterDetails(data.shelter);
      console.log('shelter: ', data.shelter);
    } catch (error) {
      console.error('Error fetching shelter details:', error);
      return null;
    }
  };

  useEffect(() => {
    if (shelter && shelter !== 'undefine') {
      fetchShelterDetails();
    }
  }, [shelter]);

  const handleVirtualAdoption = (e) => {
    e.stopPropagation();
    setShowVirtualAdoptionModal(true);
  };

  const handleRegularAdoption = (e) => {
    e.stopPropagation();
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLSfOBNjgDStLil5DujY24JXICzf061EoagzG-Mk0-no1z4N6rw/formResponse?embedded=true',
      '_blank'
    );
  };

  const handleRemoveFromFavourites = (e) => {
    e.stopPropagation();
    setShowRemoveWarning(true);
  };

  const confirmRemove = () => {
    setShowRemoveWarning(false);
    if (onRemoveFromFavourites) {
      onRemoveFromFavourites();
    }
  };

  const cancelRemove = () => {
    setShowRemoveWarning(false);
  };

  return (
    <>
      <div
        className="relative rounded-2xl overflow-hidden shadow-md cursor-pointer bg-[#fefaf7] h-full transition-transform hover:scale-[1.02]"
        onClick={toggleExpand}
      >
        <div className="flex justify-center items-center h-72 bg-[#fefaf7] pt-5">
          {images.length > 0 ? (
            <div className="w-64 h-64 rounded-xl overflow-hidden relative shadow">
              <Image
                fill
                src={images[currentImageIndex].preview}
                alt={name}
                className="object-cover w-full h-full"
                priority
              />
              <div className="absolute bottom-2 right-2 bg-[#CE8455] bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                {currentImageIndex + 1}/{images.length}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#CE8455] bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-opacity-70 transition-all"
                  >
                    ‹
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#CE8455] bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-opacity-70 transition-all"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="w-64 h-64 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500">
              Brak zdjęcia
            </div>
          )}
        </div>

        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800">{name}</h2>
          <p className="text-gray-600">
            {gender}, {age}
          </p>
        </div>

        <div className="flex justify-between p-4 pt-0 gap-2">
          {shelterDetails?.virtualAdoption &&
            shelterDetails.virtualAdoption.trim() !== '' && (
              <button
                onClick={handleVirtualAdoption}
                className="flex-1 bg-[#CE8455] text-white py-1 rounded-lg hover:bg-[#AA673C] transition-all"
              >
                Adopcja wirtualna
              </button>
            )}
          <button
            onClick={handleRegularAdoption}
            className={`${shelterDetails?.virtualAdoption && shelterDetails.virtualAdoption.trim() !== '' ? 'flex-1' : 'flex-[2]'} bg-[#4A4038] text-white py-1 rounded-lg hover:bg-[#2E2A24] transition-all`}
          >
            Adoptuj
          </button>
          <button
            onClick={handleRemoveFromFavourites}
            className="bg-[#fefaf7] text-[#CE8455] border border-[#CE8455] p-1 rounded-lg hover:bg-[#f5e9e0] transition-all"
            title="Usuń z ulubionych"
          >
            <FaHeartBroken />
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          <div
            className="fixed inset-0 backdrop-blur-sm bg-[#CE8455]/30 z-40 transition-opacity duration-300"
            onClick={toggleExpand}
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pt-15">
            <div
              className="relative bg-[#fefaf7] rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={toggleExpand}
                className="absolute top-4 right-4 bg-[#CE8455] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-[#AA673C] transition-all z-[60]"
                aria-label="Zamknij"
              >
                <span className="text-2xl font-bold">×</span>
              </button>

              <div className="flex flex-col md:flex-row flex-shrink-0">
                <div className="flex justify-center items-center md:w-1/2 p-4 md:p-6">
                  {images.length > 0 ? (
                    <div className="w-64 h-64 md:w-96 md:h-96 rounded-xl overflow-hidden relative shadow-lg">
                      <Image
                        fill
                        src={images[currentImageIndex].preview}
                        alt={name}
                        className="object-cover w-full h-full"
                        priority
                      />
                      <div className="absolute bottom-2 right-2 bg-[#CE8455] bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                        {currentImageIndex + 1}/{images.length}
                      </div>

                      {images.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#CE8455] bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center text-base hover:bg-opacity-70 transition-all"
                          >
                            ‹
                          </button>
                          <button
                            onClick={handleNextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#CE8455] bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center text-base hover:bg-opacity-70 transition-all"
                          >
                            ›
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="w-64 h-64 md:w-96 md:h-96 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 shadow-lg">
                      Brak zdjęcia
                    </div>
                  )}
                </div>

                <div className="p-4 md:p-6 md:w-1/2 space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#CE8455]">
                    {name}
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-[#CE8455] text-sm">
                        NUMER EWIDENCYJNY
                      </h3>
                      <p className="text-gray-800">{registrationNumber}</p>
                    </div>
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
                        SCHRONISKO
                      </h3>
                      <p
                        className="text-gray-800 cursor-pointer hover:underline"
                        onClick={() =>
                          shelterDetails &&
                          shelterDetails._id &&
                          router.push(
                            `/shelterProfilePage?shelterId=${shelter}&animal=null`
                          )
                        }
                        tabIndex={0}
                        role="button"
                      >
                        {shelterDetails.name}
                      </p>
                    </div>
                  </div>

                  {traits.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-[#CE8455] text-sm">
                        TAGI
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {traits.map((trait) => (
                          <span
                            key={trait._id}
                            className="bg-[#fefaf7] text-[#CE8455] border border-[#CE8455] shadow-lg px-3 py-1 rounded-full text-sm"
                          >
                            {trait.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 p-4 md:p-6 overflow-y-auto">
                <h3 className="font-semibold text-[#CE8455] text-sm mb-2">
                  OPIS
                </h3>
                <p className="flex-1 overflow-y-auto pr-2 whitespace-pre-line leading-relaxed text-gray-700">
                  {description || 'Brak opisu'}
                </p>
              </div>

              <div className="flex justify-between p-4 border-t border-gray-200 gap-2">
                {shelterDetails?.virtualAdoption &&
                  shelterDetails.virtualAdoption.trim() !== '' && (
                    <button
                      onClick={handleVirtualAdoption}
                      className="flex-1 bg-[#CE8455] text-white py-2 rounded-lg hover:bg-[#AA673C] transition-all"
                    >
                      Adopcja wirtualna
                    </button>
                  )}
                <button
                  onClick={handleRegularAdoption}
                  className={`${shelterDetails?.virtualAdoption && shelterDetails.virtualAdoption.trim() !== '' ? 'flex-1' : 'flex-[2]'} bg-[#4A4038] text-white py-2 rounded-lg hover:bg-[#2E2A24] transition-all`}
                >
                  Adoptuj
                </button>
                <button
                  onClick={handleRemoveFromFavourites}
                  className="bg-[#fefaf7] text-[#CE8455] border border-[#CE8455] p-2 rounded-lg hover:bg-[#f5e9e0] transition-all"
                  title="Usuń z ulubionych"
                >
                  <FaHeartBroken />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {showVirtualAdoptionModal && (
        <>
          <div
            className="fixed inset-0 backdrop-blur-sm bg-[#CE8455]/30 z-40 transition-opacity duration-300"
            onClick={() => setShowVirtualAdoptionModal(false)}
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="relative bg-[#fefaf7] rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowVirtualAdoptionModal(false)}
                className="absolute top-4 right-4 bg-[#CE8455] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-[#AA673C] transition-all z-[60]"
                aria-label="Zamknij"
              >
                <span className="text-2xl font-bold">×</span>
              </button>

              <div className="p-6 pt-12">
                <h3 className="text-xl font-bold text-[#CE8455] mb-4">
                  Adopcja wirtualna
                </h3>
                <div className="overflow-y-auto pr-2 max-h-[60vh]">
                  <p className="text-gray-700 whitespace-pre-line">
                    {shelterDetails?.virtualAdoption ||
                      'Brak informacji o adopcji wirtualnej.'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end p-4 border-t border-gray-200">
                <button
                  onClick={() => setShowVirtualAdoptionModal(false)}
                  className="bg-[#CE8455] text-white px-6 py-2 rounded-lg hover:bg-[#AA673C] transition-all"
                >
                  Zamknij
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {showRemoveWarning && (
        <RemoveFavouriteWarning
          onConfirm={confirmRemove}
          onCancel={cancelRemove}
          animalName={name}
        />
      )}
    </>
  );
};

export default AnimalCard;
