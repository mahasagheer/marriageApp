import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { FiMapPin, FiUsers, FiDollarSign, FiCheckCircle, FiPhone, FiShoppingCart, FiX, FiArrowRight, FiCalendar, FiClock } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, sendMessage as sendMessageThunk, addMessage, markMessagesRead } from '../slice/chatSlice';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const PublicHallDetail = () => {
  const { id } = useParams();
  const [hall, setHall] = useState(null);
  const [menus, setMenus] = useState([]);
  const [decorations, setDecorations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState({ open: false, src: null });
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [selectedMenuAddOns, setSelectedMenuAddOns] = useState([]);
  const [selectedDecorationAddOns, setSelectedDecorationAddOns] = useState({});
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingStatus, setBookingStatus] = useState(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiList = ["😀", "😂", "😍", "👍", "🙏", "🎉", "🥳", "😎", "😢", "❤️", "🔥", "👏", "🤔", "😃", "😇", "😜"];
  const supportPhone = hall?.phone || "(041) 111 133 133";
  const [bookingStep, setBookingStep] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const dispatch = useDispatch();
  const chatState = useSelector(state => state.chat);
  const [socket, setSocket] = useState(null);
  const [bookingId, setBookingId] = useState(null); // Set this to the booking id if available
  const [guestId, setGuestId] = useState(() => {
    let id = localStorage.getItem('guestId');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('guestId', id);
    }
    return id;
  });
  // Replace bookingId state with chatSessionId logic
  const [chatSessionId, setChatSessionId] = useState(() => {
    let id = localStorage.getItem('chatSessionId');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('chatSessionId', id);
    }
    return id;
  });
  const messagesEndRef = useRef(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', date: '', time: '', menu: '', notes: '' });
  const bookingFormQuestions = [
    { key: 'name', label: "What's your full name?", type: 'text' },
    { key: 'email', label: "What's your email address?", type: 'email' },
    { key: 'phone', label: "What's your phone number?", type: 'tel' },
    { key: 'date', label: "What date do you want to book?", type: 'date' },
    { key: 'time', label: "What time?", type: 'time' },
    { key: 'menu', label: "Which menu package would you like?", type: 'text' },
    { key: 'notes', label: "Any special notes or requests?", type: 'text', optional: true },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/halls/public/${id}`);
        if (!res.ok) throw new Error("Failed to fetch hall details");
        const data = await res.json();
        setHall(data.hall);
        setMenus(data.menus);
        setDecorations(data.decorations);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Helper to get selected menu object
  const selectedMenu = menus.find((m) => m._id === selectedMenuId);
  const selectedMenuBasePrice = selectedMenu ? (selectedMenu.basePrice || selectedMenu.price || 0) : 0;
  const selectedMenuAddOnsPrice = selectedMenu && selectedMenu.addOns ?
    selectedMenu.addOns.filter((addOn) => selectedMenuAddOns.includes(addOn.name)).reduce((sum, addOn) => sum + (addOn.price || 0), 0) : 0;
  const selectedDecorationAddOnsPrice = Object.entries(selectedDecorationAddOns).reduce((sum, [decId, addOnNames]) => {
    const decoration = decorations.find((d) => d._id === decId);
    if (!decoration || !decoration.addOns) return sum;
    return sum + decoration.addOns.filter((addOn) => addOnNames.includes(addOn.name)).reduce((s, addOn) => s + (addOn.price || 0), 0);
  }, 0);
  const totalPrice = selectedMenuBasePrice + selectedMenuAddOnsPrice + selectedDecorationAddOnsPrice;

  // Socket.io setup
  useEffect(() => {
    if (!showChatbot || !hall) return;
    const s = io('http://localhost:5000');
    setSocket(s);
    // Join room (use hallId and bookingId if available)
    s.emit('joinRoom', { hallId: hall._id, bookingId: bookingId || chatSessionId });
    s.on('receiveMessage', (msg) => {
      console.log('Received message:', msg); // Debug log
      if (msg.type === 'requestBookingDetails') {
        dispatch(addMessage(msg));
        setTimeout(() => {
          setShowBookingForm(true);
          setFormStep(0);
          setFormData({ name: '', email: '', phone: '', date: '', time: '', menu: '', notes: '' });
        }, 500);
      } else {
        dispatch(addMessage(msg));
      }
    });
    return () => s.disconnect();
  }, [showChatbot, hall, bookingId, chatSessionId, dispatch]);

  // Fetch messages when chat opens
  useEffect(() => {
    if (showChatbot && (bookingId || chatSessionId)) {
      dispatch(fetchMessages(bookingId || chatSessionId));
      dispatch(markMessagesRead({ bookingId: bookingId || chatSessionId, reader: 'client' }));
    }
  }, [showChatbot, bookingId, chatSessionId, dispatch]);

  // After chatState.messages changes, scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatState.messages]);

  if (loading) return <div className="text-center text-gray-400 py-10">Loading...</div>;
  if (error) return <div className="text-center text-marriageRed py-10">{error}</div>;
  if (!hall) return <div className="text-center text-gray-400 py-10">Hall not found.</div>;

  return (
    <div className="min-h-screen bg-white font-sans px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Hall Details */}
        <div className="bg-white rounded-xl shadow p-6">
          {/* Image Gallery */}
          {hall.images && hall.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {hall.images.slice(0, 6).map((img, idx) => (
                <img
                  key={idx}
                  src={`http://localhost:5000/${img.replace(/\\/g, '/').replace(/^uploads\//, 'uploads/')}`}
                  alt="hall"
                  className="w-full h-40 object-cover rounded-lg border cursor-pointer hover:shadow-lg transition"
                  onClick={() => setImagePreview({ open: true, src: `http://localhost:5000/${img.replace(/\\/g, '/').replace(/^uploads\//, 'uploads/')}` })}
                />
              ))}
            </div>
          )}
          {/* Image Preview Modal */}
          {imagePreview.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
              <div className="relative max-w-3xl w-full flex flex-col items-center">
                <button
                  onClick={() => setImagePreview({ open: false, src: null })}
                  className="absolute top-2 right-2 text-marriageRed text-3xl font-bold hover:text-marriageHotPink z-10"
                >
                  &times;
                </button>
                <img
                  src={imagePreview.src}
                  alt="Preview"
                  className="max-h-[80vh] w-auto rounded-xl shadow-lg border"
                />
              </div>
            </div>
          )}
          {/* Hall Title & Location */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <div>
              <h2 className="text-3xl font-bold text-marriageHotPink mb-1 font-mono">{hall.name}</h2>
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <FiMapPin className="mr-1" /> {hall.location}
              </div>
              {hall.phone && (
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <FiPhone className="mr-1" />
                  <span>{hall.phone}</span>
                  <button
                    onClick={() => window.open(`tel:${hall.phone}`)}
                    className="ml-2 text-marriageHotPink hover:text-marriageHotPink/80 font-semibold"
                  >
                    Call Now
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2 bg-marriagePink/10 px-4 py-2 rounded-lg">
                <FiUsers className="text-marriageHotPink" />
                <span className="font-semibold text-gray-700">{hall.capacity} Guests</span>
              </div>
              <div className="flex items-center gap-2 bg-marriagePink/10 px-4 py-2 rounded-lg">
                <FiDollarSign className="text-marriageHotPink" />
                <span className="font-semibold text-gray-700">{hall.price} PKR</span>
              </div>
             {/* Cart button after hall price section */}

              <button
              className="flex items-center gap-2 px-6 py-3 rounded bg-marriageHotPink text-white font-bold hover:bg-marriageRed transition shadow"
              title="View Cart"
              onClick={() => setShowCartDrawer(true)}
            >
              <FiShoppingCart className="text-2xl" />
              View Cart
            </button>
            </div>
          </div>
          {/* Description */}
          <div className="text-gray-700 mb-6 text-lg">
            {hall.description}
          </div>
          {/* Facilities Section */}
          {hall.facilities && hall.facilities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Facilities</h3>
              <div className="flex flex-wrap gap-2">
                {hall.facilities.map((facility, idx) => (
                  <span key={idx} className="inline-flex items-center gap-2 bg-marriagePink/10 text-marriageHotPink px-4 py-2 rounded-full text-sm font-semibold">
                    <FiCheckCircle className="text-green-500" /> {facility}
                  </span>
                ))}
              </div>
            </div>
          )}         
        </div>
        {/* Menu Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-2xl font-bold flex items-center gap-2 text-marriageHotPink mb-4">
            <FiUsers className="text-marriageHotPink" /> Menu Packages
          </h3>
          {menus.length === 0 ? (
            <div className="text-gray-400">No menu packages available.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menus.map((menu) => (
                <div key={menu._id} className={`bg-marriagePink/10 rounded-lg p-4 shadow ${selectedMenuId === menu._id ? 'ring-2 ring-marriageHotPink' : ''}`}> 
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-marriageHotPink">{menu.name}</h4>
                    <button
                      className={`px-3 py-1 rounded ${selectedMenuId === menu._id ? 'bg-marriageHotPink text-white' : 'bg-white text-marriageHotPink border border-marriageHotPink'}`}
                      onClick={() => {
                        setSelectedMenuId(menu._id);
                        setSelectedMenuAddOns([]);
                      }}
                    >
                      {selectedMenuId === menu._id ? 'Selected' : 'Select'}
                    </button>
                  </div>
                  <div className="text-gray-700 mb-2">{menu.description}</div>
                  <div className="text-gray-800 font-semibold mb-2">Price: {menu.basePrice || menu.price} PKR</div>
                  {menu.items && menu.items.length > 0 && (
                    <div className="mb-2">
                      <div className="font-semibold text-marriageHotPink">Menu Items:</div>
                      <ul className="list-disc pl-5 text-gray-700">
                        {menu.items.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {menu.addOns && menu.addOns.length > 0 && selectedMenuId === menu._id && (
                    <div className="mb-2">
                      <div className="font-semibold text-marriageHotPink">Add-Ons:</div>
                      <ul className="list-disc pl-5 text-gray-700">
                        {menu.addOns.map((addOn, idx) => (
                          <li key={idx}>
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedMenuAddOns.includes(addOn.name)}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setSelectedMenuAddOns([...selectedMenuAddOns, addOn.name]);
                                  } else {
                                    setSelectedMenuAddOns(selectedMenuAddOns.filter(n => n !== addOn.name));
                                  }
                                }}
                              />
                              {addOn.name} (+{addOn.price} PKR)
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Decoration Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-2xl font-bold flex items-center gap-2 text-marriageHotPink mb-4">
            <FiUsers className="text-marriageHotPink" /> Decoration Packages
          </h3>
          {decorations.length === 0 ? (
            <div className="text-gray-400">No decoration packages available.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {decorations.map((decoration) => (
                <div key={decoration._id} className="bg-marriagePink/10 rounded-lg p-4 shadow">
                  <h4 className="text-lg font-bold text-marriageHotPink mb-2">{decoration.name}</h4>
                  <div className="text-gray-700 mb-2">{decoration.description}</div>
                  <div className="text-gray-800 font-semibold mb-2">Price: {decoration.price} PKR</div>
                  {decoration.addOns && decoration.addOns.length > 0 && (
                    <div className="mb-2">
                      <div className="font-semibold text-marriageHotPink">Add-Ons:</div>
                      <ul className="list-disc pl-5 text-gray-700">
                        {decoration.addOns.map((addOn, idx) => (
                          <li key={idx}>
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedDecorationAddOns[decoration._id]?.includes(addOn.name) || false}
                                onChange={e => {
                                  setSelectedDecorationAddOns(prev => {
                                    const current = prev[decoration._id] || [];
                                    if (e.target.checked) {
                                      return { ...prev, [decoration._id]: [...current, addOn.name] };
                                    } else {
                                      return { ...prev, [decoration._id]: current.filter(n => n !== addOn.name) };
                                    }
                                  });
                                }}
                              />
                              {addOn.name} (+{addOn.price} PKR)
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Floating Chatbot Button */}
        <button
          className="fixed bottom-3 right-3 z-50 bg-marriageHotPink text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl hover:bg-marriageRed transition"
          title="Contact Event Support"
          onClick={() => setShowSupportModal(true)}
        >
          💬
        </button>
        {/* Support Popover (bottom right, above chatbot button) */}
        {showSupportModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-end pointer-events-none">
            <div className="absolute bottom-20 right-3 w-full max-w-sm md:max-w-md pointer-events-auto animate-fadeInUp">
              <div className="bg-white rounded-3xl shadow-2xl border-2 border-marriagePink flex flex-col h-[36rem] overflow-hidden relative">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-marriageHotPink px-6 py-4 flex items-center gap-3 shadow-md">
                  <span className="text-white text-2xl bg-white/20 rounded-full p-2"><FiUsers /></span>
                  <div className="flex-1">
                    <h2 className="text-lg md:text-xl font-extrabold text-white font-serif">Event Support</h2>
                    <div className="text-xs text-white/80">Ask us anything about this hall!</div>
                  </div>
                  <button
                    onClick={() => { setShowSupportModal(false); setShowChatbot(false); }}
                    className="text-white text-2xl font-bold hover:text-marriageRed transition-colors ml-2"
                    aria-label="Close chat"
                  >
                    <FiX />
                  </button>
                </div>
                {/* Chat Body */}
                <div className="flex-1 flex flex-col gap-2 px-3 py-2 bg-gradient-to-br from-white via-marriagePink/10 to-marriagePink/5 overflow-y-auto custom-scrollbar" style={{scrollbarColor:'#f472b6 #fff', scrollbarWidth:'thin'}}>
                  {!showChatbot ? (
                    <div className="flex flex-col gap-4 justify-center items-center h-full">
                      <button
                        className="w-full py-3 rounded-xl bg-marriageHotPink text-white font-bold hover:bg-marriageRed transition text-lg shadow-lg"
                        onClick={() => setShowChatbot(true)}
                      >
                        <span className="inline-flex items-center gap-2"><FiUsers /> Chat with Support</span>
                      </button>
                      <a
                        href={`tel:${supportPhone}`}
                        className="w-full py-3 rounded-xl bg-marriagePink text-marriageHotPink font-bold text-center border-2 border-marriageHotPink hover:bg-marriageHotPink hover:text-white transition text-lg shadow"
                      >
                        <span className="inline-flex items-center gap-2"><FiPhone /> Call Support ({supportPhone})</span>
                      </a>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full w-full">
                      <div className="flex-1 overflow-y-auto pb-2 custom-scrollbar" >
                        {(chatState.messages || []).length === 0 ? (
                          <div className="text-gray-400 text-center mt-8">No messages yet. Start the conversation!</div>
                        ) : (
                          <>
                            {(chatState.messages || []).map((msg, idx) => (
                              <div key={idx} className={`mb-2 flex items-end ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender !== 'client' && (
                                  <div className="flex-shrink-0 mr-2">
                                    <div className="w-8 h-8 rounded-full bg-marriagePink flex items-center justify-center text-marriageHotPink font-bold shadow"><FiUsers /></div>
                                  </div>
                                )}
                                <div className={`relative max-w-[75%] px-4 py-2 rounded-2xl shadow-lg animate-fadeIn ${msg.sender === 'client' ? 'bg-marriageHotPink text-white rounded-br-none' : 'bg-white text-marriageHotPink border border-marriagePink rounded-bl-none'}`}
                                  style={{ transition: 'box-shadow 0.2s' }}
                                >
                                  <div className="whitespace-pre-line break-words text-base">{msg.text}</div>
                                  <div className="text-xs text-right mt-1 opacity-60">
                                    {msg.sender === 'client' ? 'You' : 'Support'}
                                    {msg.createdAt && (
                                      <span className="ml-2">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    )}
                                    {!msg.read && msg.sender !== 'client' && <span className="ml-2 text-marriageRed">● Unread</span>}
                                  </div>
                                </div>
                                {msg.sender === 'client' && (
                                  <div className="flex-shrink-0 ml-2">
                                    <div className="w-8 h-8 rounded-full bg-marriageHotPink flex items-center justify-center text-white font-bold shadow"><FiUsers /></div>
                                  </div>
                                )}
                              </div>
                            ))}
                            {showBookingForm && (
                              <div className="mb-2 flex justify-end animate-fadeIn">
                                <div
                                  className="w-full max-w-[75%] px-4 py-4 rounded-2xl shadow-lg bg-gradient-to-br from-marriageHotPink to-marriagePink text-white rounded-br-none"
                                  style={{ boxSizing: 'border-box', wordBreak: 'break-word' }}
                                >
                                  <form
                                    className="flex flex-col gap-4"
                                    onSubmit={async e => {
                                      e.preventDefault();
                                      if (formStep < bookingFormQuestions.length - 1) {
                                        setFormStep(formStep + 1);
                                      } else {
                                        // Submit booking to backend
                                        const bookingPayload = {
                                          hallId: hall._id,
                                          bookingId: bookingId || chatSessionId,
                                          guestName: formData.name,
                                          guestEmail: formData.email,
                                          guestPhone: formData.phone,
                                          selectedAddOns: selectedMenuAddOns || [],
                                          decorationIds: Object.keys(selectedDecorationAddOns),
                                          bookingDate: formData.date,
                                          bookingTime: formData.time,
                                        };
                                        if (selectedMenuId) {
                                          bookingPayload.menuId = selectedMenuId;
                                        }
                                        let bookingSuccess = false;
                                        let bookingError = null;
                                        try {
                                          const res = await fetch('http://localhost:5000/api/halls/confirm-booking-from-chat', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(bookingPayload),
                                          });
                                          const data = await res.json();
                                          if (!res.ok) throw new Error(data.message || 'Booking failed');
                                          bookingSuccess = true;
                                        } catch (err) {
                                          bookingError = err.message;
                                        }
                                        // Send chat message with booking details as before
                                        if (socket) {
                                          socket.emit('sendMessage', {
                                            hallId: hall._id,
                                            bookingId: bookingId || chatSessionId,
                                            sender: 'client',
                                            type: 'bookingDetails',
                                            text: bookingError
                                              ? `❌ Booking failed: ${bookingError}`
                                              : '✅ Booking details submitted! Your booking request has been sent to the hall owner.',
                                            data: formData,
                                          });
                                        }
                                        setShowBookingForm(false);
                                        setFormStep(0);
                                        setFormData({ name: '', email: '', phone: '', date: '', time: '', menu: '', notes: '' });
                                      }
                                    }}
                                  >
                                    <label className="font-bold text-white mb-2">{bookingFormQuestions[formStep].label}</label>
                                    <input
                                      type={bookingFormQuestions[formStep].type}
                                      className="px-3 py-2 rounded-lg border-2 border-white focus:ring-2 focus:ring-white focus:outline-none text-marriageHotPink bg-white/90 shadow"
                                      value={formData[bookingFormQuestions[formStep].key]}
                                      onChange={e => setFormData({ ...formData, [bookingFormQuestions[formStep].key]: e.target.value })}
                                      required={!bookingFormQuestions[formStep].optional}
                                    />
                                    <button className="mt-2 px-4 py-2 rounded-lg bg-white text-marriageHotPink font-bold hover:bg-marriagePink transition shadow" type="submit">
                                      {formStep < bookingFormQuestions.length - 1 ? 'Next' : 'Submit'}
                                    </button>
                                  </form>
                                </div>
                              </div>
                            )}
                            <div ref={messagesEndRef} />
                          </>
                        )}
                      </div>
                      {/* Footer Input */}
                      {!showBookingForm && (
                        <form
                          className="flex gap-2 items-end mt-auto sticky bottom-0 bg-white/80 py-3 px-2 rounded-b-3xl shadow-inner animate-fadeIn"
                          onSubmit={e => {
                            e.preventDefault();
                            if (!chatInput.trim()) return;
                            if (socket) {
                              const msg = {
                                hallId: hall._id,
                                bookingId: bookingId || chatSessionId,
                                sender: 'client',
                                senderEmail: guestEmail || guestId,
                                text: chatInput,
                              };
                              socket.emit('sendMessage', msg);
                            } else {
                              dispatch(sendMessageThunk({ hallId: hall._id, bookingId: bookingId || chatSessionId, sender: 'client', senderEmail: guestEmail || guestId, text: chatInput }));
                            }
                            setChatInput("");
                            setShowEmojiPicker(false);
                          }}
                          aria-label="Send message"
                        >
                          <div className="relative flex items-center w-full">
                            <button
                              type="button"
                              className="text-2xl py-1 rounded hover:bg-marriagePink/30 focus:outline-none focus:ring-2 focus:ring-marriageHotPink"
                              onClick={() => setShowEmojiPicker(v => !v)}
                              tabIndex={-1}
                              aria-label="Pick emoji"
                            >
                              😊
                            </button>
                            <input
                              className="flex-1 px-4 py-2 rounded-full border-2 border-marriagePink focus:ring-2 focus:ring-marriageHotPink focus:outline-none mx-2 bg-white text-marriageHotPink shadow"
                              placeholder="Type your message..."
                              value={chatInput}
                              onChange={e => setChatInput(e.target.value)}
                              aria-label="Message input"
                            />
                            <button
                              type="submit"
                              className="px-4 py-2 rounded-full bg-marriageHotPink text-white font-bold hover:bg-marriageRed transition shadow text-lg"
                              aria-label="Send"
                            >
                              <FiArrowRight/>
                            </button>
                            {showEmojiPicker && (
                              <div
                                className="absolute bottom-full left-0 mb-2 bg-white border-2 border-marriagePink rounded-2xl shadow-lg p-2 flex flex-wrap gap-1 z-20 max-w-[250px] w-max animate-fadeIn"
                                style={{ maxHeight: 180, overflowY: 'auto' }}
                              >
                                {emojiList.map((emoji, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    className="text-xl p-1 hover:bg-marriagePink/20 rounded focus:outline-none"
                                    onClick={() => {
                                      setChatInput(chatInput + emoji);
                                      setShowEmojiPicker(false);
                                    }}
                                    aria-label={`Add emoji ${emoji}`}
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Cart Drawer */}
        {showCartDrawer && (
          <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black bg-opacity-40" onClick={() => setShowCartDrawer(false)} />
            <div className="w-full max-w-md bg-white h-full shadow-2xl p-8 relative flex flex-col">
              <button
                onClick={() => setShowCartDrawer(false)}
                className="absolute top-4 right-4 text-marriageRed text-2xl font-bold hover:text-marriageHotPink"
              >
                <FiX />
              </button>
              <h2 className="text-2xl font-extrabold text-marriageRed mb-4 font-serif">Book This Hall</h2>
              <div className="flex-1 overflow-y-auto">
                {/* Stepper */}
                <div className="flex justify-between mb-6">
                  {[1,2,3,4].map(step => (
                    <div key={step} className={`flex-1 text-center font-bold py-2 rounded ${bookingStep === step ? 'bg-marriageHotPink text-white' : 'bg-marriagePink/20 text-marriageHotPink'}`}>{step}</div>
                  ))}
                </div>
                {/* Step 1: Date/Time */}
                {bookingStep === 1 && (
                  <>
                    <div className="mb-4">
                      <label className="font-bold mb-2 text-marriageHotPink flex items-center gap-1" htmlFor="booking-date">
                        <FiCalendar className="inline-block text-xl" /> Date
                      </label>
                      <div className="relative">
                        <input
                          id="booking-date"
                          type="date"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-marriageHotPink focus:outline-none bg-white text-gray-700 shadow-sm transition-all hover:border-marriageHotPink"
                          value={bookingDate}
                          onChange={e => setBookingDate(e.target.value)}
                        />
                        <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-marriagePink pointer-events-none" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="font-bold mb-2 text-marriageHotPink flex items-center gap-1" htmlFor="booking-time">
                        <FiClock className="inline-block text-xl" /> Time
                      </label>
                      <div className="relative">
                        <input
                          id="booking-time"
                          type="time"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-marriageHotPink focus:outline-none bg-white text-gray-700 shadow-sm transition-all hover:border-marriageHotPink"
                          value={bookingTime}
                          onChange={e => setBookingTime(e.target.value)}
                          step="3600"
                        />
                        <FiClock className="absolute right-3 top-1/2 -translate-y-1/2 text-marriagePink pointer-events-none" />
                      </div>
                    </div>
                    <button className="w-full py-3 rounded bg-marriageHotPink text-white font-bold hover:bg-marriageRed transition mt-4" onClick={() => bookingDate && bookingTime && setBookingStep(2)} disabled={!bookingDate || !bookingTime}>Next</button>
                  </>
                )}
                {/* Step 2: Menu/Decorations */}
                {bookingStep === 2 && (
                  <>
                    <div className="mb-4">
                      <span className="font-semibold">Menu:</span> {selectedMenu ? selectedMenu.name : 'None selected'}
                    </div>
                    {selectedMenu && (
                      <div className="mb-4">
                        <span className="font-semibold">Menu Add-Ons:</span> {selectedMenuAddOns.length > 0 ? selectedMenuAddOns.join(', ') : 'None'}
                      </div>
                    )}
                    <div className="mb-4">
                      <span className="font-semibold">Decoration Add-Ons:</span> {
                        Object.entries(selectedDecorationAddOns).flatMap(([decId, addOns]) =>
                          addOns.map(name => {
                            const dec = decorations.find(d => d._id === decId);
                            return dec ? `${dec.name}: ${name}` : null;
                          })
                        ).filter(Boolean).join(', ') || 'None'}
                    </div>
                    <div className="text-lg font-bold text-marriageHotPink mt-2">Total Price: {totalPrice} PKR</div>
                    <button className="w-full py-3 rounded bg-marriageHotPink text-white font-bold hover:bg-marriageRed transition mt-4" onClick={() => setBookingStep(3)}>Next</button>
                    <button className="w-full py-3 rounded bg-gray-200 text-marriageHotPink font-bold hover:bg-gray-300 transition mt-2" onClick={() => setBookingStep(1)}>Back</button>
                  </>
                )}
                {/* Step 3: Guest Info */}
                {bookingStep === 3 && (
                  <>
                    <div className="mb-4">
                      <label className="font-bold mb-2 text-marriageHotPink" htmlFor="guest-name">Your Name</label>
                      <input id="guest-name" type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-marriageHotPink focus:outline-none bg-white text-gray-700 shadow-sm" value={guestName} onChange={e => setGuestName(e.target.value)} />
                    </div>
                    <div className="mb-4">
                      <label className="font-bold mb-2 text-marriageHotPink" htmlFor="guest-email">Email</label>
                      <input id="guest-email" type="email" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-marriageHotPink focus:outline-none bg-white text-gray-700 shadow-sm" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} />
                    </div>
                    <div className="mb-4">
                      <label className="font-bold mb-2 text-marriageHotPink" htmlFor="guest-phone">Phone Number</label>
                      <input id="guest-phone" type="tel" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-marriageHotPink focus:outline-none bg-white text-gray-700 shadow-sm" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} />
                    </div>
                    <button className="w-full py-3 rounded bg-marriageHotPink text-white font-bold hover:bg-marriageRed transition mt-4" onClick={() => guestName && guestEmail && guestPhone && setBookingStep(4)} disabled={!guestName || !guestEmail || !guestPhone}>Next</button>
                    <button className="w-full py-3 rounded bg-gray-200 text-marriageHotPink font-bold hover:bg-gray-300 transition mt-2" onClick={() => setBookingStep(2)}>Back</button>
                  </>
                )}
                {/* Step 4: Review & Confirm */}
                {bookingStep === 4 && (
                  <>
                    <div className="mb-4">
                      <span className="font-semibold">Date:</span> {bookingDate}
                    </div>
                    <div className="mb-4">
                      <span className="font-semibold">Time:</span> {bookingTime ? (() => { const [h, m] = bookingTime.split(":"); let hour = parseInt(h, 10); const ampm = hour >= 12 ? "PM" : "AM"; hour = hour % 12 || 12; return `${hour} ${ampm}`; })() : 'Not selected'}
                    </div>
                <div className="mb-4">
                  <span className="font-semibold">Menu:</span> {selectedMenu ? selectedMenu.name : 'None selected'}
                </div>
                {selectedMenu && (
                  <div className="mb-4">
                    <span className="font-semibold">Menu Add-Ons:</span> {selectedMenuAddOns.length > 0 ? selectedMenuAddOns.join(', ') : 'None'}
                  </div>
                )}
                <div className="mb-4">
                  <span className="font-semibold">Decoration Add-Ons:</span> {
                    Object.entries(selectedDecorationAddOns).flatMap(([decId, addOns]) =>
                      addOns.map(name => {
                        const dec = decorations.find(d => d._id === decId);
                        return dec ? `${dec.name}: ${name}` : null;
                      })
                    ).filter(Boolean).join(', ') || 'None'}
                </div>
                <div className="mb-4">
                      <span className="font-semibold">Your Name:</span> {guestName}
                    </div>
                    <div className="mb-4">
                      <span className="font-semibold">Email:</span> {guestEmail}
                    </div>
                    <div className="mb-4">
                      <span className="font-semibold">Phone:</span> {guestPhone}
                </div>
                <div className="text-lg font-bold text-marriageHotPink mt-2">Total Price: {totalPrice} PKR</div>
                <button
                  className="mt-6 px-6 py-3 rounded bg-marriageHotPink text-white font-bold hover:bg-marriageRed transition w-full"
                  onClick={async () => {
                    setBookingStatus(null);
                    try {
                      const res = await fetch('http://localhost:5000/api/sample/public-booking', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          hallId: hall._id,
                              bookingDate: bookingDate + (bookingTime ? ('T' + bookingTime) : ''),
                          menuId: selectedMenuId,
                          selectedAddOns: selectedMenuAddOns,
                          decorationIds: Object.keys(selectedDecorationAddOns),
                              guestName,
                              guestEmail,
                              guestPhone,
                        }),
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.message || 'Booking failed');
                      setBookingStatus({ success: 'Booking successful! We will contact you soon.' });
                    } catch (err) {
                      setBookingStatus({ error: err.message });
                    }
                  }}
                      disabled={!bookingDate || !bookingTime || !selectedMenuId || !guestName || !guestEmail || !guestPhone}
                >
                      Confirm Booking
                </button>
                    <button className="w-full py-3 rounded bg-gray-200 text-marriageHotPink font-bold hover:bg-gray-300 transition mt-2" onClick={() => setBookingStep(3)}>Back</button>
                {bookingStatus && bookingStatus.success && (
                  <div className="mt-4 text-green-600 font-semibold">{bookingStatus.success}</div>
                )}
                {bookingStatus && bookingStatus.error && (
                  <div className="mt-4 text-marriageRed font-semibold">{bookingStatus.error}</div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicHallDetail; 