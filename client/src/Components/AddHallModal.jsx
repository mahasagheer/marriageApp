import React, { useState } from "react";
import { Button } from "../components/Layout/Button";
import { FiUpload, FiX } from "react-icons/fi";

const AddHallModal = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    images: [],
    capacity: "",
    price: "",
  });
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setForm((prev) => {
      const combined = [...prev.images, ...newFiles].slice(0, 5);
      return { ...prev, images: combined };
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const newFiles = Array.from(e.dataTransfer.files);
    setForm((prev) => {
      const combined = [...prev.images, ...newFiles].slice(0, 5);
      return { ...prev, images: combined };
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleRemoveImage = (idx) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-marriageRed text-2xl font-bold hover:text-marriageHotPink"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-marriageHotPink">Add New Hall</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Hall Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-marriageHotPink outline-none"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-marriageHotPink outline-none"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-marriageHotPink outline-none"
          />
          <div
            className={`w-full border-2 border-dashed rounded-xl p-4 text-center transition-all ${dragActive ? "border-marriageHotPink bg-pink-50" : "border-gray-200"}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <label className="flex flex-col items-center cursor-pointer">
              <FiUpload className="text-3xl text-marriageHotPink mb-2" />
              <span className="text-gray-500 mb-2">Drag & drop up to 5 images, or click to select</span>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={form.images.length >= 5}
              />
            </label>
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {form.images.map((file, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-full h-20 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-marriageRed hover:text-marriageHotPink"
                      onClick={() => handleRemoveImage(idx)}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="text-xs text-gray-400 mt-2">{form.images.length}/5 images selected</div>
          </div>
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={form.capacity}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-marriageHotPink outline-none"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-marriageHotPink outline-none"
            required
          />
          <Button btnText="Add Hall" btnColor="marriageHotPink" padding="w-full py-3" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default AddHallModal; 