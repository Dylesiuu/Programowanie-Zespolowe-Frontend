import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '@/context/userContext';
import { useAuthFetch } from '@/lib/authFetch';
import Image from 'next/image';
import { useRouter } from 'next/router';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const UserBasicInfoUpload = ({ isNew }) => {
  const userContext = useContext(UserContext);
  const fetchData = useAuthFetch();
  const router = useRouter();

  const [userInputs, setUserInputs] = useState({
    name: userContext.user?.name || '',
    lastname: userContext.user?.lastname || '',
    description: userContext.user?.description || '',
  });

  const [avatarData, setAvatarData] = useState({
    file: null,
    previewUrl: userContext.user?.avatar?.preview || '/img/default-avatar.svg',
    existingPublicId: userContext.user?.avatar?.publicId || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchLatestUser = async () => {
      try {
        const res = await fetchData(`${API_BASE_URL}/user/searchUserById`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`,
          },
          body: JSON.stringify({ id: userContext.user._id }),
        });

        if (res.ok) {
          const data = await res.json();
          userContext.setUser(data);
          setAvatarData((prev) => ({
            ...prev,
            previewUrl: data.avatar?.preview || '/img/default-avatar.svg',
            existingPublicId: data.avatar?.publicId || '',
          }));
        } else {
          console.error('Nie udało się pobrać danych użytkownika');
        }
      } catch (err) {
        console.error('Błąd przy pobieraniu danych użytkownika:', err);
      }
    };

    fetchLatestUser();
  }, []);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setUserInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarData({
        file,
        previewUrl: URL.createObjectURL(file),
        existingPublicId: avatarData.existingPublicId,
      });
    }
  };

  const handleAvatarUpload = async (photo) => {
    try {
      if (userContext.user?.avatar?.publicId) {
        const response = await fetchData(`${API_BASE_URL}/images`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`,
          },
          body: JSON.stringify({
            publicIds: [userContext.user.avatar.publicId],
          }),
        });
        if (!response.ok) {
          console.error('Nie udało się usunąć poprzedniego avatara');
        }
      }

      const formData = new FormData();
      formData.append('files', photo.file);

      const uploadResponse = await fetch(`${API_BASE_URL}/images/uploadUser`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userContext.token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        console.error('Nie udało się przesłać nowego avatara');
        return;
      }

      const uploadResult = await uploadResponse.json();
      const avatarInfo = Array.isArray(uploadResult)
        ? uploadResult[0]
        : uploadResult;

      const updateResponse = await fetchData(
        `${API_BASE_URL}/user/updateUserAvatar`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`,
          },
          body: JSON.stringify({
            avatar: {
              publicId: avatarInfo.publicId,
              preview: avatarInfo.url,
            },
          }),
        }
      );

      if (!updateResponse.ok) {
        console.error('Nie udało się zaktualizować avatara u użytkownika');
        return;
      }

      const updatedUser = await updateResponse.json();
      userContext.setUser(updatedUser.user);

      return avatarInfo;
    } catch (error) {
      console.error('Błąd przy aktualizacji avatara:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      if (
        avatarData.file &&
        userContext.user?.avatar?.preview !== avatarData.previewUrl
      ) {
        await handleAvatarUpload(avatarData);
      }

      if (userContext.user.name !== userInputs.name) {
        const response = await fetchData(`${API_BASE_URL}/user/update-name`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`,
          },
          body: JSON.stringify({ name: userInputs.name }),
        });
        if (!response.ok) console.error('Nie udało się zaktualizować imienia');

        const data = await response.json();
        userContext.setUser(data.user);
      }
      if (userContext.user.lastname !== userInputs.lastname) {
        const response = await fetchData(
          `${API_BASE_URL}/user/update-lastname`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userContext.token}`,
            },
            body: JSON.stringify({ lastname: userInputs.lastname }),
          }
        );
        if (!response.ok) console.error('Nie udało się zaktualizować nazwiska');

        const data = await response.json();
        userContext.setUser(data.user);
      }
      if (userContext.user.description !== userInputs.description) {
        const response = await fetchData(
          `${API_BASE_URL}/user/updateDescription`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userContext.token}`,
            },
            body: JSON.stringify({ description: userInputs.description }),
          }
        );
        console.log(response);
        if (!response.ok) console.error('Nie udało się zaktualizować opisu');

        const data = await response.json();
        userContext.setUser(data.user);
      }

      setSuccess(true);

      setTimeout(() => {
        if (isNew === 'true') {
          router.push(`/userCreatorPage`);
        } else {
          router.push(`/userProfilePage?userId=${userContext.user._id}`);
        }
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center px-4 h-full">
      <div className="w-full max-w-lg bg-[#FFF9F5]/80 rounded-lg shadow-md p-10">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-[#ecd2c0] text-[#C16A2E] rounded">
            Zaktualizowano dane!
          </div>
        )}

        <div className="mb-6 flex flex-col items-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-5">
            <Image
              src={avatarData.previewUrl}
              alt="Podgląd"
              className="object-cover w-full h-full"
              width={128}
              height={128}
            />
          </div>
          <div>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <label
              htmlFor="avatar"
              className="px-4 py-2 bg-[#CE8455] text-white cursor-pointer hover:bg-[#b5734d] transition rounded-2xl"
            >
              {avatarData.previewUrl ? 'Zmień zdjęcie' : 'Dodaj zdjęcie'}
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nameinput" className="block text-gray-700 mb-2">
              Imię
            </label>
            <input
              id="nameinput"
              type="text"
              name="name"
              value={userInputs.name}
              onChange={handleTextChange}
              className="w-full p-2 border border-[#CE8455] focus:outline-none focus:ring-1 focus:ring-[#CE8455] rounded-2xl"
              required
            />
          </div>

          <div>
            <label htmlFor="lastnameinput" className="block text-gray-700 mb-2">
              Nazwisko
            </label>
            <input
              id="lastnameinput"
              type="text"
              name="lastname"
              value={userInputs.lastname}
              onChange={handleTextChange}
              className="w-full p-2 border border-[#CE8455] focus:outline-none focus:ring-1 focus:ring-[#CE8455] rounded-2xl"
              required
            />
          </div>

          <div>
            <label
              htmlFor="descriptioninput"
              className="block text-gray-700 mb-2"
            >
              Opis
            </label>
            <textarea
              id="descriptioninput"
              name="description"
              value={userInputs.description}
              onChange={handleTextChange}
              rows="4"
              className="w-full p-2 border border-[#CE8455] focus:outline-none focus:ring-1 focus:ring-[#CE8455] resize-none overflow-auto rounded-2xl"
            />
          </div>
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-3 bg-[#CE8455] text-white rounded-2xl hover:bg-[#b5734d] transition ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </button>
            {!isNew && (
              <button
                type="button"
                onClick={() =>
                  router.push(`/userProfilePage?userId=${userContext.user._id}`)
                }
                className="w-full px-4 py-3 bg-[#F1CFB8] text-[#CE8455] hover:bg-[#DEC0AC] rounded-2xl  transition"
              >
                Wróć do profilu
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserBasicInfoUpload;
