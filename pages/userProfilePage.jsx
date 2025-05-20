import React, { useState, useEffect, useContext } from 'react';
import { useAuthFetch } from '@/lib/authFetch';
import { UserContext } from '@/context/userContext';
import ProfilePersonalInfo from '../src/userprofile/components/UserProfilePersonalInfo';
import ProfileAbout from '../src/userprofile/components/UserProfileAbout';
import UserProfileTags from '../src/userprofile/components/UserProfileTags';
import AnimalCard from '../src/userprofile/components/AnimalCard';
import { useRouter } from 'next/router';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const UserProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [favoriteAnimals, setFavoriteAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authFetch = useAuthFetch();
  const userContext = useContext(UserContext);
  const router = useRouter();
  const { userId } = router.query;

  useEffect(() => {
    if (userContext.isLoggedIn()) {
      return;
    }

    router.replace('/');
  }, [router, userContext]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authFetch(
          `${API_BASE_URL}/user/searchUserById`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userContext.token}`,
            },
            body: JSON.stringify({ id: userId }),
          }
        );
        if (!response.ok) console.error('Failed to fetch user data');

        const user = await response.json();
        setUserData({
          _id: user._id,
          name: user.name,
          avatar: user.avatar || 'img/default-avatar.svg',
          city: user.city || 'Nie podano',
          about: user.about || 'Brak opisu',
          tags: user.traits || [],
          favourites: user.favourites || [],
        });

        if (user.favourites && user.favourites.length > 0) {
          const favouriteAnimals = [];
          for (const animalId of user.favourites) {
            const animalResponse = await authFetch(
              `${API_BASE_URL}/animals/${animalId._id}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${userContext.token}`,
                },
              }
            );
            if (!animalResponse.ok) {
              console.error('Failed to fetch animal data');
              continue;
            }

            const animal = await animalResponse.json();
            favouriteAnimals.push(animal);
          }
          setFavoriteAnimals(favouriteAnimals);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (userContext.user?._id && userId) {
      console.log('sprawdzamy');
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userContext.user, userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF0E9] flex items-center justify-center">
        <p className="text-[#CE8455]">Ładowanie danych...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFF0E9] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#FFF0E9] flex items-center justify-center">
        <p className="text-red-500">
          Nie udało się załadować danych użytkownika
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF0E9] bg-[url('/cats.svg')] bg-repeat bg-[length:150rem_100rem] bg-fixed pt-12">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#FFF9F5]/80 rounded-lg shadow-md p-6">
              <ProfilePersonalInfo user={userData} />
            </div>
            <div className="bg-[#FFF9F5]/80 rounded-lg shadow-md p-6">
              <ProfileAbout about={userData.about} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-[#FFF9F5]/80 rounded-lg shadow-md p-6">
              <h2 className="text-2xl text-[#CE8455] font-bold mb-6">
                Zaserduszkowane zwierzęta
              </h2>

              {favoriteAnimals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {favoriteAnimals.map((animal) => (
                    <div key={animal._id}>
                      <AnimalCard
                        images={animal.images || []}
                        name={animal.name}
                        gender={animal.gender}
                        age={animal.age}
                        description={animal.description}
                        traits={animal.traits || []}
                        shelter={animal.shelter?.name || 'Brak danych'}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Brak zwierząt do wyświetlenia</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#FFF9F5]/80 rounded-lg shadow-md p-6">
              <UserProfileTags userId={userId} userTags={userData.tags} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
