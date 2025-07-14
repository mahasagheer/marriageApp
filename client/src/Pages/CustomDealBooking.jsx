import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CustomDealBooking = () => {
  const { token } = useParams();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/bookings/custom-deal/${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.booking) {
          setDeal(data.booking);
        } else {
          setError(data.message || 'Deal not found');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch deal');
        setLoading(false);
      });
  }, [token]);

  const handleConfirm = async () => {
    setConfirmLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/bookings/custom-deal/${token}/confirm`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setConfirmed(true);
      } else {
        setError(data.message || 'Failed to confirm booking');
      }
    } catch (err) {
      setError('Network error');
    }
    setConfirmLoading(false);
  };

  if (loading) return <div className="flex justify-center items-center min-h-[40vh]">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!deal) return <div className="text-center mt-8">Deal not found.</div>;
  if (confirmed) return <div className="text-green-600 text-center mt-8 text-2xl font-bold">Booking confirmed! Thank you.</div>;

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 mt-12 animate-fadeInUp">
      <h2 className="text-2xl font-bold text-marriageHotPink mb-4 text-center">Custom Deal for {deal.guestName}</h2>
      <div className="mb-4">
        <span className="font-semibold">Hall:</span> {deal.hallId?.name || '-'}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Date:</span> {deal.bookingDate ? new Date(deal.bookingDate).toLocaleDateString() : '-'}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Menu Items:</span> {deal.menuItems && deal.menuItems.length > 0 ? deal.menuItems.join(', ') : '-'}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Decoration Items:</span> {deal.decorationItems && deal.decorationItems.length > 0 ? deal.decorationItems.join(', ') : '-'}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Price:</span> {deal.price ? `Rs. ${deal.price}` : '-'}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Message:</span> {deal.message || '-'}
      </div>
      <button
        className="w-full mt-4 px-6 py-2 rounded-lg bg-marriageHotPink text-white font-bold shadow hover:bg-marriageRed transition text-lg disabled:opacity-60 disabled:cursor-not-allowed"
        onClick={handleConfirm}
        disabled={confirmLoading}
      >
        {confirmLoading ? 'Confirming...' : 'Confirm Booking'}
      </button>
    </div>
  );
};

export default CustomDealBooking; 