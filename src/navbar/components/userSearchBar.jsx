import React, { useState, useRef, useEffect } from 'react';
import { useAuthFetch } from '@/lib/authFetch';
import { useRouter } from 'next/router';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const UserSearchBar = ({ userContext }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchDropdownRef = useRef(null);
  const fetchData = useAuthFetch();
  const router = useRouter();

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const debouncedSearch = useRef(
    debounce(async (query) => {
      if (query.length >= 2) {
        setIsSearching(true);
        try {
          console.log('Searching for users:', query);
          const response = await fetchData(`${API_BASE_URL}/user/searchUser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userContext.token}`,
            },
            body: JSON.stringify({ search: query }),
          });
          if (!response.ok) console.error('Network response was not ok');
          const data = await response.json();
          if (data.data) {
            setSearchResults(data.data);
          } else {
            setSearchResults([]);
          }
          setIsSearchDropdownOpen(true);
        } catch (error) {
          console.error('Error searching users:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setIsSearchDropdownOpen(false);
      }
    }, 300)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel?.();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target)
      ) {
        setIsSearchDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative w-full max-w-[25rem] items-center"
      ref={searchDropdownRef}
    >
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        onFocus={() => searchQuery.length >= 2 && setIsSearchDropdownOpen(true)}
        placeholder="Wpisz imię lub nazwisko użytkownika..."
        className="px-2 py-2 w-full h-full rounded-lg border bg-[#fefaf7] border-[#FFD1DC] text-black focus:outline-none focus:ring-2 focus:ring-[#AA673C]"
      />

      {/* Search results dropdown */}
      {isSearchDropdownOpen && (
        <div
          data-testid="dropdown"
          className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {isSearching ? (
            <div className="p-2 rounded-lg shadow-lg z-50 bg-[#CE8455] text-white">
              Wyszukiwanie...
            </div>
          ) : searchResults.length > 0 ? (
            <ul>
              {searchResults.map((user) => (
                <li
                  key={user._id}
                  className="px-4 py-2 bg-[#CE8455] hover:bg-[#AA673C] cursor-pointer text-white"
                  onClick={() => {
                    router.push(`/userProfilePage?userId=${user._id}`);
                    setIsSearchDropdownOpen(false);
                  }}
                >
                  {user.name + (user.lastname ? ` ${user.lastname}` : '')}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-2 rounded-lg shadow-lg z-50 bg-[#CE8455] text-white">
              Brak wyników
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearchBar;
