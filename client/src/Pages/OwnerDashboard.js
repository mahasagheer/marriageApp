import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOwnerBookings, fetchBookingById, updateBookingStatus, clearSelectedBooking } from "../slice/bookingSlice";
import { fetchUnreadCount } from "../slice/chatSlice";
import { FiUser, FiMessageSquare, FiList, FiCheckCircle, FiXCircle, FiClock, FiUsers, FiX, FiMail, FiPhone, FiCalendar } from "react-icons/fi";
import OwnerChat from './OwnerChat';

const OwnerDashboard = () => {
  const dispatch = useDispatch();
  const bookings = useSelector(state => state.bookings.bookings);
  const loading = useSelector(state => state.bookings.loading);
  const error = useSelector(state => state.bookings.error);
  const actionStatus = useSelector(state => state.bookings.actionStatus);
  const selectedBooking = useSelector(state => state.bookings.selectedBooking);
  const selectedBookingLoading = useSelector(state => state.bookings.selectedBookingLoading);
  const unreadCount = useSelector(state => state.chat.unreadCount);

  const [showChat, setShowChat] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  let ownerId = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      ownerId = userObj?.id;
    }
  } catch (e) {}

  useEffect(() => {
    dispatch(fetchOwnerBookings());
    if (ownerId) {
      dispatch(fetchUnreadCount(ownerId));
    }
  }, [dispatch, ownerId]);

  const handleStatusChange = (id, status) => {
    dispatch(updateBookingStatus({ id, status }));
  };

  const handleBookingRowClick = (booking) => {
    dispatch(fetchBookingById(booking._id));
    setShowDrawer(true);
  };

  const bookingStats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    approved: bookings.filter(b => b.status === 'approved').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
  };

  let userName = 'Owner';
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      if (userObj && userObj.name) {
        userName = userObj.name;
      }
    }
  } catch (e) {
    // fallback to 'Owner'
  }
  return (
    <div className="ml-[15%] p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-marriagePink flex items-center justify-center text-marriageHotPink text-3xl font-bold shadow">
            <FiUser />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-marriageHotPink mb-1">
              Welcome, {userName}!
            </h1>
            <div className="text-gray-500 text-sm">Manage your hall bookings and chat with clients.</div>
          </div>
        </div>
        <button
          className="relative px-5 py-2 rounded-lg bg-marriageHotPink text-white font-bold shadow hover:bg-marriageRed transition text-lg"
          onClick={() => setShowChat(true)}
        >
          <FiMessageSquare className="inline-block mr-2" />
          Chat
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-marriageRed text-white text-xs font-bold rounded-full px-2 py-0.5 shadow">
              {unreadCount}
            </span>
          )}
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
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, idx) => {
                  const dateObj = new Date(b.bookingDate);
                  const date = dateObj.toLocaleDateString();
                  const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                    <tr
                      key={b._id}
                      className={`border-b transition animate-fadeIn ${idx % 2 === 0 ? 'bg-marriagePink/5' : 'bg-white'} hover:bg-marriagePink/20 cursor-pointer rounded-xl`}
                      onClick={() => handleBookingRowClick(b)}
                      style={{ boxShadow: '0 1px 4px 0 rgba(244,114,182,0.04)' }}
                    >
                      <td className="py-2 px-4 font-semibold flex items-center gap-2">
                        {b.hallId?.name || '-'}
                      </td>
                      <td className="py-2 px-4">{date}</td>
                      <td className="py-2 px-4">{time}</td>
                      <td className="py-2 px-4 flex items-center gap-2">
                        {b.guestName || '-'}
                      </td>
                      <td className="py-2 px-4">{b.guestEmail || '-'}</td>
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
                                onClick={e => { e.stopPropagation(); handleStatusChange(b._id, 'approved'); }}
                                disabled={actionStatus[b._id] === 'loading'}
                              >
                                <FiCheckCircle />
                              </button>
                              <button
                                className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition shadow"
                                title="Reject"
                                onClick={e => { e.stopPropagation(); handleStatusChange(b._id, 'rejected'); }}
                                disabled={actionStatus[b._id] === 'loading'}
                              >
                                <FiXCircle />
                              </button>
                            </>
                          )}
                          <button
                            className="p-2 rounded-full bg-marriagePink text-marriageHotPink hover:bg-marriageHotPink hover:text-white transition shadow"
                            title="Chat with Client"
                            onClick={e => { e.stopPropagation(); setShowChat({ booking: b }); }}
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
          {/* Close icon outside the modal */}
          <button
            className="absolute top-[3%] right-[18%] rounded-full text-marriageRed text-4xl font-bold hover:text-marriageHotPink z-50 flex items-center justify-center"
            onClick={() => setShowChat(false)}
            aria-label="Close chat"
            style={{ width: 48, height: 48 }}
          >
            <FiX />
          </button>
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-marriagePink p-0 max-w-4xl w-full h-[44rem] flex flex-col overflow-hidden relative">
            <div className="flex-1 flex flex-col bg-gradient-to-br from-white via-marriagePink/10 to-marriagePink/5">
              <OwnerChat hallId={showChat.booking ? showChat.booking.hallId?._id : bookings[0]?.hallId?._id} bookings={bookings} booking={showChat.booking} />
            </div>
          </div>
        </div>
      )}
      {/* Booking Detail Drawer */}
      {showDrawer && selectedBooking && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="flex-1 bg-black bg-opacity-40" onClick={() => { setShowDrawer(false); dispatch(clearSelectedBooking()); }} />
          <div className="w-full max-w-4xl bg-white h-full shadow-2xl p-0 relative flex flex-col animate-fadeInRight rounded-l-2xl">
            <button
              className="absolute top-4 right-4 text-marriageRed text-3xl font-bold hover:text-marriageHotPink z-50 flex items-center justify-center"
              onClick={() => { setShowDrawer(false); dispatch(clearSelectedBooking()); }}
              aria-label="Close details"
            >
              <FiX />
            </button>
            <div className="flex flex-1 flex-col md:flex-row gap-6 p-8 overflow-y-auto">
              {/* Left: Conversation/Details */}
              <div className="flex-1 bg-gray-50 rounded-2xl shadow p-6 flex flex-col min-w-[320px] max-w-[420px] border border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-marriageHotPink">Booking Conversation</h3>
                {/* If you have a conversation log, render it here. Otherwise, show a summary. */}
                <div className="flex flex-col gap-4 text-base text-gray-700 h-full">
                  <div className="flex flex-col gap-3 bg-white rounded-xl p-4 shadow-inner border border-marriagePink/20 h-full">
              
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold">Status:</span>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : selectedBooking.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{selectedBooking.status}</span>
                    </div>
                    <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Menu Details</label>
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                      {selectedBooking.menuId && typeof selectedBooking.menuId === 'object' ? (
                        <>
                          <div className="font-semibold text-marriageHotPink">{selectedBooking.menuId.name}</div>
                          <div className="text-gray-600 text-sm mb-1">{selectedBooking.menuId.description}</div>
                          <div className="text-gray-800 font-semibold mb-1">Price: {selectedBooking.menuId.basePrice || selectedBooking.menuId.price} PKR</div>
                          {selectedBooking.menuId.items && selectedBooking.menuId.items.length > 0 && (
                            <div className="mb-1">
                              <div className="font-semibold text-marriageHotPink">Items:</div>
                              <ul className="list-disc pl-5 text-gray-700 text-sm">
                                {selectedBooking.menuId.items.map((item, idx) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {selectedBooking.menuId.addOns && selectedBooking.menuId.addOns.length > 0 && (
                            <div className="mb-1">
                              <div className="font-semibold text-marriageHotPink">Add-Ons:</div>
                              <ul className="list-disc pl-5 text-gray-700 text-sm">
                                {selectedBooking.menuId.addOns.map((addOn, idx) => (
                                  <li key={idx}>{addOn.name} (+{addOn.price} PKR)</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="pl-2 text-gray-600">{selectedBooking.menuId || '-'}</div>
                      )}
                    </div>
                  </div>
                  </div>
                </div>
              </div>
              {/* Right: Booking Summary Card */}
              <div className="flex-1 bg-white rounded-2xl shadow p-6 flex flex-col min-w-[320px] max-w-[420px] border border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-marriageHotPink">Conversation Summary</h3>
                <form className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Guest's Full Name</label>
                      <input className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 text-gray-700" value={selectedBooking.guestName || ''} readOnly />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Date to come</label>
                      <div className="relative">
                        <input className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 text-gray-700 pr-8" value={new Date(selectedBooking.bookingDate).toLocaleDateString()} readOnly />
                        <FiCalendar className="absolute right-2 top-1/2 -translate-y-1/2 text-marriageHotPink" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number</label>
                      <input className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 text-gray-700" value={selectedBooking.guestPhone || ''} readOnly />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Time to come</label>
                      <div className="relative">
                        <input className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 text-gray-700 pr-8" value={new Date(selectedBooking.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} readOnly />
                        <FiClock className="absolute right-2 top-1/2 -translate-y-1/2 text-marriageHotPink" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                      <input className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 text-gray-700" value={selectedBooking.guestEmail || ''} readOnly />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Number of Guests</label>
                      <input className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 text-gray-700" value={selectedBooking.numberOfGuests || ''} readOnly />
                    </div>
                  </div>
              
                  <div className="flex gap-4 mt-4">
                    <button type="button" className="flex-1 py-2 rounded-lg border border-marriageHotPink text-marriageHotPink font-bold bg-white cursor-not-allowed" disabled>Cancel</button>
                    <button type="button" className="flex-1 py-2 rounded-lg bg-marriageHotPink text-white font-bold cursor-not-allowed" disabled>Save</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
  </div>
);
};

export default OwnerDashboard; 