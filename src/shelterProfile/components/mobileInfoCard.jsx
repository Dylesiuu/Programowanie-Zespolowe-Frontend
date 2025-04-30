import React from 'react';
import { BiMenu } from 'react-icons/bi';

const MobileInfoCard = ({ shelter, onEdit, toggleCard }) => {
  return (
    <div className="fixed flex flex-col inset-y-0 left-0 z-50 w-[80vw] mt-[3.75rem] bg-[#fefaf7]/80 shadow-2xl p-4 space-y-6 rounded-r-3xl">
      {/* Close Button */}
      <button
        className="absolute top-1 -right-4 px-2 py-2 bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] rounded-full shadow-md z-10"
        onClick={toggleCard}
        data-testid="close-button"
      >
        <BiMenu className="text-md" data-testid="bi-menu-icon" />
      </button>

      {/* Shelter Info */}
      <div className="flex flex-col w-full p-6 bg-white rounded-3xl items-center justify-around">
        <h2 className="text-lg font-bold text-gray-800 text-center mb-6">
          {shelter.name}
        </h2>
        <div className="flex flex-col w-full space-y-4 px-2 ">
          <p className="text-sm text-gray-600">
            <strong>Location:</strong> {shelter.location}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Phone:</strong> {shelter.phone}
          </p>
          <p className="text-sm text-gray-600">
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
