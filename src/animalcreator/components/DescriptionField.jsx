import React from 'react';

const DescriptionField = ({ value, onChange }) => {
  return (
    <div className="mb-6 w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl">Opis zwierzęcia</h2>
      </div>
      <textarea
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className="w-full h-60 bg-[#fefaf7] border border-[#CE8455] rounded-lg p-4 text-lg overflow-y-auto resize-none"
        placeholder="Opisz zwierzę, jego charakter, specjalne potrzeby..."
      />
    </div>
  );
};

export default DescriptionField;
