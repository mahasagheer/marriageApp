import React from "react";
import OwnerSidebar from "./OwnerSidebar";

const OwnerLayout = ({ children }) => (
  <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
    <OwnerSidebar />
    <main className="flex-1 p-4 sm:p-10">{children}</main>
  </div>
);

export default OwnerLayout; 