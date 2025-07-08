import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiMapPin, FiUsers, FiDollarSign, FiCheckCircle, FiPhone, FiShoppingCart, FiX, FiArrowRight, FiCalendar, FiClock } from "react-icons/fi";

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
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiList = ["😀", "😂", "😍", "👍", "🙏", "🎉", "🥳", "😎", "😢", "❤️", "🔥", "👏", "🤔", "😃", "😇", "😜"];
  const supportPhone = hall?.phone || "(041) 111 133 133";
  const [bookingStep, setBookingStep] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

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

  if (loading) return <div className="text-center text-gray-400 py-10">Loading...</div>;
  if (error) return <div className="text-center text-marriageRed py-10">{error}</div>;
  if (!hall) return <div className="text-center text-gray-400 py-10">Hall not found.</div>;

  return (
    <div className="min-h-screen bg-white font-sans px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
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
          <div className="fixed inset-0 z-50 pointer-events-none">
            <div className="absolute bottom-20 right-3 w-80 pointer-events-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-0 relative border-2 border-marriagePink flex flex-col h-[32rem]">
                <button
                  onClick={() => { setShowSupportModal(false); setShowChatbot(false); }}
                  className="absolute top-4 right-4 text-marriageRed text-2xl font-bold hover:text-marriageHotPink z-10"
                >
                  &times;
                </button>
                <div className="bg-marriageHotPink rounded-t-2xl px-6 py-4 flex items-center gap-2">
                  <span className="text-white text-2xl">💬</span>
                  <h2 className="text-xl font-extrabold text-white font-serif flex-1">Event Support</h2>
                </div>
                <div className="flex-1 flex flex-col gap-4 p-4">
                  {!showChatbot ? (
                    <>
                      <button
                        className="w-full py-3 rounded bg-marriageHotPink text-white font-bold hover:bg-marriageRed transition"
                        onClick={() => setShowChatbot(true)}
                      >
                        Chat with Support
                      </button>
                      <a
                        href={`tel:${supportPhone}`}
                        className="w-full py-3 rounded bg-marriagePink text-marriageHotPink font-bold text-center border border-marriageHotPink hover:bg-marriageHotPink hover:text-white transition"
                      >
                        Call Support ({supportPhone})
                      </a>
                    </>
                  ) : (
                    <div className="flex flex-col h-full">
                      <div className="flex-1 overflow-y-auto bg-gray-50 rounded p-2 mb-2 custom-scrollbar">
                        {chatMessages.length === 0 ? (
                          <div className="text-gray-400 text-center mt-8">No messages yet. Start the conversation!</div>
                        ) : (
                          chatMessages.map((msg, idx) => (
                            <div key={idx} className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow ${msg.sender === 'user' ? 'bg-marriageHotPink text-white rounded-br-none' : 'bg-marriagePink text-marriageHotPink rounded-bl-none'} whitespace-pre-line break-words`}>
                                {msg.text}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <form
                        className="flex gap-2 items-end mt-auto"
                        onSubmit={e => {
                          e.preventDefault();
                          if (!chatInput.trim()) return;
                          setChatMessages([...chatMessages, { sender: 'user', text: chatInput }]);
                          setChatInput("");
                          setShowEmojiPicker(false);
                          setTimeout(() => {
                            setChatMessages(msgs => [...msgs, { sender: 'owner', text: 'Thank you for your message! The hall owner will reply soon.' }]);
                          }, 1000);
                        }}
                      >
                        <div className="relative flex items-center w-full">
                          <button
                            type="button"
                            className="text-2xl py-1 rounded hover:bg-marriagePink/30"
                            onClick={() => setShowEmojiPicker(v => !v)}
                            tabIndex={-1}
                          >
                            😊
                          </button>
                          <input
                            className="flex-1 px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-marriageHotPink focus:outline-none mx-2"
                            placeholder="Type your message..."
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                          />
                          <button
                            type="submit"
                            className="px-2 py-3 rounded bg-marriageHotPink text-white font-bold hover:bg-marriageRed transition"
                          >
                            <FiArrowRight/>
                          </button>
                          {showEmojiPicker && (
                            <div
                              className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg p-2 flex flex-wrap gap-1 z-20 max-w-[250px] w-max"
                              style={{ maxHeight: 180, overflowY: 'auto' }}
                            >
                              {emojiList.map((emoji, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  className="text-xl p-1 hover:bg-marriagePink/20 rounded"
                                  onClick={() => {
                                    setChatInput(chatInput + emoji);
                                    setShowEmojiPicker(false);
                                  }}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </form>
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