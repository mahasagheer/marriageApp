// Sidebar.jsx

import { FaBuilding,  FaUserPlus } from "react-icons/fa";
import { FiSettings, FiUser } from "react-icons/fi";

function Sidebar({ role }) {
  const links = {
    user: [
      { label: "My Profile", icon: FiUser, href: "/user/profile" },
      { label: "Agencies", icon: FaBuilding, href: "/user/agencies" },
      { label: "Forms", icon: FaUserPlus, href: "/user/forms" },
    ],
    agency: [
      { label: "Agency Dashboard", icon: FaBuilding, href: "/agency" },
      { label: "Candidates", icon: FiUser, href: "/agency/candidates" },
    ],
    admin: [
      { label: "Manage Users", icon: FiUser, href: "/admin/users" },
      { label: "Manage Agencies", icon: FaBuilding, href: "/admin/agencies" },
      { label: "Activity Logs", icon: FiSettings, href: "/admin/logs" },
    ],
  };

  return (
    <aside className="w-64 bg-white h-screen shadow-lg p-4 space-y-4">
      <h1 className="text-xl font-bold">💛 Rishta Dhondo</h1>
      {links[role].map((item, i) => (
        <a
          key={i}
          href={item.href}
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </a>
      ))}
    </aside>
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