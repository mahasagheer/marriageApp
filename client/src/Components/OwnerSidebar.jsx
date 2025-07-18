import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {  FiUsers, FiCalendar, FiFileText, FiBarChart2, FiSettings, FiMenu, FiUser } from "react-icons/fi";
import { FaBuilding,  } from "react-icons/fa";


const OwnerSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Role-based nav links
  let navLinks = [];
  if (user?.role === 'hall-owner' || user?.role === 'manager') {
    navLinks = [
      { to: `/${user?.role}`, label: 'Dashboard', icon: <FiBarChart2 /> },
      { to: `/${user?.role}/halls`, label: 'Halls', icon: <FiFileText /> },
      { to: `/${user?.role}/my-bookings`, label: 'My Bookings', icon: <FiCalendar /> },
    ];
  } else if (user?.role === 'admin') {
    navLinks = [
      { to: '/admin', label: 'Admin Dashboard', icon: <FiBarChart2 /> },
      { to: '/admin/halls', label: 'All Halls', icon: <FiFileText /> },
      { to: '/admin/my-bookings', label: 'All Bookings', icon: <FiCalendar /> },
      { to: '/admin/associate-manager', label: 'Associate Manager', icon: <FiUsers /> },
    ];
  }else if(user?.role==="agency"){
    navLinks=[
      { label: "Agency Dashboard", icon: FaBuilding, to: "/agency" },
      { label: "Agency Profile", icon: FaBuilding, to: "/agency/profile" },
      { label: "Candidates", icon: FiUser, to: "/agency/candidates" },
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
    <>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 bottom-8 left-4 z-50 bg-white p-2 rounded shadow-lg border border-gray-200"
        onClick={() => setOpen(!open)}
        aria-label="Open sidebar"
      >
        <FiMenu className="w-6 h-6 text-gray-700" />
      </button>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white text-gray-800 rounded-xl m-2 shadow-lg border border-gray-200 z-40 flex flex-col`}
      >
        {/* Top section: logo and nav */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center px-6 py-6 border-b border-gray-100">
            <img
              src="/logo192.png"
              alt="Logo"
              className="h-8 w-8 object-contain rounded"
            />
            <span className="ml-3 text-lg font-bold tracking-wide">WedLink</span>
          </div>
          <nav className="flex flex-col gap-1 mt-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-6 py-2 rounded-lg font-medium transition hover:bg-gray-100 hover:text-marriageHotPink ${location.pathname === link.to ? "bg-gray-100 text-marriageHotPink" : "text-gray-800"}`}
                onClick={() => setOpen(false)}
              >
                {link.icon}
                <span className="flex-1">{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        {/* Bottom section: Profile card */}
        <div className="px-4 pb-4 pt-2 relative">
          <div className="flex items-center bg-gray-50 rounded-xl p-3 gap-3 border border-gray-200">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-gray-700">{user?.name ? user.name[0].toUpperCase() : "👤"}</span>
              )}
            </div>
            <div className="flex-1">
              <button
                id="profile-dropdown-btn"
                className="font-semibold text-gray-800 text-sm leading-tight text-left hover:underline focus:outline-none"
                onClick={() => setShowProfileDropdown((v) => !v)}
              >
                {user?.name || "Dianne Robertson"}
                <div className="text-xs text-marriageHotPink">View Profile</div>
              </button>
            </div>
            <button className="text-gray-400 hover:text-marriageHotPink p-1 rounded-full focus:outline-none">
              <FiSettings size={18} />
            </button>
          </div>
          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div
              id="profile-dropdown"
              className="absolute left-0 bottom-20 w-72 bg-white border border-gray-200 shadow-xl rounded-xl p-6 z-50 animate-fadeIn"
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
                <h2 className="text-lg font-bold text-gray-800 mb-1">{user?.name || "No Name"}</h2>
                <div className="text-marriageHotPink font-semibold mb-1">{user?.role || "User"}</div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between border-b pb-1">
                  <span className="text-gray-500 text-sm">Email:</span>
                  <span className="font-medium text-gray-800 text-sm">{user?.email || "-"}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-1">
                  <span className="text-gray-500 text-sm">Role:</span>
                  <span className="font-medium text-gray-800 text-sm capitalize">{user?.role || "user"}</span>
                </div>
                {/* Add more user fields here if available */}
              </div>
              <button
                onClick={handleLogout}
                className="mt-2 w-full bg-marriageHotPink text-white py-2 rounded-lg font-semibold shadow hover:bg-marriagePink transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default OwnerSidebar; 