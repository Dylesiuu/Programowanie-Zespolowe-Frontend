import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/userContext';
import MapComponent from '../src/localization/components/mapComponent';
import { useAuthFetch } from '@/lib/authFetch';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const ShelterCreator = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    website: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [position, setPosition] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [showMap, setShowMap] = useState(false);
  const router = useRouter();
  const userContext = useContext(UserContext);
  const fetchData = useAuthFetch();
  const { shelterId } = router.query;

  useEffect(() => {
    if (!userContext.isLoggedIn()) {
      router.replace('/');
    }
  }, [router, userContext]);

  const fetchShelterData = async (id) => {
    try {
      const response = await fetchData(`${API_BASE_URL}/shelter/find-by-id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userContext.token}`,
        },
        body: JSON.stringify({ shelterId: id }),
      });

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }

      const data = await response.json();
      setFormData({
        name: data.shelter.name,
        email: data.shelter.email,
        phone: data.shelter.phoneNumber,
        description: data.shelter.description,
        website: data.shelter.website || '',
      });
      setPosition([data.shelter.location[0], data.shelter.location[1]]);
    } catch (error) {
      console.error('Error fetching animal data:', error.message);
    }
  };

  useEffect(() => {
    if (shelterId && shelterId !== 'null') {
      fetchShelterData(shelterId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shelterId]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Wymagana nazwa';
    if (!position) newErrors.position = 'Wymagana lokalizacja na mapie';
    if (!formData.email) newErrors.email = 'Wymagany email';
    if (!formData.phone) newErrors.phone = 'Wymagany telefon';
    if (!formData.website)
      newErrors.website = 'Wymagany adres strony internetowej';
    if (!formData.description || formData.description.length < 10)
      newErrors.description = 'Wymagany opis, min 10 znaków';

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (shelterId && shelterId !== 'null') {
        const res = await fetchData(`${API_BASE_URL}/shelter/edit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            phoneNumber: formData.phone,
            email: formData.email,
            description: formData.description,
            location: position,
            website: formData.website,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          router.push(
            `/shelterProfilePage?shelterId=${shelterId}&animalId=null`
          );
        } else {
          alert(
            data.message || 'Wystąpił błąd podczas aktualizacji schroniska.'
          );
        }
      } else {
        const res = await fetchData(`${API_BASE_URL}/shelter-applications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            phoneNumber: formData.phone,
            email: formData.email,
            description: formData.description,
            location: position,
            website: formData.website,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          // userContext.setUser(data.user);
          // userContext.setToken(data.token);
          router.push({
            pathname: '/swipePage',
            query: { created: 'true' },
          });
        } else {
          alert(data.message || 'Wystąpił błąd podczas tworzenia schroniska.');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Błąd sieci.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen bg-[#FFF0E9] bg-[url('/Union.svg')] bg-repeat bg-[length:150rem_100rem]">
      <form
        onSubmit={handleSubmit}
        className="mx-auto p-6 w-full max-w-2xl bg-white rounded-2xl shadow-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          {shelterId && shelterId !== 'null'
            ? 'Zaktualizuj schronisko'
            : 'Zarejestruj schronisko'}
        </h1>

        {[
          { label: 'Nazwa schroniska', name: 'name', type: 'text' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Telefon', name: 'phone', type: 'text' },
          { label: 'Strona internetowa', name: 'website', type: 'text' },
        ].map(({ label, name, type }) => (
          <div key={name} className="mb-4">
            <label className="block text-sm font-semibold mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-2"
            />
            {errors[name] && (
              <p className="text-red-500 text-sm">{errors[name]}</p>
            )}
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Opis schroniska
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-2"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Lokalizacja */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Lokalizacja
          </label>
          <button
            type="button"
            onClick={() => setShowMap(true)}
            className="mb-2 px-4 py-2 rounded bg-[#f4a261] text-white hover:bg-amber-600"
          >
            Wybierz na mapie
          </button>
          {locationName && (
            <p>
              Wybrana lokalizacja: <strong>{locationName}</strong>
            </p>
          )}
          {errors.position && (
            <p className="text-red-500 text-sm">{errors.position}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#f4a261] hover:bg-[#e99549] text-white font-semibold py-2 px-4 rounded-xl transition disabled:opacity-50"
        >
          {isSubmitting
            ? 'Wysyłanie...'
            : shelterId && shelterId !== 'null'
              ? 'Zaktualizuj'
              : 'Aplikuj'}
        </button>
      </form>

      {showMap && (
        <MapComponent
          onLocationSelect={(pos, name) => {
            setPosition([pos.lat, pos.lng]);
            setLocationName(name);
            setShowMap(false);
          }}
          onCancel={() => setShowMap(false)}
          setLocationName={setLocationName}
          detailLevel="full"
        />
      )}
    </div>
  );
};

export default ShelterCreator;
