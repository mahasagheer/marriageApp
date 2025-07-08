// components/UserProfileForm.jsx

import { useState } from "react";
import { Input } from "../components/Layout/Input";
import { Button } from "../components/Layout/Button";
import { FiAlignLeft, FiCalendar, FiUser } from "react-icons/fi";

export default function UserProfileForm() {
  const [profile, setProfile] = useState({ name: "", age: "", bio: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    // Save API call logic goes here
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-xl rounded-2xl p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        👤 Create Your Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <FiUser className="w-4 h-4" />
            Full Name
          </label>
          <Input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="e.g. Ali Raza"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <FiCalendar className="w-4 h-4" />
            Age
          </label>
          <Input
            type="number"
            name="age"
            value={profile.age}
            onChange={handleChange}
            placeholder="e.g. 25"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <FiAlignLeft className="w-4 h-4" />
            Short Bio
          </label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            placeholder="Write a short bio about yourself..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>

        <Button btnText={"Create Profile"} btnColor={"marriageHotPink"} />
          
      </form>

      {formSubmitted && (
        <div className="mt-4 text-green-600 font-medium text-center">
          ✅ Profile created successfully!
        </div>
      )}
    </div>
  );
}
