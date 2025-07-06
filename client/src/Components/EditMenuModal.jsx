import React, { useState, useEffect } from "react";
import { Button } from "./Layout/Button";
import { FiPlus, FiX, FiTrash2 } from "react-icons/fi";

const EditMenuModal = ({ open, onClose, onSubmit, initialValues }) => {
  const [form, setForm] = useState({
    name: "",
    items: [""],
    basePrice: "",
    addOns: [{ name: "", price: "" }],
  });

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name || "",
        items: initialValues.items && initialValues.items.length > 0 ? initialValues.items : [""],
        basePrice: initialValues.basePrice || "",
        addOns: initialValues.addOns && initialValues.addOns.length > 0 ? initialValues.addOns : [{ name: "", price: "" }],
      });
    }
  }, [initialValues, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, value) => {
    const newItems = [...form.items];
    newItems[index] = value;
    setForm({ ...form, items: newItems });
  };

  const addItem = () => {
    setForm({ ...form, items: [...form.items, ""] });
  };

  const removeItem = (index) => {
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const handleAddOnChange = (index, field, value) => {
    const newAddOns = [...form.addOns];
    newAddOns[index] = { ...newAddOns[index], [field]: value };
    setForm({ ...form, addOns: newAddOns });
  };

  const addAddOn = () => {
    setForm({ ...form, addOns: [...form.addOns, { name: "", price: "" }] });
  };

  const removeAddOn = (index) => {
    const newAddOns = form.addOns.filter((_, i) => i !== index);
    setForm({ ...form, addOns: newAddOns });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const menuData = {
      name: form.name,
      items: form.items.filter(item => item.trim() !== ""),
      basePrice: Number(form.basePrice),
      addOns: form.addOns
        .filter(addon => addon.name.trim() !== "" && addon.price !== "")
        .map(addon => ({
          name: addon.name,
          price: Number(addon.price)
        }))
    };
    onSubmit(menuData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-marriageRed text-2xl font-bold hover:text-marriageHotPink"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-marriageHotPink">Edit Menu</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Menu Name (e.g., Wedding Menu, Birthday Menu)"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-marriageHotPink outline-none"
            required
          />
          
          <input
            type="number"
            name="basePrice"
            placeholder="Base Price (PKR)"
            value={form.basePrice}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-marriageHotPink outline-none"
            required
          />

          {/* Menu Items */}
          <div>
            <label className="block mb-2 font-semibold text-marriagePink">Menu Items</label>
            {form.items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Item ${index + 1}`}
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  className="flex-1 border rounded px-4 py-2 focus:ring-2 focus:ring-marriageHotPink outline-none"
                />
                {form.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="px-3 py-2 text-marriageRed hover:text-marriageHotPink"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 text-marriageHotPink hover:text-marriagePink text-sm mt-2"
            >
              <FiPlus /> Add Item
            </button>
          </div>

          {/* Add-ons */}
          <div>
            <label className="block mb-2 font-semibold text-marriagePink">Add-ons (Optional)</label>
            {form.addOns.map((addon, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add-on name"
                  value={addon.name}
                  onChange={(e) => handleAddOnChange(index, 'name', e.target.value)}
                  className="flex-1 border rounded px-4 py-2 focus:ring-2 focus:ring-marriageHotPink outline-none"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={addon.price}
                  onChange={(e) => handleAddOnChange(index, 'price', e.target.value)}
                  className="w-24 border rounded px-4 py-2 focus:ring-2 focus:ring-marriageHotPink outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeAddOn(index)}
                  className="px-3 py-2 text-marriageRed hover:text-marriageHotPink"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addAddOn}
              className="flex items-center gap-2 text-marriageHotPink hover:text-marriagePink text-sm mt-2"
            >
              <FiPlus /> Add Add-on
            </button>
          </div>

          <Button btnText="Update Menu" btnColor="marriageHotPink" padding="w-full py-3" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default EditMenuModal; 