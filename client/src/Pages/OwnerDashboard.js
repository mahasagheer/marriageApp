import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBookings, fetchBookingById, updateBookingStatus, clearSelectedBooking, fetchPaymentByBookingId, sharePaymentNumber, verifyPayment } from "../slice/bookingSlice";
import { fetchUnreadCount } from "../slice/chatSlice";
import { getSocket } from "../socket";
import { FiUser, FiMessageSquare, FiList, FiCheckCircle, FiXCircle, FiClock, FiUsers, FiX, FiMail, FiPhone, FiCalendar, FiGift, FiDollarSign } from "react-icons/fi";
import OwnerChat from './OwnerChat';
import CreateCustomDealModal from '../Components/CreateCustomDealModal';
import OwnerSidebar from '../Components/OwnerSidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OwnerDashboard = () => {
  const dispatch = useDispatch();
  const bookings = useSelector(state => state.bookings.bookings);
  const loading = useSelector(state => state.bookings.loading);
  const error = useSelector(state => state.bookings.error);
  const actionStatus = useSelector(state => state.bookings.actionStatus);
  const selectedBooking = useSelector(state => state.bookings.selectedBooking);
  const selectedBookingLoading = useSelector(state => state.bookings.selectedBookingLoading);
  const unreadCount = useSelector(state => state.chat.unreadCount);
  const user = useSelector(state => state.auth.user); // Use Redux for user

  const [showChat, setShowChat] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showCustomDealModal, setShowCustomDealModal] = useState(false);
  const [activeTab, setActiveTab] = useState('menu');

  // Payment state for manager
  const [paymentNumberInput, setPaymentNumberInput] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [payment, setPayment] = useState(null);
  const [paymentSharing, setPaymentSharing] = useState(false); // New state for sharing payment number

  useEffect(() => {
    dispatch(fetchBookings());
    if (user?.role === 'hall-owner' && user?.id) {
      dispatch(fetchUnreadCount(user.id));
    }
    // Listen for newBooking event via socket.io
    const socket = getSocket();
    const handleNewBooking = (booking) => {
      // Optionally, filter by owner here if needed
      dispatch(fetchBookings());
    };
    socket.on('newBooking', handleNewBooking);
    return () => {
      socket.off('newBooking', handleNewBooking);
    };
  }, [dispatch, user?.role, user?.id]);

  // Fetch payment info when drawer opens and selectedBooking changes
  useEffect(() => {
    if (showDrawer && selectedBooking) {
      setPaymentLoading(true);
      setPaymentError("");
      dispatch(fetchPaymentByBookingId(selectedBooking._id))
        .unwrap()
        .then((data) => {
          setPayment(data);
          setPaymentNumberInput(data?.paymentNumber || "");
        })
        .catch((err) => setPaymentError(err))
        .finally(() => setPaymentLoading(false));
    }
  }, [showDrawer, selectedBooking, dispatch]);

  // Handler for sharing payment number
  const handleSharePaymentNumber = () => {
    if (!paymentNumberInput) return;
    setPaymentLoading(true);
    setPaymentError("");
    dispatch(sharePaymentNumber({ bookingId: selectedBooking._id, paymentNumber: paymentNumberInput }))
      .unwrap()
      .then((data) => setPayment(data))
      .catch((err) => setPaymentError(err))
      .finally(() => setPaymentLoading(false));
  };

  // Handler for verifying/rejecting payment
  const handleVerifyPayment = (status) => {
    if (!payment?._id) return;
    setPaymentLoading(true);
    setPaymentError("");
    dispatch(verifyPayment({ paymentId: payment._id, status }))
      .unwrap()
      .then(() => {
        // Immediately fetch the updated payment details
        dispatch(fetchPaymentByBookingId(selectedBooking._id))
          .unwrap()
          .then((data) => setPayment(data))
          .catch((err) => setPaymentError(err));
      })
      .catch((err) => setPaymentError(err))
      .finally(() => setPaymentLoading(false));
  };

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

  let userName = user?.name || 'Owner';
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

  // Determine hallId for custom deal (use first booking's hallId if available)
  const hallId = bookings.length > 0 ? bookings[0].hallId?._id || bookings[0].hallId : null;

  // Show toast for booking status update
  useEffect(() => {
    if (Object.values(actionStatus).includes('error')) {
      toast.error('Error updating booking status!');
    } else if (Object.values(actionStatus).includes('loading')) {
      // Optionally show a loading toast
    } else if (Object.values(actionStatus).includes('success')) {
      toast.success('Booking status updated successfully!');
    }
  }, [actionStatus]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className="min-h-screen bg-gray-50">
        <div className="px-2 sm:px-4 py-2 sm:py-4 transition-all duration-300 w-full">
      {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-marriagePink flex items-center justify-center text-marriageHotPink text-xl sm:text-2xl md:text-3xl font-bold shadow">
            <FiUser />
          </div>
          <div>
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-marriageHotPink mb-1">
              Welcome, {userName}!
            </h1>
                <div className="text-gray-500 text-xs sm:text-sm">Manage your hall bookings and chat with clients.</div>
          </div>
        </div>
          {/* Create Custom Deal Button */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center w-full sm:w-auto">
            <button
                className="px-4 py-2 rounded-lg bg-marriageHotPink text-white font-bold shadow hover:bg-marriageRed transition text-sm sm:text-base md:text-lg w-full sm:w-auto"
              onClick={() => setShowCustomDealModal(true)}
              disabled={!hallId}
              title={!hallId ? 'No hall available for custom deal' : ''}
            >
              Custom Deal
            </button>
            {showCustomDealModal && (
              <CreateCustomDealModal hallId={hallId} onClose={() => setShowCustomDealModal(false)} />
            )}
        <button
                className="relative px-4 py-2 rounded-lg bg-marriageHotPink text-white font-bold shadow hover:bg-marriageRed transition text-sm sm:text-base md:text-lg w-full sm:w-auto"
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
      </div>
      {/* Booking Summary Cards */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col items-center animate-fadeInUp">
              <FiList className="text-marriageHotPink text-2xl sm:text-3xl mb-2" />
              <div className="text-lg sm:text-2xl font-bold">{bookingStats.total}</div>
              <div className="text-gray-500 text-xs sm:text-base">Bookings</div>
        </div>
            <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col items-center animate-fadeInUp">
              <FiClock className="text-yellow-500 text-2xl sm:text-3xl mb-2" />
              <div className="text-lg sm:text-2xl font-bold">{bookingStats.pending}</div>
              <div className="text-gray-500 text-xs sm:text-base">Pending</div>
        </div>
            <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col items-center animate-fadeInUp">
              <FiCheckCircle className="text-green-500 text-2xl sm:text-3xl mb-2" />
              <div className="text-lg sm:text-2xl font-bold">{bookingStats.approved}</div>
              <div className="text-gray-500 text-xs sm:text-base">Approved</div>
        </div>
            <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col items-center animate-fadeInUp">
              <FiXCircle className="text-red-500 text-2xl sm:text-3xl mb-2" />
              <div className="text-lg sm:text-2xl font-bold">{bookingStats.rejected}</div>
              <div className="text-gray-500 text-xs sm:text-base">Rejected</div>
        </div>
      </div>
      {/* Bookings Table/Card */}
          <div className="bg-white rounded-3xl shadow-lg p-2 sm:p-4 md:p-6 animate-fadeInUp overflow-x-auto">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-marriageHotPink mb-4 flex items-center gap-2"><FiUsers /> Bookings</h2>
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-marriageRed">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="text-gray-400">No bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl shadow text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="bg-marriagePink/20">
                      <th className="py-2 px-2 sm:px-4">Hall</th>
                      <th className="py-2 px-2 sm:px-4">Date</th>
                      <th className="py-2 px-2 sm:px-4">Time</th>
                      <th className="py-2 px-2 sm:px-4">Guest</th>
                      <th className="py-2 px-2 sm:px-4">Email</th>
                      <th className="py-2 px-2 sm:px-4">Status</th>
                      <th className="py-2 px-2 sm:px-4">Actions</th>
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
                          <td className="py-2 px-2 sm:px-4 font-semibold flex items-center gap-2">
                        {b.hallId?.name || '-'}
                      </td>
                          <td className="py-2 px-2 sm:px-4">{date}</td>
                          <td className="py-2 px-2 sm:px-4">{time}</td>
                          <td className="py-2 px-2 sm:px-4 flex items-center gap-2">
                        {b.guestName || '-'}
                      </td>
                          <td className="py-2 px-2 sm:px-4 max-w-[7rem] truncate" title={b.guestEmail || '-'}>
                            {b.guestEmail || '-'}
                          </td>
                          <td className="py-2 px-2 sm:px-4 font-bold capitalize">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : b.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{b.status}</span>
                      </td>
                          <td className="py-2 px-2 sm:px-4">
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
          {/* Owner Chat Modal and Booking Detail Drawer remain unchanged for responsiveness */}
      {showChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn">
          <button
                className="absolute top-4 right-4 rounded-full text-marriageRed text-4xl font-bold hover:text-marriageHotPink z-50 flex items-center justify-center"
            onClick={() => setShowChat(false)}
            aria-label="Close chat"
            style={{ width: 48, height: 48 }}
          >
            <FiX />
          </button>
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-marriagePink p-0 max-w-4xl w-full h-[44rem] flex flex-col overflow-hidden relative">
            <div className="flex-1 flex flex-col bg-gradient-to-br from-white via-marriagePink/10 to-marriagePink/5">
              <OwnerChat hallId={user?.role === 'admin' ? null : (showChat.booking ? showChat.booking.hallId?._id : bookings[0]?.hallId?._id)} bookings={bookings} booking={showChat.booking} isAdmin={user?.role === 'admin'} disableSend={user?.role === 'admin' || user?.role === 'manager'} />
            </div>
          </div>
        </div>
      )}
      {showDrawer && selectedBooking && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="flex-1 bg-black bg-opacity-40" onClick={() => { setShowDrawer(false); dispatch(clearSelectedBooking()); }} />
            <div className="w-full max-w-2xl bg-gradient-to-br from-marriagePink/10 to-white h-full shadow-2xl p-0 relative flex flex-col animate-fadeInRight rounded-l-2xl">
            <button
              className="absolute top-4 right-4 text-marriageRed text-3xl font-bold hover:text-marriageHotPink z-50 flex items-center justify-center"
              onClick={() => { setShowDrawer(false); dispatch(clearSelectedBooking()); }}
              aria-label="Close details"
            >
              <FiX />
            </button>
                {/* Drawer content remains unchanged for responsiveness */}
              <div className="flex flex-1 flex-col gap-0 p-0 overflow-y-auto">
                {/* Modern Tabs Navigation */}
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-marriagePink/20 flex items-center px-8 pt-8 pb-2 gap-2 rounded-t-2xl shadow-sm">
                  <button
                    className={`flex-1 flex items-center gap-2 justify-center px-4 py-2 rounded-t-lg font-bold transition-all duration-150 ${activeTab === 'menu' ? 'bg-marriageHotPink text-white shadow' : 'bg-white text-marriageHotPink hover:bg-marriagePink/10'}`}
                    onClick={() => setActiveTab('menu')}
                  >
                    <FiList className="text-lg" /> Menu
                  </button>
                  <button
                    className={`flex-1 flex items-center gap-2 justify-center px-4 py-2 rounded-t-lg font-bold transition-all duration-150 ${activeTab === 'user' ? 'bg-marriageHotPink text-white shadow' : 'bg-white text-marriageHotPink hover:bg-marriagePink/10'}`}
                    onClick={() => setActiveTab('user')}
                  >
                      <FiUser className="text-lg" /> Details
                  </button>
                  <button
                    className={`flex-1 flex items-center gap-2 justify-center px-4 py-2 rounded-t-lg font-bold transition-all duration-150 ${activeTab === 'decoration' ? 'bg-marriageHotPink text-white shadow' : 'bg-white text-marriageHotPink hover:bg-marriagePink/10'}`}
                    onClick={() => setActiveTab('decoration')}
                  >
                    <FiGift className="text-lg" /> Decoration
                  </button>
                  <button
                    className={`flex-1 flex items-center gap-2 justify-center px-4 py-2 rounded-t-lg font-bold transition-all duration-150 ${activeTab === 'payment' ? 'bg-marriageHotPink text-white shadow' : 'bg-white text-marriageHotPink hover:bg-marriagePink/10'}`}
                    onClick={() => setActiveTab('payment')}
                  >
                    <FiDollarSign className="text-lg" /> Payment
                  </button>
                </div>
                {/* Tab Content Card */}
                <div className="flex-1 flex flex-col items-center justify-start px-4 sm:px-8 py-8 bg-white rounded-b-2xl shadow-lg min-h-[300px]">
                  <div className="w-full max-w-lg">
                    {/* Payment Tab */}
                    {activeTab === 'payment' && (
                      <div>
                        <h3 className="text-xl font-bold text-marriageHotPink mb-4 flex items-center gap-2"><FiDollarSign /> Payment Details</h3>
                        {paymentLoading ? (
                          <div className="text-gray-400">Loading payment info...</div>
                        ) : user?.role === 'owner' ? (
                          payment ? (
                            <div className="mb-2">
                              <span className="font-semibold">Payment Status: </span>
                              <span className={
                                payment?.status === 'verified' ? 'text-green-600' :
                                payment?.status === 'rejected' ? 'text-red-600' :
                                'text-yellow-600'
                              }>
                                {payment?.status?.charAt(0).toUpperCase() + payment?.status?.slice(1)}
                              </span>
                            </div>
                          ) : (
                            <div className="text-gray-400">Payment not made yet.</div>
                          )
                        ) : paymentError && paymentError.includes('Payment not found') ? (
                          (user?.role === 'manager' || user?.role === 'admin') ? (
                            selectedBooking && selectedBooking.status === 'rejected' ? (
                              <div className="text-gray-400">Cannot send payment request for a rejected booking.</div>
                            ) : (
                              <div className="mb-2">
                                <label className="block text-marriageHotPink font-semibold mb-1">Payment Number (to share with user):</label>
                                <input
                                  type="text"
                                  className="w-full border rounded px-3 py-2 mb-2"
                                  value={paymentNumberInput}
                                  onChange={e => setPaymentNumberInput(e.target.value)}
                                  placeholder="e.g. Bank Account or Mobile Wallet Number"
                                  disabled={paymentLoading || paymentSharing}
                                />
                                <button
                                  className="bg-marriageHotPink text-white px-4 py-2 rounded font-bold hover:bg-marriageRed transition"
                                  onClick={handleSharePaymentNumber}
                                  disabled={paymentLoading || paymentSharing || !paymentNumberInput}
                                >
                                  {paymentSharing ? 'Sharing...' : 'Share Payment Number'}
                                </button>
                              </div>
                            )
                          ) : (
                            <div className="text-gray-400">No payment info available.</div>
                          )
                        ) : (
                          // Manager/Admin: show full payment details and actions
                          payment && (
                            <>
                              <div className="mb-2">
                                <span className="font-semibold">Payment Number: </span>
                                <span>{payment?.paymentNumber || 'N/A'}</span>
                              </div>
                              <div className="mb-2">
                                <span className="font-semibold">Status: </span>
                                <span className={
                                  payment?.status === 'verified' ? 'text-green-600' :
                                  payment?.status === 'rejected' ? 'text-red-600' :
                                  'text-yellow-600'
                                }>
                                  {payment?.status?.charAt(0).toUpperCase() + payment?.status?.slice(1)}
                                </span>
                              </div>
                              {payment.proofImage && (
                                <div className="mb-2">
                                  <span className="font-semibold text-marriageHotPink">Payment Proof:</span><br />
                                  <img src={`/${payment.proofImage}`} alt="Payment Proof" className="max-w-xs max-h-40 rounded shadow border mt-2" />
                                </div>
                              )}
                              {/* Manager actions */}
                              {(user?.role === 'manager' || user?.role === 'admin') && payment?.status === 'awaiting_verification' && payment?.proofImage && selectedBooking && selectedBooking.status !== 'rejected' && (
                                <div className="flex gap-4 mt-2">
                                  <button
                                    className="px-4 py-2 bg-green-500 text-white rounded font-bold shadow hover:bg-green-700 transition"
                                    onClick={() => handleVerifyPayment('verified')}
                                    disabled={paymentLoading}
                                  >
                                    Verify Payment
                                  </button>
                                  <button
                                    className="px-4 py-2 bg-red-500 text-white rounded font-bold shadow hover:bg-red-700 transition"
                                    onClick={() => handleVerifyPayment('rejected')}
                                    disabled={paymentLoading}
                                  >
                                    Reject Payment
                                  </button>
                                </div>
                              )}
                              {(user?.role === 'manager' || user?.role === 'admin') && payment?.status === 'awaiting_verification' && payment?.proofImage && selectedBooking && selectedBooking.status === 'rejected' && (
                                <div className="text-gray-400 mt-2">Cannot verify or reject payment for a rejected booking.</div>
                              )}
                            </>
                          )
                        )}
                    </div>
                    )}
                    {activeTab === 'menu' && (
                    <div>
                        <h3 className="text-xl font-bold text-marriageHotPink mb-4 flex items-center gap-2"><FiList /> Menu Details</h3>
                        {selectedBooking.menuItems && selectedBooking.menuItems.length > 0 ? (
                          <>
                            <div className="font-semibold text-marriageHotPink mb-2">Custom Menu Items</div>
                            <ul className="list-disc pl-5 text-gray-700 text-base mb-1">
                              {selectedBooking.menuItems.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </>
                        ) : selectedBooking.menuId && typeof selectedBooking.menuId === 'object' ? (
                          <>
                            <div className="font-semibold text-marriageHotPink mb-2">{selectedBooking.menuId.name}</div>
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
                          <div className="text-gray-400">No menu details available.</div>
                      )}
                    </div>
                    )}
                    {activeTab === 'user' && (
                    <div>
                        <h3 className="text-xl font-bold text-marriageHotPink mb-4 flex items-center gap-2"><FiUser /> User Details</h3>
                        <div className="mb-2"><span className="font-semibold">Name:</span> {selectedBooking.guestName || '-'}</div>
                        <div className="mb-2"><span className="font-semibold">Email:</span> {selectedBooking.guestEmail || '-'}</div>
                        <div className="mb-2"><span className="font-semibold">Phone:</span> {selectedBooking.guestPhone || '-'}</div>
                        <div className="mb-2"><span className="font-semibold">Date:</span> {selectedBooking.bookingDate ? new Date(selectedBooking.bookingDate).toLocaleDateString() : '-'}</div>
                        <div className="mb-2"><span className="font-semibold">Price:</span> {selectedBooking.price ? `Rs. ${selectedBooking.price}` : '-'}</div>
                        <div className="mb-2"><span className="font-semibold">Message:</span> {selectedBooking.message || '-'}</div>
                      </div>
                    )}
                    {activeTab === 'decoration' && (
                    <div>
                        <h3 className="text-xl font-bold text-marriageHotPink mb-4 flex items-center gap-2"><FiGift /> Decoration Details</h3>
                        {selectedBooking.decorationItems && selectedBooking.decorationItems.length > 0 ? (
                          <>
                            <div className="font-semibold text-marriageHotPink mb-2">Custom Decoration Items</div>
                            <ul className="list-disc pl-5 text-gray-700 text-base mb-1">
                              {selectedBooking.decorationItems.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </>
                        ) : selectedBooking.decorationIds && Array.isArray(selectedBooking.decorationIds) && selectedBooking.decorationIds.length > 0 ? (
                          <>
                            <div className="font-semibold text-marriageHotPink mb-2">Decoration IDs</div>
                            <ul className="list-disc pl-5 text-gray-700 text-base mb-1">
                                {selectedBooking.decorationIds.map((id, idx) => {
                                  let name = typeof id === 'object' && id.name ? id.name : id;
                                  let addOns = (typeof id === 'object' && id.addOns && Array.isArray(id.addOns) && id.addOns.length > 0)
                                    ? ` (${id.addOns.map(a => a.name || a).join(', ')})`
                                    : '';
                                  return <li key={idx}>{name}{addOns}</li>;
                                })}
                            </ul>
                          </>
                        ) : (
                          <div className="text-gray-400">No decoration details available.</div>
                        )}
                      </div>
                    )}
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
  </div>
    </>
);
};

export default OwnerDashboard; 