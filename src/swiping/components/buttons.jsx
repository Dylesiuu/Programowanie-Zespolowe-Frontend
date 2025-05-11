import React from 'react';
import { FaTimes, FaHeart } from 'react-icons/fa';

const Buttons = ({ onDislike, onLike }) => {
  return (
    <div className="flex justify-center gap-16 mt-4">
      <button
        onClick={onDislike}
        className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center text-2xl hover:bg-red-600 transition-transform duration-300 transform hover:scale-110"
        data-testid="dislike-button"
      >
        <FaTimes />
      </button>
      <button
        onClick={onLike}
        className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl hover:bg-green-700 transition-transform duration-300 transform hover:scale-110"
        data-testid="like-button"
      >
        <FaHeart />
      </button>
    </div>
  );
};

export default Buttons;
