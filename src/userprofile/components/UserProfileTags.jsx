import React from 'react';

const UserProfileTags = ({ userTags }) => {
  return (
    <div className="bg-[#fefaf7] rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl text-[#CE8455] font-bold mb-4 ">Tagi</h2>
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
