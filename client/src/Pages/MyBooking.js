import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchHalls } from "../slice/hallSlice";
import { fetchBookings, updateBookingStatus } from "../slice/bookingSlice";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import OwnerLayout from "../Components/OwnerLayout";
import { FiX, FiCalendar, FiUser, FiMail, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

// Custom Event badge component for bookings only
const StatusBadge = ({ event }) => {
  // Extract first name only
  const firstName = event.guestName ? event.guestName.split(' ')[0] : '';
    return (
  <span
    className={
      event.status === 'approved'
        ? 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border-2 border-green-400 shadow'
        : event.status === 'pending'
        ? 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border-2 border-yellow-400 shadow'
        : event.status === 'rejected'
        ? 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border-2 border-red-400 shadow'
            : 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border-2 border-amber-400 shadow'
        }
        style={{ pointerEvents: 'none' }}
      >
        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
      {firstName ? ` - ${firstName}` : ''}
  </span>
);
};

export const MyBookings = () => {
  const dispatch = useDispatch();
  const { halls, loading } = useSelector((state) => state.halls);
  const { bookings, actionStatus } = useSelector((state) => state.bookings);
  const user = JSON.parse(localStorage.getItem('user'));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [drawerDate, setDrawerDate] = useState(null);

  useEffect(() => {
    if (user?.role === 'manager') {
      dispatch(fetchHalls()); // You may want a manager-specific fetch
    } else {
    dispatch(fetchHalls());
    }
    dispatch(fetchBookings());
  }, [dispatch, user?.role]);

  useEffect(() => {
    if (Object.values(actionStatus).includes('error')) {
      toast.error('Error updating booking status!');
    } else if (Object.values(actionStatus).includes('loading')) {
      // Optionally show a loading toast
    } else if (Object.values(actionStatus).includes('success')) {
      toast.success('Booking status updated successfully!');
    }
  }, [actionStatus]);

  // Handler for clicking a booking event
  const handleEventClick = (event) => {
    setSelectedBookings([event.raw || event]);
    setDrawerDate(event.start);
    setDrawerOpen(true);
  };

  // Handler for clicking a date (show all bookings for that date)
  const handleDateClick = (slotInfo, hall) => {
    const date = slotInfo.start;
    const bookingsForDate = getBookingEventsForHall(hall._id).filter(ev =>
      ev.start.toDateString() === date.toDateString()
    );
    if (bookingsForDate.length > 0) {
      setSelectedBookings(bookingsForDate.map(ev => ev.raw || ev));
      setDrawerDate(date);
      setDrawerOpen(true);
    }
  };

  // Only show bookings as events
  const getBookingEventsForHall = (hallId) => {
    return bookings
      .filter(b => b.hallId && (b.hallId._id === hallId || b.hallId === hallId))
      .map(b => ({
        ...b,
        title: b.guestName || 'Booking',
        start: new Date(b.bookingDate),
        end: new Date(new Date(b.bookingDate).getTime() + 2 * 60 * 60 * 1000), // 2 hour event
        raw: b,
      }));
  };

  // Custom event style getter for coloring badges
  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: 'transparent',
        color: '#b45309',
        borderRadius: '8px',
        border: '2px solid transparent',
        fontWeight: 'bold',
        fontSize: '0.95rem',
        padding: '2px 8px',
      },
    };
  };

  return (
    <OwnerLayout>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className="p-2 sm:p-4 md:p-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-marriageHot font-bold text-gray-800 font-mono mb-6 sm:mb-8">My Bookings</h2>
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : halls.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 sm:p-8 text-center text-gray-400">
            You have no halls. Add a hall to see bookings.
          </div>
        ) : (
          <div className="flex flex-col gap-8 sm:gap-12">
            {halls.map((hall) => {
              const events = getBookingEventsForHall(hall._id);
              return (
                <div key={hall._id} className="bg-white rounded-xl shadow p-3 sm:p-6">
                  <h3 className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-4 text-marriageHotPink flex items-center gap-2 sm:gap-4">
                  {hall.name} - Bookings Calendar
                </h3>
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[340px] sm:min-w-0">
                  <Calendar
                    localizer={localizer}
                      events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 400 }}
                        onSelectEvent={handleEventClick}
                    selectable
                    onSelectSlot={(slotInfo) => handleDateClick(slotInfo, hall)}
                    eventPropGetter={eventStyleGetter}
                    components={{ event: StatusBadge }}
                  />
                    </div>
                  </div>
              </div>
              );
            })}
          </div>
        )}
        {/* Booking Detail Drawer */}
        {drawerOpen && selectedBookings.length > 0 && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="flex-1 bg-black bg-opacity-40" onClick={() => setDrawerOpen(false)} />
            <div className="w-full max-w-md bg-white h-full shadow-2xl p-0 relative flex flex-col animate-fadeInRight rounded-l-2xl">
              <button
                className="absolute top-4 right-4 text-marriageRed text-3xl font-bold hover:text-marriageHotPink z-50 flex items-center justify-center"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close details"
              >
                <FiX />
              </button>
              <div className="flex-1 flex flex-col gap-0 p-0 overflow-y-auto">
                <div className="px-4 sm:px-8 pt-8 pb-4">
                  <h3 className="text-lg sm:text-2xl font-bold text-marriageHotPink mb-4 flex items-center gap-2"><FiCalendar /> Bookings for {drawerDate ? new Date(drawerDate).toLocaleDateString() : ''}</h3>
                  {selectedBookings.map((selectedBooking, idx) => (
                    <div key={selectedBooking._id} className="mb-6 border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="mb-2 flex items-center gap-2"><FiUser className="text-marriageHotPink" /> <span className="font-semibold">Guest:</span> {selectedBooking.guestName || '-'}</div>
                      <div className="mb-2 flex items-center gap-2"><FiMail className="text-marriageHotPink" /> <span className="font-semibold">Email:</span> {selectedBooking.guestEmail || '-'}</div>
                      <div className="mb-2 flex items-center gap-2"><FiClock className="text-marriageHotPink" /> <span className="font-semibold">Date:</span> {selectedBooking.bookingDate ? new Date(selectedBooking.bookingDate).toLocaleString() : '-'}</div>
                      <div className="mb-2 flex items-center gap-2"><span className="font-semibold">Status:</span> <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : selectedBooking.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{selectedBooking.status}</span></div>
                      {selectedBooking.status === 'pending' && (
                        <div className="flex gap-4 mt-4">
                          <button
                            className="px-4 py-2 bg-green-500 text-white rounded font-bold shadow hover:bg-green-700 transition flex items-center gap-2"
                            onClick={() => dispatch(updateBookingStatus({ id: selectedBooking._id, status: 'approved' }))}
                            disabled={actionStatus[selectedBooking._id] === 'loading'}
                          >
                            <FiCheckCircle /> Approve
                          </button>
                          <button
                            className="px-4 py-2 bg-red-500 text-white rounded font-bold shadow hover:bg-red-700 transition flex items-center gap-2"
                            onClick={() => dispatch(updateBookingStatus({ id: selectedBooking._id, status: 'rejected' }))}
                            disabled={actionStatus[selectedBooking._id] === 'loading'}
                          >
                            <FiXCircle /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </OwnerLayout>
  );
};
