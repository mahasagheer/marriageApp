import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchHalls, fetchHallCalendarData, addAvailableDate, updateAvailableDate, fetchManagerHalls } from "../slice/hallSlice";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import OwnerLayout from "../Components/OwnerLayout";
import { Dropdown } from "../Components/Layout/Dropdown";
import { Button } from "../Components/Layout/Button";

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

// Custom Event badge component
const StatusBadge = ({ event }) => {
  if (event.status) {
    // Booking event
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
        {event.raw && event.raw.guestName ? ` - ${event.raw.guestName}` : ''}
        {event.raw && event.raw.guestEmail ? ` (${event.raw.guestEmail})` : ''}
      </span>
    );
  }
  // Available/reserved date event
  return (
    <span
      className={
        event.isBooked
          ? 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-marriageHotPink text-white border-2 border-marriageHotPink shadow'
        : 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border-2 border-amber-400 shadow'
    }
    style={{ pointerEvents: 'none' }}
  >
    {event.title}
  </span>
);
};

export const MyBookings = () => {
  const dispatch = useDispatch();
  const { halls, loading, hallCalendarEvents, hallCalendarLoading, hallCalendarError } = useSelector((state) => state.halls);
  const user = JSON.parse(localStorage.getItem('user'));

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHall, setSelectedHall] = useState(null);
  const [reservedStatus, setReservedStatus] = useState('not_reserved');
  const [saveLoading, setSaveLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    if (user?.role === 'manager') {
      dispatch(fetchManagerHalls());
    } else {
    dispatch(fetchHalls());
    }
  }, [dispatch, user?.role]);

  useEffect(() => {
    if (!halls || halls.length === 0) return;
    halls.forEach((hall) => {
      dispatch(fetchHallCalendarData(hall._id));
    });
  }, [halls, dispatch]);

  const handleDateClick = (slotInfo, hall) => {
    setSelectedDate(slotInfo.start);
    setSelectedHall(hall);
    // Check if this date is already reserved in hallCalendarEvents
    const event = (hallCalendarEvents[hall._id] || []).find(ev =>
      ev.start.toDateString() === slotInfo.start.toDateString()
    );
    setReservedStatus(event && event.isBooked ? 'reserved' : 'not_reserved');
    setModalOpen(true);
  };

  // Custom event style getter for coloring badges
  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.isBooked ? '#ffffff' : '#ffffff', // marriageHotPink or amber-400
        color: event.isBooked ? 'white' : '#b45309', // white for reserved, dark amber for available
        borderRadius: '8px',
        border: event.isBooked ? '2px solid #ffffff' : '2px solid #ffffff',
        fontWeight: 'bold',
        fontSize: '0.95rem',
        padding: '2px 8px',
      },
    };
  };

  // Custom dayPropGetter to color the date box background for reserved dates
  const dayPropGetter = (date, selected) => {
    // Check if this date is reserved for the current hall
    if (!selectedHall) return {};
    const events = hallCalendarEvents[selectedHall._id] || [];
    const isReserved = events.some(ev => ev.isBooked && ev.start.toDateString() === date.toDateString());
    return {};
  };

  // You may want to refetch after save, but keep the save logic as is for now
  const handleSave = async () => {
    if (!selectedHall || !selectedDate) return;
    setSaveLoading(true);
    setModalError("");
    const hallId = selectedHall._id;
    const dateStr = selectedDate.toISOString();
    const event = (hallCalendarEvents[hallId] || []).find(ev =>
      ev.start.toDateString() === selectedDate.toDateString()
    );
    try {
      if (!event) {
        await dispatch(addAvailableDate({ hallId, date: dateStr, isBooked: reservedStatus === 'reserved' })).unwrap();
      } else {
        await dispatch(updateAvailableDate({ dateId: event.id, isBooked: reservedStatus === 'reserved' })).unwrap();
      }
      dispatch(fetchHallCalendarData(hallId));
      setModalOpen(false);
    } catch (err) {
      setModalError(err.message || 'Error saving date');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <OwnerLayout>
      <div className="ml-[15%] p-6">
        <h2 className="text-4xl text-marriageHot font-bold text-gray-800 font-mono mb-8">My Bookings</h2>
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : halls.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
            You have no halls. Add a hall to see bookings.
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {halls.map((hall) => {
              const events = hallCalendarEvents[hall._id] || [];
              console.log('Calendar events for hall', hall.name, events);
              return (
              <div key={hall._id} className="bg-white rounded-xl shadow p-6">
                <h3 className="text-2xl font-semibold mb-4 text-marriageHotPink flex items-center gap-4">
                  {hall.name} - Bookings Calendar
                </h3>
            
                {hallCalendarLoading[hall._id] ? (
                  <div className="text-center text-gray-400">Loading calendar...</div>
                ) : (
                  <Calendar
                    localizer={localizer}
                      events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 400 }}
                    selectable
                    onSelectSlot={(slotInfo) => handleDateClick(slotInfo, hall)}
                    eventPropGetter={eventStyleGetter}
                    dayPropGetter={(date) => dayPropGetter(date, hall)}
                    components={{ event: StatusBadge }}
                  />
                )}
              </div>
              );
            })}
          </div>
        )}
        {/* Modal for date selection */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 text-marriageRed text-2xl font-bold hover:text-marriageHotPink"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-6 text-marriageHotPink">{selectedHall?.name} - {selectedDate && selectedDate.toLocaleDateString()}</h2>
              <div className="mb-6">
                <Dropdown
                  label="Reservation Status"
                  options={[
                    { value: 'reserved', label: 'Reserved' },
                    { value: 'not_reserved', label: 'Not Reserved' },
                  ]}
                  value={reservedStatus}
                  onChange={e => setReservedStatus(e.target.value)}
                  name="reservationStatus"
                />
                {modalError && <div className="text-marriageRed mt-2 text-sm">{modalError}</div>}
              </div>
              <Button
                btnText={saveLoading ? "Saving..." : "Save"}
                btnColor="marriageHotPink"
                padding="w-full py-3"
                onClick={handleSave}
                disabled={saveLoading}
              />
            </div>
          </div>
        )}
      </div>
    </OwnerLayout>
  );
};
