import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    console.log("User logged out");
    setProfileDropdownOpen(false);
    setMenuOpen(false);
    navigate("/login");
  };

  const handleViewProfile = () => {
    navigate("/user/profile");
    console.log("View profile clicked");
    setProfileDropdownOpen(false);
    setMenuOpen(false);
  };

  const handleHomeClick = () => {
    navigate("/home");
    setMenuOpen(false);
  };

  const handleMatchMakingClick = () => {
    navigate("/user/agencies");
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white/90 py-3 px-3 md:px-8 lg:px-[10%] flex justify-between items-center font-serif relative z-20">
      <div className="flex items-center flex-shrink-0">
        <img
          src={logo}
          alt="WedLink"
          className="h-12 md:h-20 bg-white mx-auto"
        />
      </div>

      {/* Hamburger for mobile */}
      <div className="md:hidden flex items-center">
        <button
          className="text-marriageHotPink focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {user?.role === 'user' && (
        <>
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 items-center">
            <Button btnText={"Home"} onClick={handleHomeClick} />
            <Button btnText={"MatchMaking"} onClick={handleMatchMakingClick} />

            {/* Profile Dropdown */}
            <div className="relative ml-4">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <FiUser className="w-12 h-12 p-2 rounded-full border-2 bg-gray-50 text-marriageHotPink border-marriageHotPink"
                />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30">
                  <button
                    onClick={handleViewProfile}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {menuOpen && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg flex flex-col items-center py-4 md:hidden animate-fadeIn z-30">
              <span
                className="w-full text-center py-2 text-marriageHotPink cursor-pointer"
                onClick={handleHomeClick}
              >
                Home
              </span>
              <span
                className="w-full text-center py-2 text-marriageHotPink cursor-pointer"
                onClick={handleMatchMakingClick}
              >
                MatchMaking
              </span>
              <span
                onClick={handleViewProfile}
                className="w-full text-center py-2 text-marriageHotPink cursor-pointer"
              >
                View Profile
              </span>
              <span
                onClick={handleLogout}
                className="w-full text-center py-2 text-marriageHotPink cursor-pointer"
              >
                Log Out
              </span>
            </div>
          )}
        </>
      )}
    </nav>
  );
};