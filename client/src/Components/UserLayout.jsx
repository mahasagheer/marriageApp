// components/Sidebar.jsx
import { FiFileText, FiHome, FiPhoneCall, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";

 function Sidebar() {
  return (
    <div className="h-screen w-64 bg-white shadow-lg p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-center mb-6">💛 Rishta Dhondo</h2>

        <nav className="space-y-3">
          <Link
            href="/user-dashboard"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
          >
            <FiHome className="w-5 h-5" />
            Dashboard
          </Link>

          <Link
            href="/user-profile"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
          >
            <FiUser className="w-5 h-5" />
            My Profile
          </Link>

          <Link
            href="/agencies"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
          >
            <FiPhoneCall className="w-5 h-5" />
            Contact Agencies
          </Link>

          <Link
            href="/forms"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
          >
            <FiFileText className="w-5 h-5" />
            Forms
          </Link>
        </nav>
      </div>

      <div className="text-center text-sm text-gray-400">
        © 2025 Rishta App
      </div>
    </div>
  );
}


const SIDEBAR_WIDTH = 272; // 64 (w-64) + 2*8 (m-2) = 80*2 = 160px, but w-64 is 16rem = 256px, m-2 is 0.5rem = 8px

const UserLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="flex">
      <div className="hidden md:block">
        <Sidebar />
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

export default UserLayout; 