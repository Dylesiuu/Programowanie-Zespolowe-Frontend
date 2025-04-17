import React from 'react';

const NavigationButton = ({ onNext, onPrevious, isLast }) => {
  return (
    <div className="flex justify-between gap-4 md:gap-6 w-full max-w-4xl mx-auto ">
      <button
        className="py-2 px-5 sm:py-3 sm:px-10 md:py-3 md:px-20
               bg-[#fefaf7] hover:bg-[#f0e6dc] text-[#CE8455] border-[#CE8455] border-1
                rounded-full transition-all duration-200 transform hover:scale-105
                text-sm sm:text-base md:text-lg
                whitespace-nowrap"
        onClick={onPrevious}
      >
        Wróć
      </button>

      <button
        className={`py-2 px-5 sm:py-3 sm:px-10 md:py-3 md:px-20
                    bg-[#CE8455] text-white hover:bg-[#AA673C]  
                    rounded-full transition-all duration-300 transform hover:scale-105 
                    text-sm sm:text-base md:text-lg
                    whitespace-nowrap`}
        onClick={onNext}
      >
        {isLast ? 'Zakończ' : 'Dalej'}
      </button>
    </div>
  );
};

export default NavigationButton;
