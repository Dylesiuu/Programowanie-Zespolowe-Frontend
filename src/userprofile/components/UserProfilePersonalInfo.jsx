import React from 'react';
import Image from 'next/image';

const ProfilePersonalInfo = ({ user }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center space-x-4 mb-4">
        <Image
          width={500}
          height={500}
          src={user.avatar}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
        />
        <h2 className="text-2xl font-bold">{user.name}</h2>
      </div>
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="text-gray-600 font-medium mr-2">Miasto:</span>
          <span>{user.city || 'Nie podano'}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePersonalInfo;
