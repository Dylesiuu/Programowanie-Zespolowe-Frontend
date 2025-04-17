const SkipWarning = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-900/30 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-[#fefaf7] rounded-xl shadow-xl max-w-md w-full p-6 mx-4">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-[#CE8455] mb-3">
            Czy na pewno chcesz pominąć?
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Pominięcie ankiety może skutkować mniej dokładnym dopasowaniem
            zwierząt.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={onCancel}
            className="
            px-3 py-3 sm:px-1 sm:py-1 md:px-4 md:py-3
            text-sm sm:text-xs md:text-base
            bg-[#fefaf7] hover:bg-[#f0e6dc] text-[#CE8455] border-1 border-[#CE8455]
            rounded-full transition-all duration-200 transform hover:scale-105"
          >
            Kontynuuj ankietę
          </button>
          <button
            onClick={onConfirm}
            className="
            px-3 py-3 sm:px-1 sm:py-1 md:px-4 md:py-3
            text-sm sm:text-xs md:text-base
            bg-[#CE8455] text-white hover:bg-[#AA673C]
            rounded-full transition-all duration-200 transform hover:scale-105"
          >
            Pomiń i przejdź dalej
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkipWarning;
