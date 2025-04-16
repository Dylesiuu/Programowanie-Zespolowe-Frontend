import Image from 'next/image';
import { BiHome, BiDesktop, BiClipboard } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef, useCallback } from 'react';

const Navbar = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // const debouncedSearch = useRef(
  //   debounce(async (query) => {
  //     if (query.length >= 2) {
  //       setIsSearching(true);
  //       try {
  //         const response = await fetch(`${API_BASE_URL}/auth/login`);
  //         if (!response.ok) throw new Error('Network response was not ok');
  //         const data = await response.json();
  //         setSearchResults(data);
  //         setIsSearchDropdownOpen(true);
  //       } catch (error) {
  //         console.error("Error searching users:", error);
  //         setSearchResults([]);
  //       } finally {
  //         setIsSearching(false);
  //       }
  //     } else {
  //       setSearchResults([]);
  //       setIsSearchDropdownOpen(false);
  //     }
  //   }, 300)
  // ).current;

  const debouncedSearch = useRef(
    debounce(async (query) => {
      if (query.length >= 2) {
        setIsSearching(true);

        // Mockowana tablica użytkowników
        const mockUsers = [
          { id: 1, name: 'Jan Kowalski', email: 'jan@example.com' },
          { id: 2, name: 'Anna Nowak', email: 'anna@example.com' },
          { id: 3, name: 'Janek Wiśniewski', email: 'piotr@example.com' },
          { id: 4, name: 'Maria Lewandowska', email: 'maria@example.com' },
          { id: 5, name: 'Adam Mickiewicz', email: 'adam@example.com' },
        ];

        try {
          // Symulacja opóźnienia sieciowego (300ms)
          await new Promise((resolve) => setTimeout(resolve, 300));

          // Filtrowanie mockowanych użytkowników
          const filteredUsers = mockUsers.filter(
            (user) =>
              user.name.toLowerCase().includes(query.toLowerCase()) ||
              user.email.toLowerCase().includes(query.toLowerCase())
          );

          setSearchResults(filteredUsers);
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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }

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
    <div className="fixed h-15 px-3 w-screen bg-[#CE8455] z-[1001]">
      <div className="flex h-full w-full justify-between items-center text-white text-[0.9375rem] space-x-[0.625rem] sm:space-x-[1.25rem]">
        <div>Logo</div>
        {/* Search bar with dropdown */}
        <div
          className="relative w-full items-center max-w-[25rem]"
          ref={searchDropdownRef}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() =>
              searchQuery.length >= 2 && setIsSearchDropdownOpen(true)
            }
            placeholder="Wpisz imię lub nazwisko użytkownika..."
            className="px-2 py-2 w-full h-full rounded-lg border bg-[#fefaf7] border-[#FFD1DC] text-black focus:outline-none focus:ring-2 focus:ring-[#AA673C]"
          />

          {/* Search results dropdown */}
          {isSearchDropdownOpen && !isSearching && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              <ul>
                {searchResults.map((user) => (
                  <li
                    key={user.id}
                    className="px-4 py-2 bg-[#CE8455] hover:bg-[#AA673C] cursor-pointer text-white"
                    onClick={() => {
                      alert('/profile');
                      setIsSearchDropdownOpen(false);
                    }}
                  >
                    {user.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isSearching && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-50 p-2 bg-[#CE8455] text-white">
              Wyszukiwanie...
            </div>
          )}
        </div>
        {/* Buttons for navigation */}
        <div className="flex flex-shrink-0 items-center justify-end space-x-[0.625rem] sm:space-x-[1.875rem]">
          {/* Admin control panel button */}
          <div>
            <button
              className="flex cursor-pointer items-center space-x-1"
              onClick={() => alert('Panel')}
            >
              <span className="flex items-center">
                <BiDesktop className="text-[1.5625rem]" />
              </span>
              <span className="hidden md:block">Panel Kontrolny</span>
            </button>
          </div>
          {/* Shelter button */}
          <div>
            <button
              className="flex cursor-pointer items-center space-x-1 "
              onClick={() => alert('schronisko')}
            >
              <span className="flex items-center">
                <BiClipboard className="text-[1.5625rem]" />
              </span>
              <span className="hidden md:block">Schronisko</span>
            </button>
          </div>
          {/* Home button */}
          <div>
            <button
              className="flex cursor-pointer items-center space-x-1 "
              onClick={() => router.push('/swipePage')}
            >
              <span className="flex items-center">
                <BiHome className="text-[1.5625rem]" />
              </span>
              <span className="hidden md:block">Strona Główna</span>
            </button>
          </div>
          {/* Profile */}
          <div className="flex-shrink-0">
            <button className="cursor-pointer" onClick={toggleDropdown}>
              <Image
                src="/img/profile.png"
                alt="User Profile"
                width={50}
                height={50}
                className="w-[2.5rem] h-[2.5rem] rounded-full object-cover"
              />
            </button>
          </div>
        </div>
      </div>
      {/* Dropdown list */}
      <div ref={dropdownRef}>
        {isDropdownOpen && (
          <div className="absolute right-0 w-48 bg-[#CE8455] text-white text-[0.625rem] sm:text-[0.9375rem] text rounded-b-lg shadow-lg">
            <ul>
              <li
                className="px-4 py-2 hover:bg-[#AA673C] cursor-pointer"
                onClick={() => alert('/profile')}
              >
                Profile
              </li>
              <li
                className="px-4 py-2 hover:bg-[#AA673C] cursor-pointer"
                onClick={() => alert('/settings')}
              >
                Settings
              </li>
              <li
                className="px-4 py-2 hover:bg-[#AA673C] hover:rounded-b-lg cursor-pointer"
                onClick={() => alert('Logged out!')}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
export default Navbar;
