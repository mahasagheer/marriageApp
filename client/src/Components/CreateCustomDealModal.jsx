import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import Select from 'react-select';

const DEFAULT_MENU_ITEMS = ['Biryani', 'Chicken Karahi', 'Naan', 'Raita', 'Salad'];
const DEFAULT_DECORATION_ITEMS = ['Balloon', 'Flower', 'Stage Lighting', 'Table Centerpiece', 'Backdrop'];

const CreateCustomDealModal = ({ hallId, onClose }) => {
  const [form, setForm] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    bookingDate: '',
    menuItems: [], // array of menu item names
    decorationItems: [], // array of decoration item names
    price: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [menus, setMenus] = useState([]);
  const [decorations, setDecorations] = useState([]);

  useEffect(() => {
    fetch('/api/menus')
      .then(res => res.json())
      .then(data => setMenus(data.menus || []));
    fetch('/api/decorations')
      .then(res => res.json())
      .then(data => setDecorations(data.decorations || []));
  }, []);

  // Flatten all menu items from all menus
  let allMenuItems = Array.from(new Set(menus.flatMap(menu => menu.items || [])));
  if (allMenuItems.length === 0) allMenuItems = DEFAULT_MENU_ITEMS;
  // All decoration names
  let allDecorationItems = Array.from(new Set(decorations.map(dec => dec.name)));
  if (allDecorationItems.length === 0) allDecorationItems = DEFAULT_DECORATION_ITEMS;

  // Prepare options for react-select
  const menuOptions = allMenuItems.map(item => ({ value: item, label: item }));
  const decorationOptions = allDecorationItems.map(item => ({ value: item, label: item }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMenuChange = (selected) => {
    setForm(prev => ({ ...prev, menuItems: selected ? selected.map(opt => opt.value) : [] }));
  };

  const handleDecorationChange = (selected) => {
    setForm(prev => ({ ...prev, decorationItems: selected ? selected.map(opt => opt.value) : [] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/bookings/custom-deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          hallId,
          menuItems: form.menuItems,
          decorationItems: form.decorationItems,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.message || 'Failed to send custom deal');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-center animate-fadeInUp">
          <h3 className="text-xl sm:text-2xl font-bold text-green-600 mb-4">Custom deal sent!</h3>
          <button
            className="mt-4 px-4 py-2 sm:px-6 sm:py-2 rounded-lg bg-marriageHotPink text-white font-bold shadow hover:bg-marriageRed transition text-base sm:text-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2 sm:px-4">
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8 animate-fadeInUp">
      {/* Close Button */}
      <button
        className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-marriageHotPink text-xl sm:text-2xl focus:outline-none"
        onClick={onClose}
        aria-label="Close"
      >
        <FiX />
      </button>
  
      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-extrabold text-marriageHotPink mb-4 sm:mb-6 text-center">
        Create Custom Deal
      </h2>
  
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Guest Info */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Guest Name</label>
            <input
              name="guestName"
              value={form.guestName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-marriageHotPink focus:ring-2 focus:ring-marriagePink outline-none transition"
              placeholder="Enter guest name"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Guest Email</label>
            <input
              name="guestEmail"
              type="email"
              value={form.guestEmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-marriageHotPink focus:ring-2 focus:ring-marriagePink outline-none transition"
              placeholder="Enter guest email"
            />
          </div>
        </div>
  
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Guest Phone</label>
            <input
              name="guestPhone"
              value={form.guestPhone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-marriageHotPink focus:ring-2 focus:ring-marriagePink outline-none transition"
              placeholder="Enter guest phone"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Booking Date</label>
            <input
              name="bookingDate"
              type="date"
              value={form.bookingDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-marriageHotPink focus:ring-2 focus:ring-marriagePink outline-none transition"
            />
          </div>
        </div>
  
        {/* Menu Items */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Menu Items</label>
          <Select
            isMulti
            name="menuItems"
            options={menuOptions}
            value={form.menuItems.map(item => ({ value: item, label: item }))}
            onChange={handleMenuChange}
            className="react-select-container text-sm"
            classNamePrefix="react-select"
            placeholder="Select or type menu items..."
          />
        </div>
  
        {/* Decoration Items */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Decoration Items</label>
          <Select
            isMulti
            name="decorationItems"
            options={decorationOptions}
            value={form.decorationItems.map(item => ({ value: item, label: item }))}
            onChange={handleDecorationChange}
            className="react-select-container text-sm"
            classNamePrefix="react-select"
            placeholder="Select or type decoration items..."
          />
        </div>
  
        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Price</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-marriageHotPink focus:ring-2 focus:ring-marriagePink outline-none transition"
            placeholder="Enter price"
          />
        </div>
  
        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Message/Details</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-marriageHotPink focus:ring-2 focus:ring-marriagePink outline-none transition resize-none"
            placeholder="Add any special details for the guest..."
          />
        </div>
  
        {/* Error */}
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
  
        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 px-6 py-2 rounded-lg bg-marriageHotPink text-white font-bold shadow hover:bg-marriageRed transition text-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Custom Deal'}
        </button>
      </form>
    </div>
  </div>
  
  );
};

export default CreateCustomDealModal; 