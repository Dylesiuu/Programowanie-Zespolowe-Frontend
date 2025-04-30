import React from 'react';
import { BiMenu } from 'react-icons/bi';

const MobileInfoCard = ({ shelter, onEdit, toggleCard }) => {
  return (
    <div className="fixed flex flex-col inset-y-0 left-0 z-50 w-[75vw] max-w-sm mt-[3.75rem] bg-[#fefaf7] shadow-2xl p-4 space-y-6 rounded-r-3xl">
      {/* Close Button */}
      <button
        className="absolute top-1 -right-4 px-2 py-2 bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] rounded-full shadow-md z-10"
        onClick={toggleCard}
      >
        <BiMenu className="text-md" />
      </button>

      {/* Shelter Info */}
      <div className="flex flex-col w-full items-center justify-around">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-6 md:mb-8">
          {shelter.name}
        </h2>
        <div className="flex flex-col w-full space-y-4 px-2 md:px-4">
          <p className="text-sm md:text-base lg:text-lg text-gray-600">
            <strong>Location:</strong> {shelter.location}
          </p>
          <p className="text-sm md:text-base lg:text-lg text-gray-600">
            <strong>Phone:</strong> {shelter.phone}
          </p>
          <p className="text-sm md:text-base lg:text-lg text-gray-600">
            <strong>Email:</strong> {shelter.email}
          </p>
        </div>
      </div>

      {/* Edit Button */}
      <div className="w-full flex justify-center">
        <button
          className="mt-4 px-4 py-2 text-sm md:text-lg lg:text-xl
                     bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] rounded-full
                     transition-all duration-300 transform hover:scale-105 shadow-lg
                     w-full max-w-[200px] md:max-w-[240px] lg:max-w-[280px]"
          onClick={onEdit}
        >
          Edit Info
        </button>
      </div>
    </div>
  );
};

export default MobileInfoCard;
