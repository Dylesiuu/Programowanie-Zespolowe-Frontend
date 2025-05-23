import React from 'react';

const Question = ({ question, selectedTags, onOptionClick }) => {
  const isOptionSelected = (optionTags) => {
    return optionTags.some((tag) =>
      selectedTags.some((selected) => selected._id === tag)
    );
  };

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 bg-[#FFF9F5]/70 rounded-4xl shadow-lg">
      <h1 className="text-[#C9590F] text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-6 md:mb-10 text-center">
        {question.text}
      </h1>
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 w-full max-w-4xl mx-auto">
        {question.options.map((option) => (
          <button
            key={option.text}
            onClick={() => onOptionClick(option.tags || [])}
            className={`py-4 px-6 rounded-3xl border-1 transition-all
                        h-[100px] md:h-[110px] w-full max-w-[300px] md:max-w-[350px] flex items-center justify-center 
                        ${
                          isOptionSelected(option.tags || [])
                            ? 'bg-[#CE8455] text-white hover:bg-[#AA673C]'
                            : 'bg-[#fefaf7] hover:bg-[#f0e6dc] text-[#CE8455] border-[#CE8455]'
                        }
                       text-sm sm:text-sm md:text-base
                        break-words overflow-hidden
                        hover:scale-105 active:scale-95`}
            aria-pressed={isOptionSelected(option.tags || [])}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;
