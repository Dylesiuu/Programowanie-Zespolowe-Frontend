import React from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { useRouter } from 'next/router';

const UserProfileTags = ({ userId, userTags }) => {
  const router = useRouter();
  return (
    <div className="bg-[#fefaf7] rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <h2 className="text-xl text-[#CE8455] font-bold">Tagi</h2>
        <FaRegEdit
          className="w-6 h-6 text-[#CE8455] cursor-pointer"
          onClick={() => router.push(`/userCreatorPage?userId=${userId}`)}
        />
      </div>

      <div className="space-y-4">
        {userTags.map((tag) => (
          <div key={tag._id}>
            <ul className="flex flex-wrap gap-2">
              <li
                className="bg-[#fefaf7] text-[#CE8455] border border-[#CE8455] shadow-lg px-3 py-1 rounded-full text-sm"
                key={tag._id}
              >
                {tag.text}
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfileTags;
