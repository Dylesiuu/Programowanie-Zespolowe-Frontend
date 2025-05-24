import React from 'react';
import { FaHeart, FaHeartBroken } from 'react-icons/fa';

const Buttons = ({ onDislike, onLike }) => {
  return (
    <div className="flex justify-center gap-16 mt-4">
      <button
        onClick={onDislike}
        className="w-16 h-16 bg-[#B12828] hover:bg-[#7c1c1c] text-white rounded-full flex items-center justify-center text-2xl transition-transform duration-300 transform hover:scale-110"
        data-testid="dislike-button"
      >
        <FaHeartBroken className="w-7 h-7" />
      </button>
      <button
        onClick={onLike}
        className="w-16 h-16 bg-[#4F9C49] hover:bg-[#376d33] text-white rounded-full flex items-center justify-center text-2xl transition-transform duration-300 transform hover:scale-110"
        data-testid="like-button"
      >
        <FaHeart className="w-7 h-7" />
      </button>
    </div>
  );
};

export default Buttons;
