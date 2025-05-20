import React from 'react';

const ProfileAbout = ({ about }) => {
  return (
    <div className="bg-[#fefaf7] rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl text-[#CE8455] font-bold mb-4">O Mnie</h2>
      <div className="text-gray-700">
        <p>{about || 'Brak opisu'}</p>
      </div>
    </div>
  );
};

export default ProfileAbout;
