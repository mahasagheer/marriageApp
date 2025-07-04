import React from "react";
import { useAuth } from "../context/AuthContext";
import OwnerLayout from "../components/OwnerLayout";

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <OwnerLayout>
        <div className="flex items-center justify-center h-full bg-gray-50">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold text-marriageHotPink mb-4">Profile</h2>
            <div className="text-gray-500">You are not logged in.</div>
          </div>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>
      <div className="max-w-xl mx-auto p-8">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-marriageHotPink mb-4 shadow">
              {/* Placeholder avatar: first letter of name or user icon */}
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                user.name ? user.name[0].toUpperCase() : <span>👤</span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.name || "No Name"}</h2>
            <div className="text-marriageHotPink font-semibold mb-2">{user.role || "User"}</div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-500">Email:</span>
              <span className="font-medium text-gray-800">{user.email || "-"}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-500">Role:</span>
              <span className="font-medium text-gray-800 capitalize">{user.role || "user"}</span>
            </div>
            {/* Add more user fields here if available */}
          </div>
          <button
            onClick={logout}
            className="mt-8 w-full bg-marriageHotPink text-white py-3 rounded-xl font-semibold shadow hover:bg-marriagePink transition"
          >
            Logout
          </button>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default Profile; 