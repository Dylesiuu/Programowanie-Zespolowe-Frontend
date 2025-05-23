import React from 'react';
import { useRouter } from 'next/router';

const SheltersPanel = ({ shelters }) => {
  const router = useRouter();

  return (
    <div className="bg-[#FFF9F5]/80 rounded-lg shadow-md p-6">
      <h2 className="text-2xl text-[#CE8455] font-bold mb-6 text-center">
        Lista schronisk
      </h2>
      {shelters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden">
          {shelters.map((shelter) => (
            <div
              key={shelter._id}
              className="w-full h-full rounded-2xl shadow-lg p-6 bg-white cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${styles.transparentScrollbar}"
              onClick={() =>
                router.push(`/shelterProfilePage?shelterId=${shelter._id}`)
              }
            >
              <h3 className="text-xl font-semibold text-[#CE8455] mb-2">
                {shelter.name}
              </h3>
              {/* <p className="text-gray-700 mb-1">{shelter.location}</p> */}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">
          Brak schronisk do wyświetlenia
        </p>
      )}
    </div>
  );
};

export default SheltersPanel;
