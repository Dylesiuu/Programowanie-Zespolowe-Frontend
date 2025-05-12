import { useState } from 'react';

const AnimalCompletionScreen = ({
  animalData,
  onSubmit,
  onBack,
  animalTags = [],
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 pt-20 md:pt-24 ">
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full max-h-screen flex flex-col">
            <button
              className="self-end text-white text-4xl mb-4 hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Powiększone zdjęcie"
              className="max-w-full max-h-[80vh] object-contain mx-auto"
            />
          </div>
        </div>
      )}

      {showAllPhotos && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-40 p-4"
          onClick={() => setShowAllPhotos(false)}
        >
          <div className="max-w-4xl w-full max-h-screen flex flex-col">
            <button
              className="self-end text-white text-4xl mb-4 hover:text-gray-300"
              onClick={() => setShowAllPhotos(false)}
            >
              &times;
            </button>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto">
              {animalData.photos.map((photo, index) => (
                <div key={index} className="flex-shrink-0">
                  <img
                    src={photo.preview}
                    alt={`Preview ${index}`}
                    className="w-full h-48 md:h-64 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(photo.preview);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center bg-[#FFF9F5]/70 rounded-4xl shadow-lg p-6 md:p-10">
        <h1 className="text-[#C9590F] text-2xl md:text-3xl font-bold mb-6 text-center">
          Podsumowanie
        </h1>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="bg-[#FFF9F5] rounded-2xl shadow-md p-6 h-full">
            <h2 className="text-[#C9590F] text-xl font-semibold mb-4">
              Podstawowe informacje:
            </h2>
            <div className="space-y-3 text-[#C9590F]">
              <p className="text-lg ">
                <span className="font-bold">Imię:</span> {animalData.name}
              </p>
              <p className="text-lg">
                <span className="font-bold">Szacowana data urodzenia:</span>{' '}
                {animalData.birthDate}
              </p>
              <p className="text-lg">
                <span className="font-bold">Płeć:</span> {animalData.gender}
              </p>
            </div>
          </div>

          {animalData.photos && animalData.photos.length > 0 && (
            <div className="bg-[#FFF9F5] rounded-2xl shadow-md p-6 h-full">
              <h2 className="text-[#C9590F] text-xl font-semibold mb-4">
                Zdjęcia:
              </h2>
              <div className="relative">
                <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide max-h-48">
                  {animalData.photos.map((photo, index) => (
                    <div key={index} className="flex-shrink-0">
                      <img
                        src={photo.preview}
                        alt={`Preview ${index}`}
                        className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedImage(photo.preview)}
                      />
                    </div>
                  ))}
                </div>
                {animalData.photos.length > 4 && (
                  <button
                    onClick={() => setShowAllPhotos(true)}
                    className="mt-2 text-[#CE8455] text-sm font-medium hover:underline pt-2"
                  >
                    Zobacz wszystkie zdjęcia ({animalData.photos.length})
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-full mb-6 bg-[#FFF9F5] rounded-2xl shadow-md p-6">
          <h2 className="text-[#C9590F] text-xl font-semibold mb-4">Cechy:</h2>
          <div className="flex flex-wrap gap-3">
            {animalData.tags.map((tagId) => {
              const tag = animalTags.find((t) => t.id === tagId);
              return (
                tag && (
                  <span
                    key={tag.id}
                    className="bg-[#fefaf7] hover:bg-[#f0e6dc] text-[#CE8455] border border-[#CE8455] px-4 py-2 rounded-full text-lg"
                  >
                    {tag.text}
                  </span>
                )
              );
            })}
          </div>
        </div>

        <div className="w-full mb-6 bg-[#FFF9F5] rounded-2xl shadow-md p-6">
          <h2 className="text-[#C9590F] text-xl font-semibold mb-4">Opis:</h2>
          <div className="max-h-96 overflow-y-auto">
            <p className="text-[#CE8455] text-lg whitespace-pre-wrap break-words">
              {animalData.description}
            </p>
          </div>
        </div>

        <div className="flex justify-between w-full mt-6 space-x-4">
          <button
            onClick={onBack}
            className="px-8 py-3 text-[#CE8455] border-1 border-[#CE8455] rounded-full text-lg font-medium hover:bg-[#FFF0E9] transition-colors"
          >
            Wróć
          </button>
          <button
            onClick={onSubmit}
            className="px-8 py-3 bg-[#CE8455] text-white rounded-full text-lg font-medium hover:bg-[#C9590F] transition-colors"
          >
            Potwierdź
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimalCompletionScreen;
