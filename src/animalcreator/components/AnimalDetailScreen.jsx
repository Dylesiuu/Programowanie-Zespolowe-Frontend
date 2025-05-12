import React from 'react';
import ImageUploader from './ImageUploader';

const AnimalDetailScreen = ({
  animalData,
  onDescriptionChange,
  onPhotoUpload,
  onRemovePhoto,
  onNext,
  onBack,
  fileInputRef,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md mx-auto flex flex-col items-center bg-[#FFF9F5]/70 rounded-4xl shadow-lg p-8">
        <div className="w-full max-w-md mx-auto flex flex-col items-center">
          <h1 className="text-[#C9590F] text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">
            Dodaj szczegóły
          </h1>

          <div className="w-full mb-8">
            <label className="block text-lg font-medium text-[#CE8455] mb-2 ">
              Opis zwierzęcia:
            </label>
            <textarea
              value={animalData.description}
              onChange={onDescriptionChange}
              className="w-full p-4 border border-[#CE8455] rounded-lg h-40 focus:outline-none focus:ring-2 focus:ring-[#CE8455] transition-all"
              placeholder="Opisz charakter i zwyczaje zwierzęcia..."
            />
          </div>

          <ImageUploader
            photos={animalData.photos}
            onUpload={onPhotoUpload}
            onRemove={onRemovePhoto}
            fileInputRef={fileInputRef}
          />

          <div className="flex justify-between w-full mt-8">
            <button
              onClick={onBack}
              className="px-6 py-2 text-[#CE8455] border border-[#CE8455] rounded-full"
            >
              Wróć
            </button>
            <button
              onClick={onNext}
              disabled={
                !animalData.description || animalData.photos.length === 0
              }
              className="px-6 py-2 bg-[#CE8455] text-white rounded-full disabled:opacity-50"
            >
              Podsumowanie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetailScreen;
