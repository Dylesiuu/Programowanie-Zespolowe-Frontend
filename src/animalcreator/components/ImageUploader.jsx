import React from 'react';
import Image from 'next/image';

const ImageUploader = ({ photos, onUpload, onRemove }) => {
  const fileInputRef = React.useRef();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="mb-6 w-full">
      <h2 className="text-xl font-medium text-[#CE8455] mb-4">
        Zdjęcia zwierzęcia:
      </h2>

      <div className="flex flex-wrap gap-4 mb-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative">
            <Image
              width={500}
              height={500}
              src={photo.preview}
              alt={`Preview ${index}`}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <button
              data-testid="remove-photo-button"
              onClick={() => onRemove(photo.preview)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleButtonClick}
        className="px-4 py-2 bg-[#f0e6dc] text-[#CE8455] rounded-lg hover:bg-[#e2d4c8] transition-colors"
      >
        + Dodaj zdjęcia
      </button>

      <input
        data-testid="file-input"
        type="file"
        ref={fileInputRef}
        onChange={onUpload}
        multiple
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;
