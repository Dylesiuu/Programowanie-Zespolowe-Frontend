import React from 'react';
import Image from 'next/image';
import { FaRegEdit } from 'react-icons/fa';
import { useRouter } from 'next/router';

const ProfilePersonalInfo = ({ user }) => {
  const router = useRouter();
  return (
    <div className="bg-[#fefaf7] rounded-lg shadow-md p-6 mb-6 text-center">
      <div className="flex justify-center items-center space-x-4 mb-4">
        <Image
          width={500}
          height={500}
          src={user.avatar}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
        />
      </div>
      <div className="flex flex-wrap items-center justify-center mb-4">
        <h2 className="text-2xl font-bold text-center p-2">{user.name}</h2>
        <FaRegEdit
          data-testid="edit-icon"
          className="w-6 h-6 text-[#CE8455] cursor-pointer"
          onClick={() =>
            router.push(`/userDetailsCreatorPage?userId=${user._id}`)
          }
        />
      </div>

      <div className="space-y-2 flex flex-col items-center">
        <div className="flex items-center pt-5">
          {/*<span className="text-gray-600 font-medium mr-2">Miasto:</span>*/}
          {/*<span>{user.city || 'Nie podano'}</span>*/}
        </div>
      </div>
    </div>
  );
};

export default ProfilePersonalInfo;
