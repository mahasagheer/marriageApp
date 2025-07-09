import React, { useEffect, useState } from "react";
import { FiUser, FiMessageSquare, FiList, FiCheckCircle, FiXCircle, FiClock, FiUsers } from "react-icons/fi";
import OwnerChat from './OwnerChat';

const OwnerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState({});
  const [showChat, setShowChat] = useState(false);

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

  const bookingStats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    approved: bookings.filter(b => b.status === 'approved').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
  };

  return (
    <div className="ml-[15%] p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-marriagePink flex items-center justify-center text-marriageHotPink text-3xl font-bold shadow">
            <FiUser />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-marriageHotPink mb-1">Welcome, Owner!</h1>
            <div className="text-gray-500 text-sm">Manage your hall bookings and chat with clients.</div>
          </div>
        </div>
        <button className="px-5 py-2 rounded-lg bg-marriageHotPink text-white font-bold shadow hover:bg-marriageRed transition text-lg" onClick={() => setShowChat(true)}>
          <FiMessageSquare className="inline-block mr-2" /> Open Owner Chat
        </button>
      </div>
      {/* Booking Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center animate-fadeInUp">
          <FiList className="text-marriageHotPink text-3xl mb-2" />
          <div className="text-2xl font-bold">{bookingStats.total}</div>
          <div className="text-gray-500">Total Bookings</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center animate-fadeInUp">
          <FiClock className="text-yellow-500 text-3xl mb-2" />
          <div className="text-2xl font-bold">{bookingStats.pending}</div>
          <div className="text-gray-500">Pending</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center animate-fadeInUp">
          <FiCheckCircle className="text-green-500 text-3xl mb-2" />
          <div className="text-2xl font-bold">{bookingStats.approved}</div>
          <div className="text-gray-500">Approved</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center animate-fadeInUp">
          <FiXCircle className="text-red-500 text-3xl mb-2" />
          <div className="text-2xl font-bold">{bookingStats.rejected}</div>
          <div className="text-gray-500">Rejected</div>
        </div>
      </div>
      {/* Bookings Table/Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 animate-fadeInUp">
        <h2 className="text-xl font-bold text-marriageHotPink mb-4 flex items-center gap-2"><FiUsers /> Bookings</h2>
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
                    <tr key={b._id} className="border-b hover:bg-marriagePink/10 transition animate-fadeIn">
                      <td className="py-2 px-4 font-semibold">{b.hallId?.name || '-'}</td>
                      <td className="py-2 px-4">{date}</td>
                      <td className="py-2 px-4">{time}</td>
                      <td className="py-2 px-4">{b.guestName || '-'}</td>
                      <td className="py-2 px-4">{b.guestEmail || '-'}</td>
                      <td className="py-2 px-4">{b.guestPhone || '-'}</td>
                      <td className="py-2 px-4 font-bold capitalize">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : b.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{b.status}</span>
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex gap-2 items-center">
                          {b.status === 'pending' && (
                            <>
                              <button
                                className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition shadow"
                                title="Approve"
                                onClick={() => handleStatusChange(b._id, 'approved')}
                                disabled={actionStatus[b._id] === 'loading'}
                              >
                                <FiCheckCircle />
                              </button>
                              <button
                                className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition shadow"
                                title="Reject"
                                onClick={() => handleStatusChange(b._id, 'rejected')}
                                disabled={actionStatus[b._id] === 'loading'}
                              >
                                <FiXCircle />
                              </button>
                            </>
                          )}
                          <button
                            className="p-2 rounded-full bg-marriagePink text-marriageHotPink hover:bg-marriageHotPink hover:text-white transition shadow"
                            title="Chat with Client"
                            onClick={() => setShowChat({ booking: b })}
                          >
                            <FiMessageSquare />
                          </button>
                          {actionStatus[b._id] === 'error' && <div className="text-red-500 text-xs ml-2">Error!</div>}
                          {actionStatus[b._id] === 'loading' && <div className="text-gray-400 text-xs ml-2">Updating...</div>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Owner Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-marriagePink p-0 max-w-4xl w-full h-[44rem] flex flex-col overflow-hidden relative">
            <button className="absolute top-4 right-4 text-marriageRed text-2xl font-bold hover:text-marriageHotPink z-10" onClick={() => setShowChat(false)}>&times;</button>
            <div className="flex-1 flex flex-col bg-gradient-to-br from-white via-marriagePink/10 to-marriagePink/5">
              <OwnerChat hallId={showChat.booking ? showChat.booking.hallId?._id : bookings[0]?.hallId?._id} bookings={bookings} booking={showChat.booking} />
            </div>
          </div>
        </div>
      )}
  </div>
);
};

export default OwnerDashboard; 