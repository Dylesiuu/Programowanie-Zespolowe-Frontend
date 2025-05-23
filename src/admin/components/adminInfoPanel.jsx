import React from 'react';
import Image from 'next/image';

const AdminInfoPanel = ({ user }) => (
  <div className="bg-[#FFF9F5]/80 rounded-lg shadow-md p-6 flex flex-col items-center">
    <div className="w-24 h-24 rounded-full bg-[#CE8455] flex items-center justify-center text-white text-4xl font-bold mb-4 overflow-hidden">
      {user?.avatar?.preview ? (
        <Image
          src={user.avatar.preview}
          alt="Admin avatar"
          width={96}
          height={96}
          className="w-24 h-24 rounded-full object-cover"
        />
      ) : (
        <span>👑</span>
      )}
    </div>
    <div className="text-center">
      <div className="text-lg font-bold text-[#CE8455] mb-1">
        {user?.name || 'Administrator'}
      </div>
      <div className="text-sm text-gray-600">{user?.email}</div>
    </div>
  </div>
);

export default AdminInfoPanel;
