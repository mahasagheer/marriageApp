import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiHome, FiLayers, FiCalendar, FiUser, FiLogOut, FiMenu } from "react-icons/fi";

const navLinks = [
  { to: "/owner", label: "Dashboard", icon: <FiHome /> },
  { to: "/owner/halls", label: "My Halls", icon: <FiLayers /> },
  { to: "/owner/bookings", label: "Bookings", icon: <FiCalendar /> },
  { to: "/owner/profile", label: "Profile", icon: <FiUser /> },
];

const OwnerSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow-lg border border-gray-200"
        onClick={() => setOpen(!open)}
        aria-label="Open sidebar"
      >
        <FiMenu className="w-6 h-6 text-gray-700" />
      </button>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 shadow-lg z-40 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block md:w-64 md:min-h-screen flex flex-col justify-between`}
      >
        <div>
          <div className="flex items-center px-6 py-6 border-b border-gray-100">
            <img
              src="/logo192.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="ml-3 text-xl font-bold text-marriageHotPink font-serif tracking-wide">
              WedLink
            </span>
            <button
              className="md:hidden text-gray-400 text-2xl ml-auto"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
            >
              &times;
            </button>
          </div>
          <nav className="flex flex-col gap-1 mt-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium text-gray-700 transition
                  ${
                    location.pathname === link.to
                      ? "bg-gradient-to-r from-pink-100 to-pink-50 text-pink-600 shadow"
                      : "hover:bg-gray-50"
                  }`}
                onClick={() => setOpen(false)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-3 mb-6 rounded-lg font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
        >
          <FiLogOut />
          Logout
        </button>
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