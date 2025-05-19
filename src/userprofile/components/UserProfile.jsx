import React from 'react';
import ProfilePersonalInfo from './UserProfilePersonalInfo';
import ProfileAbout from './UserProfileAbout';
import ProfileTags from './UserProfileTags';
import AnimalCard from './AnimalCard';
import mockUser from './mockUser';
import mockAnimals from './mockAnimals';

const UserProfile = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - user info */}
          <div className="lg:col-span-1 space-y-6">
            <ProfilePersonalInfo user={mockUser} />
            <ProfileAbout about={mockUser.about} />
            <ProfileTags tags={mockUser.tags} />
          </div>

          {/* Right column - animals */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Zwierzęta do adopcji</h2>

            {mockAnimals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockAnimals.map((animal) => (
                  <AnimalCard
                    key={animal.id}
                    images={animal.images}
                    name={animal.name}
                    gender={animal.gender}
                    age={animal.age}
                    location={animal.location}
                    description={animal.description}
                    traits={animal.traits}
                    shelter={animal.shelter}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Brak zwierząt do wyświetlenia</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
