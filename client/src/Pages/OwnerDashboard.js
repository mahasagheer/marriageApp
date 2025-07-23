import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBookings, fetchBookingById, updateBookingStatus, clearSelectedBooking, fetchPaymentByBookingId, sharePaymentNumber, verifyPayment } from "../slice/bookingSlice";
import { fetchUnreadCount } from "../slice/chatSlice";
import { getSocket } from "../socket";
import { FiUser,FiSearch, FiMessageSquare, FiList, FiCheckCircle, FiXCircle, FiClock, FiUsers, FiX, FiMail, FiPhone, FiCalendar, FiGift, FiDollarSign } from "react-icons/fi";
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
  const user = useSelector(state => state.auth.user);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showCustomDealModal, setShowCustomDealModal] = useState(false);
  const [activeTab, setActiveTab] = useState('menu');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Payment state for manager
  const [paymentNumberInput, setPaymentNumberInput] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [payment, setPayment] = useState(null);
  const [paymentSharing, setPaymentSharing] = useState(false);

  useEffect(() => {
    dispatch(fetchBookings());
    if (user?.role === 'hall-owner' && user?.id) {
      dispatch(fetchUnreadCount(user.id));
    }
    
    const socket = getSocket();
    const handleNewBooking = (booking) => {
      dispatch(fetchBookings());
    };
    socket.on('newBooking', handleNewBooking);
    return () => {
      socket.off('newBooking', handleNewBooking);
    };
  }, [dispatch, user?.role, user?.id]);

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

  const handleVerifyPayment = (status) => {
    if (!payment?._id) return;
    setPaymentLoading(true);
    setPaymentError("");
    dispatch(verifyPayment({ paymentId: payment._id, status }))
      .unwrap()
      .then(() => {
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

  const hallId = bookings.length > 0 ? bookings[0].hallId?._id || bookings[0].hallId : null;

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
      <div className=" bg-gray-50">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden fixed top-4 left-4 z-50 bg-marriageHotPink text-white p-2 rounded-lg shadow-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="absolute left-0 top-0 h-full w-64 shadow-lg transform transition-transform duration-300 ease-in-out">
              <OwnerSidebar />
            </div>
          </div>
        )}

        <div className="px-2 sm:px-4 py-2 sm:py-4 transition-all duration-300 w-full">
          {/* Dashboard Header */}
          <div className="flex flex-col md:mt-0 sm:mt-[5%] mt-[15%] md:flex-row md:items-center md:justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-marriagePink flex items-center justify-center text-marriageHotPink text-lg sm:text-xl md:text-2xl font-bold shadow">
                <FiUser />
              </div>
              <div>
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold text-marriageHotPink mb-1">
                  Welcome, {userName}!
                </h1>
                <div className="text-gray-500 text-xs sm:text-sm">Manage your hall bookings and chat with clients.</div>
              </div>
            </div>
            
            {/* Create Custom Deal Button */}
            <div className="flex flex-row sm:flex-row gap-2 sm:gap-3 items-start sm:items-center w-full sm:w-auto">
              <button
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-marriageHotPink text-white font-bold shadow hover:bg-marriageRed transition text-xs sm:text-sm md:text-sm lg:text-base w-full sm:w-auto"
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
                className="relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-marriageHotPink text-white font-bold shadow hover:bg-marriageRed transition text-xs sm:text-sm md:text-base w-full sm:w-auto"
                onClick={() => setShowChat(true)}
              >
                <FiMessageSquare className="inline-block mr-1 sm:mr-2" />
                Chat
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-marriageRed text-white text-[10px] sm:text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Booking Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow p-3 sm:p-4 flex flex-col items-center animate-fadeInUp">
              <FiList className="text-marriageHotPink text-xl sm:text-2xl mb-1 sm:mb-2" />
              <div className="text-sm sm:text-lg font-bold">{bookingStats.total}</div>
              <div className="text-gray-500 text-[10px] sm:text-xs">Bookings</div>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow p-3 sm:p-4 flex flex-col items-center animate-fadeInUp">
              <FiClock className="text-yellow-500 text-xl sm:text-2xl mb-1 sm:mb-2" />
              <div className="text-sm sm:text-lg font-bold">{bookingStats.pending}</div>
              <div className="text-gray-500 text-[10px] sm:text-xs">Pending</div>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow p-3 sm:p-4 flex flex-col items-center animate-fadeInUp">
              <FiCheckCircle className="text-green-500 text-xl sm:text-2xl mb-1 sm:mb-2" />
              <div className="text-sm sm:text-lg font-bold">{bookingStats.approved}</div>
              <div className="text-gray-500 text-[10px] sm:text-xs">Approved</div>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow p-3 sm:p-4 flex flex-col items-center animate-fadeInUp">
              <FiXCircle className="text-red-500 text-xl sm:text-2xl mb-1 sm:mb-2" />
              <div className="text-sm sm:text-lg font-bold">{bookingStats.rejected}</div>
              <div className="text-gray-500 text-[10px] sm:text-xs">Rejected</div>
            </div>
          </div>

          {/* Bookings Table/Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow p-2 sm:p-3 md:p-4 animate-fadeInUp overflow-x-auto">
     <div className="flex justify-between items-center mb-3">
      <h2 className="text-sm sm:text-base flex items-center md:text-lg font-bold text-marriageHotPink mb-3 flex gap-1 sm:gap-2">
        <FiUsers className="text-base sm:text-lg" /> Bookings
      </h2>

      {/* Search bar */}
      <div className="mb-3">
  <div className="relative w-[300px]">
    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
      <FiSearch className="text-base" />
    </span>
    <input
      type="text"
      placeholder="Search by hall or guest name..."
      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-marriageHotPink text-sm"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
</div>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : error ? (
        <div className="text-marriageRed text-center py-4">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="text-gray-400 text-center py-4">No bookings found.</div>
      ) : (
        <div className="overflow-x-auto max-h-[46vh]">
          <table className="min-w-full bg-white rounded-lg shadow text-xs sm:text-sm table-auto">
            <thead>
              <tr className="bg-marriagePink/20 text-left">
                <th className="py-2 px-3 whitespace-nowrap text-left">Hall</th>
                <th className="py-2 px-3 whitespace-nowrap text-left">Date</th>
                <th className="py-2 px-3 whitespace-nowrap text-left">Time</th>
                <th className="py-2 px-3 whitespace-nowrap text-left">Guest</th>
                <th className="py-2 px-3 whitespace-nowrap text-left">Status</th>
                <th className="py-2 px-3 whitespace-nowrap text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings
                .filter((b) => {
                  const hallName = b.hallId?.name?.toLowerCase() || '';
                  const guestName = b.guestName?.toLowerCase() || '';
                  return (
                    hallName.includes(searchTerm.toLowerCase()) ||
                    guestName.includes(searchTerm.toLowerCase())
                  );
                })
                .map((b, idx) => {
                  const dateObj = new Date(b.bookingDate);
                  const date = dateObj.toLocaleDateString();
                  const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                    <tr
                      key={b._id}
                      className={`border-b transition animate-fadeIn ${
                        idx % 2 === 0 ? 'bg-marriagePink/5' : 'bg-white'
                      } hover:bg-marriagePink/20 cursor-pointer`}
                      onClick={() => handleBookingRowClick(b)}
                    >
                      <td className="py-2 px-3 font-medium whitespace-nowrap text-left">
                        {b.hallId?.name || '-'}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-left">{date}</td>
                      <td className="py-2 px-3 whitespace-nowrap text-left">{time}</td>
                      <td className="py-2 px-3 whitespace-nowrap text-left">{b.guestName || '-'}</td>
                      <td className="py-2 px-3 whitespace-nowrap text-left">
                        <span
                          className={`inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                            b.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : b.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-left">
                        <div className="flex gap-1 sm:gap-2 items-center">
                          {b.status === 'pending' && (
                            <>
                              <button
                                className="p-1 sm:p-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition shadow"
                                title="Approve"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(b._id, 'approved');
                                }}
                                disabled={actionStatus[b._id] === 'loading'}
                              >
                                <FiCheckCircle className="text-sm sm:text-base" />
                              </button>
                              <button
                                className="p-1 sm:p-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition shadow"
                                title="Reject"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(b._id, 'rejected');
                                }}
                                disabled={actionStatus[b._id] === 'loading'}
                              >
                                <FiXCircle className="text-sm sm:text-base" />
                              </button>
                            </>
                          )}
                          <button
                            className="p-1 sm:p-1.5 rounded-full bg-marriagePink text-marriageHotPink hover:bg-marriageHotPink hover:text-white transition shadow"
                            title="Chat with Client"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowChat({ booking: b });
                            }}
                          >
                            <FiMessageSquare className="text-sm sm:text-base" />
                          </button>
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
              <div className="relative w-full h-full max-w-4xl max-h-screen flex flex-col bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
                <button
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 z-50 bg-marriageRed text-white rounded-full p-1 sm:p-1.5 hover:bg-marriageHotPink transition"
                  onClick={() => setShowChat(false)}
                  aria-label="Close chat"
                >
                  <FiX className="text-lg sm:text-xl" />
                </button>
                <div className="flex-1 flex flex-col bg-gradient-to-br from-white via-marriagePink/10 to-marriagePink/5">
                  <OwnerChat 
                    hallId={user?.role === 'admin' ? null : (showChat.booking ? showChat.booking.hallId?._id : bookings[0]?.hallId?._id)} 
                    bookings={bookings} 
                    booking={showChat.booking} 
                    isAdmin={user?.role === 'admin'} 
                    disableSend={user?.role === 'admin' || user?.role === 'manager'} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Booking Detail Drawer */}
          {showDrawer && selectedBooking && (
            <div className="fixed inset-0 z-50 flex">
              <div 
                className="flex-1 bg-black bg-opacity-40" 
                onClick={() => { setShowDrawer(false); dispatch(clearSelectedBooking()); }} 
              />
              <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl h-full bg-white shadow-lg flex flex-col animate-fadeInRight">
                <button
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 z-50 bg-marriageRed text-white rounded-full p-1 sm:p-1.5 hover:bg-marriageHotPink transition"
                  onClick={() => { setShowDrawer(false); dispatch(clearSelectedBooking()); }}
                  aria-label="Close details"
                >
                  <FiX className="text-lg sm:text-xl" />
                </button>
                
                <div className="flex-1 flex flex-col overflow-y-auto">
                  {/* Modern Tabs Navigation */}
                  <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-marriagePink/20 flex overflow-x-auto px-4 pt-4 pb-1 gap-1 rounded-t-lg shadow-sm">
                    <button
                      className={`flex items-center gap-1 sm:gap-2 justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-t-lg font-bold transition-all duration-150 text-xs sm:text-sm ${activeTab === 'menu' ? 'bg-marriageHotPink text-white shadow' : 'bg-white text-marriageHotPink hover:bg-marriagePink/10'}`}
                      onClick={() => setActiveTab('menu')}
                    >
                      <FiList className="text-sm sm:text-base" /> Menu
                    </button>
                    <button
                      className={`flex items-center gap-1 sm:gap-2 justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-t-lg font-bold transition-all duration-150 text-xs sm:text-sm ${activeTab === 'user' ? 'bg-marriageHotPink text-white shadow' : 'bg-white text-marriageHotPink hover:bg-marriagePink/10'}`}
                      onClick={() => setActiveTab('user')}
                    >
                      <FiUser className="text-sm sm:text-base" /> Details
                    </button>
                    <button
                      className={`flex items-center gap-1 sm:gap-2 justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-t-lg font-bold transition-all duration-150 text-xs sm:text-sm ${activeTab === 'decoration' ? 'bg-marriageHotPink text-white shadow' : 'bg-white text-marriageHotPink hover:bg-marriagePink/10'}`}
                      onClick={() => setActiveTab('decoration')}
                    >
                      <FiGift className="text-sm sm:text-base" /> Decoration
                    </button>
                    <button
                      className={`flex items-center gap-1 sm:gap-2 justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-t-lg font-bold transition-all duration-150 text-xs sm:text-sm ${activeTab === 'payment' ? 'bg-marriageHotPink text-white shadow' : 'bg-white text-marriageHotPink hover:bg-marriagePink/10'}`}
                      onClick={() => setActiveTab('payment')}
                    >
                      <FiDollarSign className="text-sm sm:text-base" /> Payment
                    </button>
                  </div>
                  
                  {/* Tab Content */}
                  <div className="flex-1 p-4 sm:p-6 bg-white rounded-b-lg">
                    {/* Payment Tab */}
                    {activeTab === 'payment' && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-marriageHotPink mb-3 flex items-center gap-2">
                          <FiDollarSign className="text-base sm:text-lg" /> Payment Details
                        </h3>
                        {paymentLoading ? (
              <div className="loader"></div>
                        ) : user?.role === 'owner' ? (
                          payment ? (
                            <div className="mb-3">
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
                            <div className="text-gray-400 text-center py-4">Payment not made yet.</div>
                          )
                        ) : paymentError && paymentError.includes('Payment not found') ? (
                          (user?.role === 'manager' || user?.role === 'admin') ? (
                            selectedBooking && selectedBooking.status === 'rejected' ? (
                              <div className="text-gray-400 text-center py-4">Cannot send payment request for a rejected booking.</div>
                            ) : (
                              <div className="space-y-3">
                                <label className="block text-marriageHotPink font-semibold">Payment Number:</label>
                                <input
                                  type="text"
                                  className="w-full border rounded px-3 py-2 text-sm sm:text-base"
                                  value={paymentNumberInput}
                                  onChange={e => setPaymentNumberInput(e.target.value)}
                                  placeholder="e.g. Bank Account or Mobile Wallet Number"
                                  disabled={paymentLoading || paymentSharing}
                                />
                                <button
                                  className="w-full sm:w-auto bg-marriageHotPink text-white px-4 py-2 rounded font-bold hover:bg-marriageRed transition text-sm sm:text-base"
                                  onClick={handleSharePaymentNumber}
                                  disabled={paymentLoading || paymentSharing || !paymentNumberInput}
                                >
                                  {paymentSharing ? 'Sharing...' : 'Share Payment Number'}
                                </button>
                              </div>
                            )
                          ) : (
                            <div className="text-gray-400 text-center py-4">No payment info available.</div>
                          )
                        ) : (
                          // Manager/Admin: show full payment details and actions
                          payment && (
                            <div className="space-y-3">
                              <div>
                                <span className="font-semibold">Payment Number: </span>
                                <span>{payment?.paymentNumber || 'N/A'}</span>
                              </div>
                              <div>
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
                                <div className="mt-3">
                                  <span className="font-semibold text-marriageHotPink block mb-2">Payment Proof:</span>
                                  <img 
                                    src={`/${payment.proofImage}`} 
                                    alt="Payment Proof" 
                                    className="max-w-full h-auto max-h-40 rounded shadow border" 
                                  />
                                </div>
                              )}
                              {/* Manager actions */}
                              {(user?.role === 'manager' || user?.role === 'admin') && payment?.status === 'awaiting_verification' && payment?.proofImage && selectedBooking && selectedBooking.status !== 'rejected' && (
                                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                  <button
                                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded font-bold shadow hover:bg-green-700 transition text-sm sm:text-base"
                                    onClick={() => handleVerifyPayment('verified')}
                                    disabled={paymentLoading}
                                  >
                                    Verify Payment
                                  </button>
                                  <button
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded font-bold shadow hover:bg-red-700 transition text-sm sm:text-base"
                                    onClick={() => handleVerifyPayment('rejected')}
                                    disabled={paymentLoading}
                                  >
                                    Reject Payment
                                  </button>
                                </div>
                              )}
                              {(user?.role === 'manager' || user?.role === 'admin') && payment?.status === 'awaiting_verification' && payment?.proofImage && selectedBooking && selectedBooking.status === 'rejected' && (
                                <div className="text-gray-400 mt-3 text-center py-2">
                                  Cannot verify or reject payment for a rejected booking.
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}
                    
                    {/* Menu Tab */}
                    {activeTab === 'menu' && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-marriageHotPink mb-3 flex items-center gap-2">
                          <FiList className="text-base sm:text-lg" /> Menu Details
                        </h3>
                        {selectedBooking.menuItems && selectedBooking.menuItems.length > 0 ? (
  <div className="space-y-2">
    <div className="font-semibold text-marriageHotPink">Custom Menu Items</div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-gray-700 text-sm sm:text-base">
      {selectedBooking.menuItems.map((item, idx) => (
        <div key={idx} className="flex items-start gap-1">
          <span className="mt-1 text-marriageHotPink">•</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  </div>
) : selectedBooking.menuId && typeof selectedBooking.menuId === 'object' ? (
  <div className="space-y-2">
    <div className="font-semibold text-marriageHotPink">{selectedBooking.menuId.name}</div>
    <div className="text-gray-600 text-sm">{selectedBooking.menuId.description}</div>
    <div className="text-gray-800 font-semibold">
      Price: {selectedBooking.menuId.basePrice || selectedBooking.menuId.price} PKR
    </div>

    {selectedBooking.menuId.items && selectedBooking.menuId.items.length > 0 && (
      <div className="mt-2">
        <div className="font-semibold text-marriageHotPink">Items:</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-gray-700 text-sm sm:text-base">
          {selectedBooking.menuId.items.map((item, idx) => (
            <div key={idx} className="flex items-start gap-1">
              <span className="mt-1 text-marriageHotPink">•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {selectedBooking.menuId.addOns && selectedBooking.menuId.addOns.length > 0 && (
      <div className="mt-2">
        <div className="font-semibold text-marriageHotPink">Add-Ons:</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-gray-700 text-sm sm:text-base">
          {selectedBooking.menuId.addOns.map((addOn, idx) => (
            <div key={idx} className="flex items-start gap-1">
              <span className="mt-1 text-marriageHotPink">•</span>
              <span>{addOn.name} (+{addOn.price} PKR)</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
) : (
  <div className="text-gray-400 text-center py-4">No menu details available.</div>
)}

                      </div>
                    )}
                    
                    {/* User Tab */}
                    {activeTab === 'user' && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-marriageHotPink mb-3 flex items-center gap-2">
                          <FiUser className="text-base sm:text-lg" /> User Details
                        </h3>
                        <div className="space-y-2">
                          <div><span className="font-semibold">Name:</span> {selectedBooking.guestName || '-'}</div>
                          <div><span className="font-semibold">Email:</span> {selectedBooking.guestEmail || '-'}</div>
                          <div><span className="font-semibold">Phone:</span> {selectedBooking.guestPhone || '-'}</div>
                          <div><span className="font-semibold">Date:</span> {selectedBooking.bookingDate ? new Date(selectedBooking.bookingDate).toLocaleDateString() : '-'}</div>
                          <div><span className="font-semibold">Price:</span> {selectedBooking.price ? `Rs. ${selectedBooking.price}` : '-'}</div>
                          <div className="mt-3">
                            <span className="font-semibold">Message:</span> 
                            <div className="mt-1 p-2 bg-gray-50 rounded text-sm">{selectedBooking.message || '-'}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Decoration Tab */}
                    {activeTab === 'decoration' && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-marriageHotPink mb-3 flex items-center gap-2">
                          <FiGift className="text-base sm:text-lg" /> Decoration Details
                        </h3>
                        {selectedBooking.decorationItems && selectedBooking.decorationItems.length > 0 ? (
                          <div className="space-y-2">
                            <div className="font-semibold text-marriageHotPink">Custom Decoration Items</div>
                            <ul className="list-disc pl-5 text-gray-700 text-sm sm:text-base space-y-1">
                              {selectedBooking.decorationItems.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ) : selectedBooking.decorationIds && Array.isArray(selectedBooking.decorationIds) && selectedBooking.decorationIds.length > 0 ? (
                          <div className="space-y-2">
                            <div className="font-semibold text-marriageHotPink">Decoration IDs</div>
                            <ul className="list-disc pl-5 text-gray-700 text-sm sm:text-base space-y-1">
                              {selectedBooking.decorationIds.map((id, idx) => {
                                let name = typeof id === 'object' && id.name ? id.name : id;
                                let addOns = (typeof id === 'object' && id.addOns && Array.isArray(id.addOns) && id.addOns.length > 0)
                                  ? ` (${id.addOns.map(a => a.name || a).join(', ')})`
                                  : '';
                                return <li key={idx}>{name}{addOns}</li>;
                              })}
                            </ul>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-center py-4">No decoration details available.</div>
                        )}
                      </div>
                    )}
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