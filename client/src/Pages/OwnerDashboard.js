import React, { useEffect, useState } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const OwnerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/halls/owner/bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        setBookings(data.bookings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [actionStatus]);

  const handleStatusChange = async (id, status) => {
    setActionStatus({ ...actionStatus, [id]: 'loading' });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/halls/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      setActionStatus({ ...actionStatus, [id]: status });
    } catch (err) {
      setActionStatus({ ...actionStatus, [id]: 'error' });
    }
  };

  return (
    <div className="ml-[15%] p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Bookings for Your Halls</h1>
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-marriageRed">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="text-gray-400">No bookings found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-marriagePink/20">
                <th className="py-2 px-4">Hall</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Time</th>
                <th className="py-2 px-4">Guest</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Phone</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => {
                const dateObj = new Date(b.bookingDate);
                const date = dateObj.toLocaleDateString();
                const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <tr key={b._id} className="border-b">
                    <td className="py-2 px-4 font-semibold">{b.hallId?.name || '-'}</td>
                    <td className="py-2 px-4">{date}</td>
                    <td className="py-2 px-4">{time}</td>
                    <td className="py-2 px-4">{b.guestName || '-'}</td>
                    <td className="py-2 px-4">{b.guestEmail || '-'}</td>
                    <td className="py-2 px-4">{b.guestPhone || '-'}</td>
                    <td className="py-2 px-4 font-bold capitalize text-marriageHotPink">{b.status}</td>
                    <td className="py-2 px-4">
                      {b.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 rounded bg-green-500 text-white flex items-center gap-1 hover:bg-green-600"
                            onClick={() => handleStatusChange(b._id, 'approved')}
                            disabled={actionStatus[b._id] === 'loading'}
                          >
                            <FiCheckCircle /> Confirm
                          </button>
                          <button
                            className="px-3 py-1 rounded bg-red-500 text-white flex items-center gap-1 hover:bg-red-600"
                            onClick={() => handleStatusChange(b._id, 'rejected')}
                            disabled={actionStatus[b._id] === 'loading'}
                          >
                            <FiXCircle /> Cancel
                          </button>
                        </div>
                      )}
                      {actionStatus[b._id] === 'error' && <div className="text-red-500 text-xs">Error!</div>}
                      {actionStatus[b._id] === 'loading' && <div className="text-gray-400 text-xs">Updating...</div>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
  </div>
);
};

export default OwnerDashboard; 