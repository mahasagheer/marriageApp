import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {  FiUsers, FiCalendar, FiFileText, FiBarChart2, FiSettings, FiMenu, FiUser, FiX } from "react-icons/fi";
import {FaUserPlus, FaBuilding,  } from "react-icons/fa";

const OwnerSidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Role-based nav links
  let navLinks = [];
  if (user?.role === 'hall-owner' || user?.role === 'manager') {
    navLinks = [
      { to: `/${user?.id}`, label: 'Dashboard', icon: <FiBarChart2 /> },
      { to: `/${user?.id}/halls`, label: 'Halls', icon: <FiFileText /> },
      { to: `/${user?.id}/my-bookings`, label: 'My Bookings', icon: <FiCalendar /> },
    ];
  } else if (user?.role === 'admin') {
    navLinks = [
      { to:  `/${user?.id}`, label: 'Admin Dashboard', icon: <FiBarChart2 /> },
      { to: `/${user?.id}/halls`, label: 'All Halls', icon: <FiFileText /> },
      { to: `/${user?.id}/my-bookings`, label: 'All Bookings', icon: <FiCalendar /> },
      { to: `/${user?.id}/associate-manager`, label: 'Associate Manager', icon: <FiUsers /> },
    ];
  } else if(user?.role ==="user"){
    navLinks =  [
      { label: "My Profile", icon: <FiUser />, to: "/user/profile" },
      { label: "Agencies", icon: <FaBuilding />, to: "/user/agencies" },
      { label: "Forms", icon: <FaUserPlus />, to: "/user/forms" },
    ]
  } else if(user?.role==="agency"){
    navLinks=[
      { label: "Agency Dashboard", icon: <FaBuilding />, to: "/agency" },
      { label: "Agency Profile", icon: <FaBuilding />, to: "/agency/profile" },
      { label: "Candidates", icon: <FaUserPlus />, to: "/agency/users" },
    ]
  }

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    navigate("/login");
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!showProfileDropdown) return;
    function handleClick(e) {
      if (!document.getElementById('profile-dropdown')?.contains(e.target) &&
          !document.getElementById('profile-dropdown-btn')?.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showProfileDropdown]);

  return (
    <aside
      className={`fixed top-0 left-0 h-[98vh] w-[10vw] max-w-full bg-white dark:bg-gray-900 dark:border-gray-600 text-gray-800 rounded-xl m-2 shadow-2xl border border-gray-200 z-40 flex flex-col transition-transform duration-300 md:translate-x-0 ${onClose ? 'translate-x-0' : ''}`}
      style={{ minWidth: '16rem' }}
    >
      {/* Mobile close button */}
      {onClose && (
      <button
          className="absolute top-0 right-0 z-50 bg-transparent p-2 rounded-full md:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <FiX className="w-6 h-6 text-gray-700" />
      </button>
      )}
        {/* Top section: logo and nav */}
        <div className="flex-1 flex flex-col">
        <div className="flex items-center px-6 py-6 ">
            <img
              src="/logo192.png"
              alt="Logo"
            className="h-10 w-10 object-contain"
            />
          <span className="ml-3 text-3xl font-bold tracking-wide text-marriageHotPink">WedLink</span>
          </div>
        <nav className="flex flex-col gap-2 mt-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
              className={`flex items-center gap-4 px-6 py-3 rounded-lg dark:text-gray-200  font-medium transition hover:bg-marriagePink/10 hover:text-marriageHotPink focus:bg-marriagePink/20 focus:text-marriageHotPink ${location.pathname === link.to ? "bg-marriagePink/10 text-marriageHotPink dark:text-marriageHotPink" : "text-gray-800"}`}
              onClick={onClose}
              tabIndex={0}
              >
              <span className="text-xl ">{link.icon}</span>
              <span className="flex-1 text-base">{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        {/* Bottom section: Profile card */}
        <div className="px-4 pb-4 pt-2 relative">
        <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl p-3 gap-3 border border-gray-200 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
              <span className="text-xl font-bold text-gray-700 ">{user?.name ? user.name[0].toUpperCase() : "👤"}</span>
              )}
            </div>
            <div className="flex-1">
              <button
                id="profile-dropdown-btn"
              className="font-semibold text-gray-800 dark:text-gray-200 text-base leading-tight text-left hover:underline focus:outline-none"
                onClick={() => setShowProfileDropdown((v) => !v)}
              aria-label="Open profile dropdown"
              >
                {user?.name || "Dianne Robertson"}
               {!user.role ==='agency' && <div className="text-xs text-marriageHotPink">View Profile</div>}
              </button>
            </div>
         {/**  <button className="text-gray-400 hover:text-marriageHotPink p-1 rounded-full focus:outline-none" aria-label="Settings">
            <FiSettings size={20} />
          </button>*/}
          </div>
          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div
              id="profile-dropdown"
              className="absolute left-0 dark:bg-gray-800 bottom-20 w-72 bg-white border border-gray-200 shadow-xl rounded-xl p-6 z-50 animate-fadeIn"
              style={{ minWidth: '18rem' }}
            >
              <button
                onClick={() => setShowProfileDropdown(false)}
                className="absolute top-2 right-3 text-gray-400 text-xl font-bold hover:text-marriageHotPink"
                aria-label="Close profile dropdown"
              >
                &times;
              </button>
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-marriageHotPink mb-2 shadow">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user?.name ? user.name[0].toUpperCase() : <span>👤</span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-1 dark:text-gray-200">{user?.name || "No Name"}</h2>
                <div className="text-marriageHotPink text-sm mb-1">{user?.email || "User"}</div>
              </div>
              
              <button
                onClick={handleLogout}
              className="mt-2 w-full bg-marriageHotPink text-white py-2 rounded-lg font-semibold shadow transition"
              aria-label="Logout"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>
  );
};

export default OwnerSidebar; 