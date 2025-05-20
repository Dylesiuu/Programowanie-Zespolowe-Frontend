import React from 'react';

const StartScreen = ({ onStart, onSkip }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full text-center space-y-4 px-4">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-10 lg:mb-12 leading-tight">
        Opowiedz nam o sobie!
      </h1>
      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        <button
          className="px-6 py-3 md:px-8 md:py-4 text-lg md:text-xl
                     bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] rounded-full
                     transition-all duration-300 transform hover:scale-105 shadow-lg
                     w-full max-w-[240px] md:max-w-[280px]"
          onClick={onStart}
        >
          Zaczynajmy
        </button>
        <button
          className="px-5 py-2 md:px-6 md:py-3 text-base md:text-lg
                     bg-[#fefaf7] hover:bg-[#e5e1de] text-[#CE8455] border-1 border-[#CE8455]
                     rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg
                     w-full max-w-[180px] md:max-w-[200px]"
          onClick={onSkip}
        >
          Pomiń
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
