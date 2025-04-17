import React from 'react';
import tags from '../data/tags';
import { useRouter } from 'next/router';

const CompletionScreen = ({ selectedTags }) => {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/swipePage');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fefaf7] p-4">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">
          Twój profil został utworzony!
        </h1>

        <div className="flex flex-col items-center justify-center w-full mb-8">
          <div className="flex flex-wrap justify-center gap-3 w-full">
            {selectedTags.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              return (
                tag && (
                  <div
                    key={tag.id}
                    className="bg-[#fefaf7] text-[#CE8455] px-4 py-2 rounded-2xl
                                         text-sm md:text-base text-center border border-[#CE8455]
                                         min-w-[120px] md:min-w-[140px]"
                  >
                    {tag.text}
                  </div>
                )
              );
            })}
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="px-4 py-2 md:px-8 md:py-3 text-base md:text-lg bg-[#CE8455] hover:bg-[#AA673C] text-white
                             rounded-full transition-all duration-300 hover:scale-105
                             w-[180px] sm:w-[200px] md:w-[240px]"
        >
          Przejdź do przeglądania
        </button>
      </div>
    </div>
  );
};

export default CompletionScreen;
