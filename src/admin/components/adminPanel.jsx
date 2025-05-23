import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '@/context/userContext';
import { useAuthFetch } from '@/lib/authFetch';
import AdminInfoPanel from './adminInfoPanel';
import SheltersPanel from './sheltersPanel';

const AdminPanel = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const userContext = useContext(UserContext);
  const fetchData = useAuthFetch();

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const response = await fetchData(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/shelter/all`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userContext.token}`,
            },
          }
        );
        if (!response.ok) {
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to fetch shelters:', errorText);
          }
        }
        const data = await response.json();
        setShelters(data.shelters || []);
      } catch (e) {
        setShelters([]);
        console.error('Error fetching shelters:', e);
      } finally {
        setLoading(false);
      }
    };

    if (userContext.user?.role === 'admin') {
      console.log('Fetching shelters for admin');
      fetchShelters();
    }
  }, [userContext.user?.role, userContext.token]);

  if (userContext.user?.role !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-xl text-red-600 font-semibold">
          Dostęp tylko dla administratora.
        </span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span>Ładowanie schronisk...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF0E9] bg-[url('/cats.svg')] bg-repeat bg-[length:150rem_100rem] bg-fixed pt-12">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left panel - admin info */}
          <div className="lg:col-span-1 space-y-6">
            <AdminInfoPanel user={userContext.user} />
            <div className="bg-[#FFF9F5]/80 rounded-lg shadow-md p-6">
              <div className="text-[#CE8455] font-semibold mb-2">
                Panel administratora
              </div>
              <div className="text-gray-700 text-sm">
                Tutaj możesz przeglądać i zarządzać wszystkimi schroniskami w
                systemie.
              </div>
            </div>
          </div>

          {/* Center panel - shelters */}
          <div className="lg:col-span-2">
            <SheltersPanel shelters={shelters} />
          </div>

          {/* Right panel - placeholder for future admin features */}
          <div className="lg:col-span-1">
            <div className="bg-[#FFF9F5]/80 rounded-lg shadow-md p-6 flex flex-col items-center">
              <div className="text-[#CE8455] font-semibold mb-2">
                Statystyki (wkrótce)
              </div>
              <div className="text-gray-700 text-sm text-center">
                Tutaj pojawią się statystyki i narzędzia administracyjne.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
