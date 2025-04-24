import React from 'react';

const InfoCard = ({ shelter, onEdit }) => {
  return (
    <div className="flex flex-col w-full h-full rounded-3xl shadow-2xl p-2 bg-white max-w-md mx-auto space-y-4 justify-between items-center">
      {/* Shelter info */}
      <div className="flex flex-col w-full items-center justify-around">
        <h2 className="text-xl font-bold text-gray-800 mb-10">
          {shelter.name}
        </h2>
        <div className="flex flex-col w-full space-y-4 px-2">
          <p className="text-gray-600">
            <strong>Location:</strong> {shelter.location}
          </p>
          <p className="text-gray-600">
            <strong>Phone:</strong> {shelter.phone}
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> {shelter.email}
          </p>
        </div>
      </div>
      {/* Buttons */}
      <div>
        <button
          className="mt-4 px-4 py-2 text-lg md:text-xl
                     bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] rounded-full
                     transition-all duration-300 transform hover:scale-105 shadow-lg
                     w-full max-w-[240px] md:max-w-[280px]"
          onClick={onEdit}
        >
          Edit Info
        </button>
      </div>
    </div>
  );
};

export default InfoCard;
