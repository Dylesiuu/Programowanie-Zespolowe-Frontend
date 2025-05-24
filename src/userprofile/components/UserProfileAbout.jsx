import React from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { useRouter } from 'next/router';

const ProfileAbout = ({ description, userId }) => {
  const router = useRouter();

  return (
    <div className="bg-[#fefaf7] rounded-lg shadow-md p-6 mb-6 h-64 flex flex-col">
      <div className="flex items-center justify-center mb-4">
        <h2 className="text-2xl text-[#4A4038] font-bold text-center p-2">
          O mnie
        </h2>
        <FaRegEdit
          data-testid="edit-icon"
          className="w-6 h-6 text-[#CE8455] cursor-pointer ml-2"
          onClick={() =>
            router.push(`/userDetailsCreatorPage?userId=${userId}`)
          }
        />
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 whitespace-pre-wrap break-words text-gray-700 leading-relaxed">
        {description || 'Brak opisu'}
      </div>
    </div>
  );
};

export default ProfileAbout;
