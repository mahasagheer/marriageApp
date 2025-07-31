import React, { useEffect, useRef, useState } from "react";
import { FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LogoTwo from "../../assets/logoTwo.png";
import { Button } from "./Button";

export const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    closeMenus();
    navigate("/login");
  };

  const handleViewProfile = () => {
    navigate(`/user/${user.id}`);
    closeMenus();
  };

  const handleHomeClick = () => {
    navigate("/home");
    setMenuOpen(false);
  };

  const handleMatchMakingClick = () => {
    navigate("/user/agencies");
    setMenuOpen(false);
  };

  const closeMenus = () => {
    setMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white/90 dark:bg-gray-900 text-gray-800 dark:text-white py-3 px-4 md:px-8 lg:px-[10%] flex justify-between items-center shadow-md relative z-30 transition-colors duration-300">
      {/* Logo */}
      <div className="flex items-center flex-shrink-0 cursor-pointer" onClick={() => navigate("/")}>
        <img
          src={LogoTwo}
          alt="WedLink"
          className="h-12 md:h-20 bg-white dark:bg-gray-100 mx-auto rounded-full transition"
        />
      </div>

      {/* Hamburger Menu (Mobile) */}
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
          className="text-marriageHotPink  focus:outline-none"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Desktop Menu */}
      {user?.role === "user" && (
        <>
          <div className="hidden md:flex items-center space-x-4">
            <Button btnText="Home" onClick={handleHomeClick} />
            <Button btnText="MatchMaking" onClick={handleMatchMakingClick} />
            
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center focus:outline-none"
              >
                <FiUser className="w-10 h-10 p-2 rounded-full bg-gray-50 dark:bg-gray-700 text-marriageHotPink  border-2 border-marriageHotPink " />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-40 animate-fadeIn">
                  <button
                    onClick={handleViewProfile}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-950 shadow-lg border-t border-pink-100 dark:border-gray-700 md:hidden animate-fadeIn flex flex-col items-center py-4 z-40">
              <button onClick={handleHomeClick} className="py-2 w-full text-center text-marriageHotPink  hover:bg-gray-100 dark:hover:bg-gray-700">
                Home
              </button>
              <button onClick={handleMatchMakingClick} className="py-2 w-full text-center text-marriageHotPink  hover:bg-gray-100 dark:hover:bg-gray-700">
                MatchMaking
              </button>
              <button onClick={handleViewProfile} className="py-2 w-full text-center text-marriageHotPink  hover:bg-gray-100 dark:hover:bg-gray-700">
                View Profile
              </button>
              <button onClick={handleLogout} className="py-2 w-full text-center text-marriageHotPink  hover:bg-gray-100 dark:hover:bg-gray-700">
                Log Out
              </button>
            </div>
          )}
        </>
      )}
    </nav>
  );
};
