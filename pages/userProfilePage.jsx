import React from 'react';
import mockUser from '../src/userprofile/components/mockUser';
import mockAnimals from '../src/userprofile/components/mockAnimals';
import ProfilePersonalInfo from '../src/userprofile/components/UserProfilePersonalInfo';
import ProfileAbout from '../src/userprofile/components/UserProfileAbout';
import UserProfileTags from '../src/userprofile/components/UserProfileTags';
import AnimalCard from '../src/userprofile/components/AnimalCard';

const UserProfilePage = () => {
  return (
    <div className="min-h-screen bg-[#FFF0E9] bg-[url('/cats.svg')] bg-repeat bg-[length:150rem_100rem] bg-fixed pt-12">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <ProfilePersonalInfo user={mockUser} />
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <ProfileAbout about={mockUser.about} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">
                Zaserduszkowane zwierzęta
              </h2>

              {mockAnimals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {mockAnimals.map((animal) => (
                    <AnimalCard key={animal.id} {...animal} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Brak zwierząt do wyświetlenia</p>
              )}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <UserProfileTags userTags={mockUser.tags} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
