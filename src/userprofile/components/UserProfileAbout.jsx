import React from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { useRouter } from 'next/router';

const ProfileAbout = ({ about, userId }) => {
  const router = useRouter();
  return (
    <div className="bg-[#fefaf7] rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-wrap items-center justify-center mb-4">
        <h2 className="text-2xl font-bold text-center p-2">O mnie</h2>
        <FaRegEdit
          data-testid="edit-icon"
          className="w-6 h-6 text-[#CE8455] cursor-pointer"
          onClick={() =>
            router.push(`/userDetailsCreatorPage?userId=${userId}`)
          }
        />
      </div>
      <div className="text-gray-700">
        <p>{about || 'Brak opisu'}</p>
      </div>
    </div>
  );
};

export default ProfileAbout;
