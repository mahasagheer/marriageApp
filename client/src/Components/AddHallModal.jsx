import React, { useState } from "react";
import { Button } from "../Components/Layout/Button";
import { FiUpload, FiX } from "react-icons/fi";

const AddHallModal = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    phone: "",
    images: [],
    capacity: "",
    price: "",
    facilities: [],
  });
  const [dragActive, setDragActive] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const FACILITY_OPTIONS = [
    "Parking",
    "Air Conditioning",
    "WiFi",
    "Sound System",
    "Catering",
    "Stage",
    "Lighting",
    "Security",
    "Projector",
    "Wheelchair"
  ];

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

  const handleFacilityChange = (facility) => {
    setForm((prev) => {
      const exists = prev.facilities.includes(facility);
      return {
        ...prev,
        facilities: exists
          ? prev.facilities.filter((f) => f !== facility)
          : [...prev.facilities, facility],
      };
    });
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.location) newErrors.location = 'Location is required';
    if (!form.capacity) newErrors.capacity = 'Capacity is required';
    if (!form.price) newErrors.price = 'Price is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2 sm:px-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-xl md:max-w-2xl p-4 sm:p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-marriageRed text-2xl font-bold hover:text-marriageHotPink"
      >
        &times;
      </button>
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-marriageHotPink">Add New Hall</h2>
  
      <form className="space-y-6" onSubmit={step === 2 ? handleSubmit : handleNext}>
        {step === 1 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Hall Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-marriageHotPink outline-none"
                  required
                />
                {errors.name && <div className="text-marriageRed text-xs mt-1">{errors.name}</div>}
              </div>
              <div>
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-marriageHotPink outline-none"
                  required
                />
                {errors.location && <div className="text-marriageRed text-xs mt-1">{errors.location}</div>}
              </div>
            </div>
  
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  name="capacity"
                  placeholder="Capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-marriageHotPink outline-none"
                  required
                />
                {errors.capacity && <div className="text-marriageRed text-xs mt-1">{errors.capacity}</div>}
              </div>
              <div>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-marriageHotPink outline-none"
                  required
                />
                {errors.price && <div className="text-marriageRed text-xs mt-1">{errors.price}</div>}
              </div>
            </div>
  
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-marriageHotPink outline-none"
                />
              </div>
            </div>
  
            {/* Facilities Multi-select */}
            <div>
              <label className="block mb-2 font-semibold text-marriageHotPink">Facilities Provided</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FACILITY_OPTIONS.map((facility) => (
                  <label key={facility} className="flex items-center gap-2 text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.facilities.includes(facility)}
                      onChange={() => handleFacilityChange(facility)}
                      className="accent-marriageHotPink"
                    />
                    {facility}
                  </label>
                ))}
              </div>
            </div>
  
            <div className="flex justify-end">
              <Button btnText="Next" btnColor="marriageHotPink" padding="px-8 py-3" type="submit" />
            </div>
          </>
        )}
  
        {step === 2 && (
          <>
            <div
              className={`w-full border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                dragActive ? "border-marriageHotPink bg-pink-50" : "border-gray-200"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <label className="flex flex-col items-center cursor-pointer">
                <FiUpload className="text-3xl text-marriageHotPink mb-2" />
                <span className="text-gray-500 mb-2 text-sm text-center">Drag & drop up to 5 images, or click to select</span>
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                  {(window.innerWidth < 640
                    ? form.images.slice(0, 2)
                    : form.images
                  ).map((file, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-full h-20 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-marriageRed hover:text-marriageHotPink"
                        onClick={() => handleRemoveImage(
                          window.innerWidth < 640 ? idx : idx
                        )}
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-2">{form.images.length}/5 images selected</div>
            </div>
  
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-marriageHotPink outline-none mt-4"
              rows={4}
            />
  
            <div className="flex flex-row justify-between gap-2 mt-4">
              <Button btnText="Back" btnColor="marriageHotPink" padding="px-8 py-3 w-full" type="button" onClick={handleBack} />
              <Button btnText="Add Hall" btnColor="marriageHotPink" padding="px-8 py-3 w-full" type="submit" />
            </div>
          </>
        )}
      </form>
    </div>
  </div>
  
  );
};

export default AddHallModal; 