import React, { useState } from 'react';

const AnimalStartScreen = ({ onStart, onSkip }) => {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleAnimalSelect = (animalType) => {
    setSelectedAnimal(animalType);
    const warningShown = localStorage.getItem('hideAnimalWarning');
    if (!warningShown) {
      setShowWarning(true);
    } else {
      onStart(animalType);
    }
  };

  const handleContinue = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideAnimalWarning', 'true');
    }
    setShowWarning(false);
    onStart(selectedAnimal);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md mx-auto flex flex-col items-center bg-[#FFF9F5]/70 rounded-4xl shadow-lg p-8">
        <h1 className="text-[#C9590F] text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">
          Dodaj nowe zwierzę
        </h1>

        <div className="flex flex-col gap-4 w-full mb-8">
          <button
            onClick={() => handleAnimalSelect('cat')}
            className="px-6 py-4 bg-[#fefaf7] text-[#CE8455] border-2 border-[#CE8455] rounded-3xl hover:bg-[#f0e6dc] transition-all text-lg"
          >
            Dodaj kota
          </button>
          <button
            onClick={() => handleAnimalSelect('dog')}
            className="px-6 py-4 bg-[#fefaf7] text-[#CE8455] border-2 border-[#CE8455] rounded-3xl hover:bg-[#f0e6dc] transition-all text-lg"
          >
            Dodaj psa
          </button>
        </div>

        <button
          onClick={onSkip}
          className="text-[#CE8455] underline hover:text-[#AA673C]"
        >
          Anuluj
        </button>
      </div>
      {showWarning && (
        <div className="fixed inset-0 backdrop-blur-sm  flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Ważna informacja</h2>
            <p className="mb-4">
              Jeśli nie znasz odpowiedzi na jakieś pytanie, możesz przejść
              dalej. Pamiętaj jednak, że im więcej informacji podasz, tym
              większa szansa na znalezienie idealnego domu dla zwierzęcia.
            </p>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="dontShowAgain"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="dontShowAgain">Nie pokazuj ponownie</label>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowWarning(false)}
                className="px-4 py-2 text-[#CE8455] border border-[#CE8455] rounded-lg"
              >
                Wróć
              </button>
              <button
                onClick={handleContinue}
                className="px-4 py-2 bg-[#CE8455] text-white rounded-lg"
              >
                Rozumiem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimalStartScreen;
