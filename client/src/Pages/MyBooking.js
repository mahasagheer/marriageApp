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

const StatusBadge = ({ event }) => {
  const firstName = event.guestName ? event.guestName.split(' ')[0] : '';
  const baseClass =
    'inline-flex items-center px-1 py-0 sm:px-3 sm:py-1 rounded-full text-xs font-semibold shadow border-2';

  const statusStyles =
    event.status === 'approved'
      ? 'bg-green-100 text-green-700 border-green-400'
      : event.status === 'pending'
      ? 'bg-yellow-100 text-yellow-700 border-yellow-400'
      : event.status === 'rejected'
      ? 'bg-red-100 text-red-700 border-red-400'
      : 'bg-amber-100 text-amber-700 border-amber-400';

  return (
    <span className={`${baseClass} ${statusStyles}`} style={{ pointerEvents: 'none' }}>
      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
      {firstName && (
        <span className="hidden sm:inline"> - {firstName}</span>
      )}
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
      dispatch(fetchHalls());
    } else {
      dispatch(fetchHalls());
    }
    dispatch(fetchBookings());
  }, [dispatch, user?.role]);

  useEffect(() => {
    if (Object.values(actionStatus).includes('error')) {
      toast.error('Error updating booking status!');
    } else if (Object.values(actionStatus).includes('success')) {
      toast.success('Booking status updated successfully!');
    }
  }, [actionStatus]);

  const handleEventClick = (event) => {
    setSelectedBookings([event.raw || event]);
    setDrawerDate(event.start);
    setDrawerOpen(true);
  };

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

  const getBookingEventsForHall = (hallId) => {
    return bookings
      .filter(b => b.hallId && (b.hallId._id === hallId || b.hallId === hallId))
      .map(b => ({
        ...b,
        title: b.guestName || 'Booking',
        start: new Date(b.bookingDate),
        end: new Date(new Date(b.bookingDate).getTime() + 2 * 60 * 60 * 1000),
        raw: b,
      }));
  };

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
      <div className="p-2 sm:p-4 md:p-6 md:mt-0 sm:mt-[5%] mt-[15%]">
        <h2 className="text-3xl sm:text-2xl md:text-3xl text-marriageHotPink font-bold text-gray-800 mb-4 sm:mb-6">My Bookings</h2>
        {loading ? (
              <div className="loader"></div>
            ) : halls.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center text-gray-400">
            You have no halls. Add a hall to see bookings.
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:gap-6">
            {halls.map((hall) => {
              const events = getBookingEventsForHall(hall._id);
              return (
                <div key={hall._id} className="bg-white rounded-lg shadow p-3 sm:p-4">
                  <h3 className="text-xl sm:text-3xl font-semibold mb-2 sm:mb-3 text-marriageHotPink flex items-center gap-2">
                    {hall.name} - Bookings Calendar
                  </h3>
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[300px] sm:min-w-0">
                      <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
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
  <div className="fixed inset-0 z-50 flex">
    {/* Background Overlay */}
    <div
      className="flex-1 bg-black bg-opacity-40 transition-opacity duration-300 ease-in-out"
      onClick={() => setDrawerOpen(false)}
    />

    {/* Slide-in Drawer */}
    <div
      className={`w-full max-w-md bg-white h-full shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out ${
        drawerOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-2xl font-bold text-marriageHotPink flex items-center gap-2">
          <FiCalendar className="text-2xl" />
          Bookings for {drawerDate ? new Date(drawerDate).toLocaleDateString() : ''}
        </h3>
        <button
          className="text-marriageRed hover:text-marriageHotPink text-2xl font-bold"
          onClick={() => setDrawerOpen(false)}
          aria-label="Close details"
        >
          <FiX />
        </button>
      </div>

      {/* Booking Details */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedBookings.map((selectedBooking, idx) => (
          <div key={selectedBooking._id} className="mb-4 pb-4 border-b last:border-b-0">
            <div className="mb-2 flex items-start gap-2">
              <FiUser className="text-marriageHotPink mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Guest: </span>
                {selectedBooking.guestName || '-'}
              </div>
            </div>
            <div className="mb-2 flex items-start gap-2">
              <FiMail className="text-marriageHotPink mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Email: </span>
                {selectedBooking.guestEmail || '-'}
              </div>
            </div>
            <div className="mb-2 flex items-start gap-2">
              <FiClock className="text-marriageHotPink mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Date: </span>
                {selectedBooking.bookingDate
                  ? new Date(selectedBooking.bookingDate).toLocaleString()
                  : '-'}
              </div>
            </div>
            <div className="mb-3 flex items-center gap-2">
              <span className="font-semibold">Status: </span>
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                  selectedBooking.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : selectedBooking.status === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {selectedBooking.status}
              </span>
            </div>

            {/* Approve / Reject Buttons */}
            {selectedBooking.status === 'pending' && (
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <button
                  className="flex-1 px-3 py-2 bg-green-500 text-white rounded font-bold hover:bg-green-600 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                  onClick={() =>
                    dispatch(updateBookingStatus({ id: selectedBooking._id, status: 'approved' }))
                  }
                  disabled={actionStatus[selectedBooking._id] === 'loading'}
                >
                  <FiCheckCircle className="text-sm sm:text-base" /> Approve
                </button>
                <button
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded font-bold hover:bg-red-600 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                  onClick={() =>
                    dispatch(updateBookingStatus({ id: selectedBooking._id, status: 'rejected' }))
                  }
                  disabled={actionStatus[selectedBooking._id] === 'loading'}
                >
                  <FiXCircle className="text-sm sm:text-base" /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
)}

      </div>
    </OwnerLayout>
  );
};