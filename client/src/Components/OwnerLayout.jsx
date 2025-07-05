import React from "react";
import OwnerSidebar from "./OwnerSidebar";

const SIDEBAR_WIDTH = 272; // 64 (w-64) + 2*8 (m-2) = 80*2 = 160px, but w-64 is 16rem = 256px, m-2 is 0.5rem = 8px

const OwnerLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="flex">
      <div className="hidden md:block">
        <OwnerSidebar />
      </div>
      <main
        className="flex-1 p-4 sm:p-10"
        style={{ marginLeft: '0', minWidth: 0 }}
      >
        {children}
      </main>
    </div>
    {/* Mobile sidebar overlay handled inside OwnerSidebar */}
  </div>
);

export default OwnerLayout; 