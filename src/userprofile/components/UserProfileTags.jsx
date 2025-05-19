import React from 'react';
import tags from '../../creator/data/tags';

const UserProfileTags = ({ userTags }) => {
  const groupedTags = {};

  userTags.forEach((userTag) => {
    const fullTag = tags.find((tag) => tag.id === userTag.id);
    if (fullTag) {
      if (!groupedTags[fullTag.collectionId]) {
        groupedTags[fullTag.collectionId] = [];
      }
      groupedTags[fullTag.collectionId].push(fullTag);
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Tagi</h2>
      <div className="space-y-4">
        {Object.keys(groupedTags).map(
          (collectionId) =>
            groupedTags[collectionId].length > 0 && (
              <div key={collectionId}>
                <ul className="flex flex-wrap gap-2">
                  {groupedTags[collectionId].map((tag) => (
                    <li
                      className="bg-[#FDF4EE] text-[#CE8455] px-3 py-1 rounded-full text-sm"
                      key={tag.id}
                    >
                      {tag.text}
                    </li>
                  ))}
                </ul>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default UserProfileTags;
