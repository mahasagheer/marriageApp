import { useState } from "react";
import { Input } from "../../Components/Layout/Input";
import { Button } from "../../Components/Layout/Button";
import {
  FiAlignLeft,
  FiCalendar,
  FiUser,
  FiPhone,
  FiMail,
  FiX,
} from "react-icons/fi";

export default function UserProfileModal({ isOpen, onClose }) {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    bio: "",
    gender: "",
    phone: "",
    email: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    // TODO: API call to save profile

    setTimeout(() => {
      onClose();
      setFormSubmitted(false);
      setProfile({
        name: "",
        age: "",
        bio: "",
        gender: "",
        phone: "",
        email: "",
      });
    }, 2000);
  };

  const handleClose = () => {
    onClose();
    setFormSubmitted(false);
    setProfile({
      name: "",
      age: "",
      bio: "",
      gender: "",
      phone: "",
      email: "",
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
<div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">        {/* Modal Header */}
        <div className="flex justify-between items-center p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            👤 Create Your Profile
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
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

            {/* Age */}
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

            {/* Gender */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                🧑 Gender
              </label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FiPhone className="w-4 h-4" />
                Phone
              </label>
              <Input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="e.g. 0300-1234567"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FiMail className="w-4 h-4" />
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="e.g. yourname@example.com"
                required
              />
            </div>

            {/* Bio */}
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
                required
              />
            </div>

            {/* Submit + Cancel Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                btnText={"Create Profile"}
                btnColor={"marriageHotPink"}
                type="submit"
              />
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Success Message */}
          {formSubmitted && (
            <div className="mt-4 text-green-600 font-medium text-center">
              ✅ Profile created successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
