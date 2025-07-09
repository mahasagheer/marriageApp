// components/AgencyDashboard.jsx

import { useState } from "react";
import { FaBuilding, FaUserPlus, FaTrashAlt } from "react-icons/fa";
import { Input } from "../Layout/Input";
import { Button } from "../Layout/Button";

export default function AgencyDashboard() {
  const [agency, setAgency] = useState({
    name: "Al-Noor Rishta Services",
    phone: "03XX-XXXXXXX",
    email: "alnoor@example.com",
  });

  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    age: "",
    gender: "",
    bio: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCandidate({ ...newCandidate, [name]: value });
  };

  const handleAddCandidate = (e) => {
    e.preventDefault();
    setCandidates([...candidates, newCandidate]);
    setNewCandidate({ name: "", age: "", gender: "", bio: "" });
  };

  const handleDelete = (index) => {
    const updated = [...candidates];
    updated.splice(index, 1);
    setCandidates(updated);
  };

  return (
    <div className="min-h-screen bg-[#fdf6f0] p-6">
      {/* Agency Info */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-10">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-[#B8574C] mb-4">
          <FaBuilding className="w-5 h-5" />
          Agency Profile
        </h2>
        <div className="space-y-2 text-gray-700">
          <p><strong>Name:</strong> {agency.name}</p>
          <p><strong>Email:</strong> {agency.email}</p>
          <p><strong>Phone:</strong> {agency.phone}</p>
        </div>
      </div>

      {/* Add Candidate */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-10">
        <h3 className="text-xl font-semibold text-[#B8574C] flex items-center gap-2 mb-4">
          <FaUserPlus className="w-5 h-5" />
          Add New Candidate
        </h3>
        <form onSubmit={handleAddCandidate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="name"
            placeholder="Candidate Name"
            value={newCandidate.name}
            onChange={handleChange}
            required
          />
          <Input
            name="age"
            placeholder="Age"
            type="number"
            value={newCandidate.age}
            onChange={handleChange}
            required
          />
          <select
            name="gender"
            value={newCandidate.gender}
            onChange={handleChange}
            required
            className="col-span-1 md:col-span-2 p-3 border border-gray-300 rounded-lg"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
          <textarea
            name="bio"
            placeholder="Short Bio"
            value={newCandidate.bio}
            onChange={handleChange}
            className="col-span-1 md:col-span-2 p-3 border border-gray-300 rounded-lg"
            rows={3}
            required
          />
          <div className="col-span-1 md:col-span-2">
            <Button type="submit" className="w-full bg-[#B8574C] hover:bg-[#9c433a] text-white">
              Add Candidate
            </Button>
          </div>
        </form>
      </div>

      {/* Candidate List */}
      {candidates.length > 0 && (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-[#B8574C] mb-4">🧾 Registered Candidates</h3>
          <ul className="divide-y divide-gray-200">
            {candidates.map((c, i) => (
              <li key={i} className="py-4 flex justify-between items-start">
                <div>
                  <p className="font-semibold">{c.name} ({c.age}, {c.gender})</p>
                  <p className="text-gray-600 text-sm">{c.bio}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-white hover:bg-red-500"
                  onClick={() => handleDelete(i)}
                >
                  <FaTrashAlt className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
