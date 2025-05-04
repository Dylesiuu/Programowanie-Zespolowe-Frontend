import Image from 'next/image';
import { BiHome, BiDesktop, BiClipboard } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef, useCallback } from 'react';
import { UserContext } from '@/context/userContext';
import { useContext } from 'react';
import UserSearchBar from './userSearchBar';
import ShelterSearchBar from './shelterSearchbar';

const Navbar = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userContext = useContext(UserContext);
  const [isUserSearch, setIsUserSearch] = useState(true); // Toggle state for search bar

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
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
        <div className="flex h-full w-full items-center justify-center space-x-2">
          <div className="flex flex-col items-start space-y-1">
            <div className="flex items-center">
              <input
                type="radio"
                id="userSearch"
                name="searchType"
                value="user"
                checked={isUserSearch}
                onChange={() => setIsUserSearch(true)}
                className="mr-2 cursor-pointer accent-[#ba6c3b] focus:ring-[#FFD1DC]"
              />
              <label htmlFor="userSearch" className="text-sm cursor-pointer">
                Użytkownicy
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="shelterSearch"
                name="searchType"
                value="shelter"
                checked={!isUserSearch}
                onChange={() => setIsUserSearch(false)}
                className="mr-2 cursor-pointer accent-[#ba6c3b] focus:ring-[#FFD1DC]"
              />
              <label htmlFor="shelterSearch" className="text-sm cursor-pointer">
                Schroniska
              </label>
            </div>
          </div>
          {/* Search bar */}
          {isUserSearch ? (
            <UserSearchBar />
          ) : (
            <ShelterSearchBar userContext={userContext} />
          )}
        </div>
        {/* Buttons for navigation */}
        <div className="flex flex-shrink-0 items-center justify-end space-x-[0.625rem] sm:space-x-1.5">
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
              onClick={() => router.push('/shelterProfilePage')}
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
                onClick={() => {
                  userContext.logout();
                }}
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
