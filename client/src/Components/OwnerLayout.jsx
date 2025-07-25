import React, { useState } from "react";
import OwnerSidebar from "./OwnerSidebar";

const OwnerLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar for desktop */}
        <div className="hidden md:block">
          <OwnerSidebar />
        </div>
        {/* Sidebar for mobile (overlay) */}
        <div className={`fixed inset-0 z-50 md:hidden transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ background: sidebarOpen ? 'rgba(0,0,0,0.3)' : 'transparent' }}>
          <OwnerSidebar onClose={() => setSidebarOpen(false)} />
        </div>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden fixed top-4 left-4 z-60 bg-white p-2 rounded shadow-lg border border-gray-200"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        {/* Main content */}
        <main
          className="flex-1 sm:py-4 md:py-8 lg:py-10 transition-all duration-300  lg:ml-[15vw] md:ml-[27vw]"
          style={{minWidth: 0 }}
        >
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout; 