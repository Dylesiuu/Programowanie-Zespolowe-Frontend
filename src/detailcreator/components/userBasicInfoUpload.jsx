import React, { useState, useContext } from 'react';
import { UserContext } from '@/context/userContext';
import { useAuthFetch } from '@/lib/authFetch';
import Image from 'next/image';
import { useRouter } from 'next/router';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const UserBasicInfoEditor = ({ userData, onUpdate }) => {
  const userContext = useContext(UserContext);
  const authFetch = useAuthFetch();
  const router = useRouter();

  const [userInputs, setUserInputs] = useState({
    name: userData?.name || '',
    lastname: userData?.lastname || '',
    about: userData?.about || '',
  });

  const [avatarData, setAvatarData] = useState({
    file: null,
    previewUrl: userData?.avatar?.url || '/img/default-avatar.svg',
    existingPublicId: userData?.avatar?.publicId || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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

  const updateField = async (fieldName, value) => {
    const endpointMap = {
      name: 'update-name',
      lastname: 'update-lastname',
      about: 'update-about-temp',
    };

    const requestBody = { [fieldName]: value };

    const response = await authFetch(
      `${API_BASE_URL}/user/${endpointMap[fieldName]}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userContext.token}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok)
      throw new Error(`Nie udało się zaktualizować pola: ${fieldName}`);
    return await response.json();
  };

  const handleAvatarUpload = async () => {
    if (!avatarData.file && !avatarData.existingPublicId) {
      return [
        {
          url: '/img/default-avatar.svg',
          publicId: '',
        },
      ];
    }

    if (!avatarData.file) return null;

    if (avatarData.existingPublicId) {
      await authFetch(`${API_BASE_URL}/images/${avatarData.existingPublicId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userContext.token}`,
        },
      });
    }

    const formData = new FormData();
    formData.append('files', avatarData.file);

    const uploadResponse = await authFetch(
      `${API_BASE_URL}/images/uploadUser`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userContext.token}`,
        },
        body: formData,
      }
    );

    if (!uploadResponse.ok) throw new Error('Błąd przesyłania zdjęcia');
    return await uploadResponse.json();
  };

  const updateUserAvatar = async (imageData) => {
    const response = await authFetch(`${API_BASE_URL}/user/update-avatar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userContext.token}`,
      },
      body: JSON.stringify({
        avatar: {
          url: imageData.url,
          publicId: imageData.publicId || '',
        },
      }),
    });

    if (!response.ok) throw new Error('Błąd aktualizacji avataru');
    return await response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const updates = [];
      for (const [field, value] of Object.entries(userInputs)) {
        if (value !== userData?.[field]) {
          updates.push(updateField(field, value));
        }
      }

      let avatarUpdate = null;
      if (avatarData.file) {
        const uploadedImages = await handleAvatarUpload();
        avatarUpdate = await updateUserAvatar(uploadedImages[0]);
      }

      const allUpdates = [...updates, avatarUpdate].filter(Boolean);
      const latestUserData =
        allUpdates[allUpdates.length - 1]?.user || userData;

      if (latestUserData) {
        userContext.setUser(latestUserData);
        if (onUpdate) onUpdate(latestUserData);
      }

      setSuccess(true);
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
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
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
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <label
              htmlFor="avatar"
              className="px-4 py-2 bg-[#CE8455] text-white rounded cursor-pointer hover:bg-[#b5734d] transition rounded-2xl"
            >
              {avatarData.previewUrl ? 'Zmień zdjęcie' : 'Dodaj zdjęcie'}
            </label>
          </div>
        </div>

        {/* Formularz */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Imię</label>
            <input
              type="text"
              name="name"
              value={userInputs.name}
              onChange={handleTextChange}
              className="w-full p-2 border border-[#CE8455] rounded focus:outline-none focus:ring-1 focus:ring-[#CE8455] rounded-2xl"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Nazwisko</label>
            <input
              type="text"
              name="lastname"
              value={userInputs.lastname}
              onChange={handleTextChange}
              className="w-full p-2 border border-[#CE8455] rounded focus:outline-none focus:ring-1 focus:ring-[#CE8455] rounded-2xl"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Opis</label>
            <textarea
              name="about"
              value={userInputs.about}
              onChange={handleTextChange}
              rows="4"
              className="w-full p-2 border border-[#CE8455] rounded focus:outline-none focus:ring-1 focus:ring-[#CE8455] resize-none overflow-auto rounded-2xl"
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
            <button
              type="button"
              onClick={() => router.push(`/userProfilePage?userId=${userContext.user._id}`)}
              className="w-full px-4 py-3 bg-[#F1CFB8] text-[#CE8455] hover:bg-[#DEC0AC] rounded-2xl  transition"
            >
              Wróć do profilu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserBasicInfoEditor;
