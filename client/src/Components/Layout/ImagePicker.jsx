import React, { useState } from 'react'
import { FiUpload, FiX } from 'react-icons/fi';

function ImagePicker({setForm, form, id=''}) {
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setForm((prev) => {
          const combined = [...prev.images, ...newFiles].slice(0, 5);
          return { ...prev, images: combined };
        });
      };
    
      const handleRemoveImage = (idx) => {
        setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
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
  return (
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
                    disabled={form?.images?.length >= 5}
                  />
                </label>
                {form?.images?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {form?.images?.map((file, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={id?`http://localhost:5000/${file}`:URL.createObjectURL(file)}
                          alt="preview"
                          className="w-full h-[15rem] object-cover rounded-lg border"
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
                <div className="text-xs text-gray-400 mt-2">{form?.images?.length}/5 images selected</div>
              </div>
  )
}

export default ImagePicker