import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '@/context/userContext';
import { useAuthFetch } from '@/lib/authFetch';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const PendingShelterApplications = ({ onUpdate }) => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const userContext = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const fetchData = useAuthFetch();
  const [locationName, setLocationName] = useState('');

  const reverseGeocode = async (latlng) => {
    const { lat, lng } = latlng;
    const apiKey = process.env.NEXT_PUBLIC_MAP_TRANSLATE;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const result = data.results[0];

      setLocationName(result.formatted);
    } catch (error) {
      console.error('Reverse geocode error:', error);
    }
  };

  useEffect(() => {
    if (selectedApp) {
      reverseGeocode({
        lat: selectedApp.shelterData.location[0],
        lng: selectedApp.shelterData.location[1],
      });
    }
  }, [selectedApp]);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await fetchData(
          `${API_BASE_URL}/shelter-applications/pending`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userContext.token}`,
            },
          }
        );
        const data = await response.json();
        setApplications(data || []);
      } catch (e) {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleDecision = async (id, decision) => {
    try {
      await fetchData(
        `${API_BASE_URL}/shelter-applications/${id}/${decision}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`,
          },
        }
      );
      setApplications((apps) => apps.filter((app) => app._id !== id));
      setSelectedApp(null);
      if (onUpdate) onUpdate();
    } catch (e) {
      alert('Wystąpił błąd podczas przetwarzania wniosku.');
    }
  };

  return (
    <div className="w-full bg-[#FFF9F5]/80 rounded-lg shadow-md p-6 mt-8">
      <h3 className="text-lg font-semibold text-[#CE8455] mb-4">
        Oczekujące wnioski o schronisko
      </h3>
      {loading ? (
        <div className="text-[#CE8455]">Ładowanie...</div>
      ) : applications.length === 0 ? (
        <div className="text-gray-500">Brak oczekujących wniosków.</div>
      ) : (
        <ul className="space-y-3">
          {applications.map((app) => (
            <li
              key={app._id}
              className="bg-white rounded-lg shadow p-4 flex justify-between items-center cursor-pointer hover:bg-[#FFF0E9] transition"
              onClick={() => setSelectedApp(app)}
            >
              <span>
                <span className="font-semibold text-[#CE8455]">
                  {app.shelterData.name}
                </span>
              </span>
              <span className="text-xs text-gray-400">
                Kliknij, aby zobaczyć szczegóły
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-2 right-4 bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] w-8 h-8 flex items-center justify-center rounded-full shadow-md cursor-pointer"
              onClick={() => setSelectedApp(null)}
              aria-label="Zamknij"
            >
              ✕
            </button>
            <h4 className="text-xl font-bold text-[#CE8455] mb-4">
              Wniosek o schronisko
            </h4>
            <div className="mb-2">
              <span className="font-semibold">Nazwa:</span>{' '}
              {selectedApp.shelterData.name}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Adres:</span> {locationName}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Email:</span>{' '}
              {selectedApp.shelterData.email}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Strona:</span>{' '}
              {selectedApp.shelterData.website ? (
                <a
                  href={selectedApp.shelterData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {selectedApp.shelterData.website}
                </a>
              ) : (
                <span className="text-gray-400">brak</span>
              )}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Użytkownik:</span>{' '}
              {selectedApp.user && selectedApp.user._id ? (
                <>
                  <a
                    href={`/userProfilePage?userId=${selectedApp.user._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline break-all"
                  >
                    {selectedApp.user.name} {selectedApp.user.lastname}
                  </a>
                  <span className="ml-2 text-gray-600">
                    {selectedApp.user.email}
                  </span>
                </>
              ) : (
                <span className="text-gray-400">brak</span>
              )}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Opis:</span>{' '}
              {selectedApp.shelterData.description}
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200 font-semibold"
                onClick={() => handleDecision(selectedApp._id, 'reject')}
              >
                Odrzuć
              </button>
              <button
                className="px-4 py-2 rounded bg-green-100 text-green-700 hover:bg-green-200 font-semibold"
                onClick={() => handleDecision(selectedApp._id, 'approve')}
              >
                Zatwierdź
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingShelterApplications;
