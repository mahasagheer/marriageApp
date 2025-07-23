import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatSessions, fetchMessages, sendMessageThunk, addMessage, markMessagesRead } from '../slice/chatSlice';
import { getSocket, disconnectSocket } from '../socket';
import { FiFileText } from 'react-icons/fi';

const OwnerChat = ({ hallId, booking, isAdmin, disableSend }) => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState(null);
  const [confirmSuccess, setConfirmSuccess] = useState(null);
  const [requestingDetails, setRequestingDetails] = useState(false);
  const dispatch = useDispatch();
  const chatState = useSelector(state => state.chat);
  const sessions = useSelector(state => state.chat.sessions);
  const sessionsLoading = useSelector(state => state.chat.sessionsLoading);
  const sessionsError = useSelector(state => state.chat.sessionsError);
  const ownerEmail = localStorage.getItem('ownerEmail'); // or get from Redux/auth
  const messagesEndRef = useRef(null);

  // Fetch all unique chat sessions for this hall using Redux
  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchChatSessions()); // fetch all sessions for admin
    } else if (hallId) {
      dispatch(fetchChatSessions(hallId));
    }
  }, [dispatch, hallId, isAdmin]);

  // Select session based on booking or default to most recent
  useEffect(() => {
    if (sessions && sessions.length > 0) {
      if (booking) {
        let match = null;
        if (booking.guestEmail) {
          match = sessions.find(s => s.guestEmail === booking.guestEmail);
        } else if (booking.guestName) {
          match = sessions.find(s => s.guestName === booking.guestName);
        } else if (booking.guestId) {
          match = sessions.find(s => s.guestId === booking.guestId);
        }
        if (match) {
          setSelectedSession(match);
        } else {
          setSelectedSession(null);
        }
      } else {
        setSelectedSession(sessions[0]);
      }
    } else {
      setSelectedSession(null);
    }
  }, [sessions, booking]);

  // Socket.io setup
  useEffect(() => {
    if (!selectedSession) return;
    const s = getSocket();
    setSocket(s);
    s.emit('joinRoom', { hallId, bookingId: selectedSession.bookingId });
    s.on('receiveMessage', (msg) => {
      dispatch(addMessage(msg));
    });
    return () => {
      s.off('receiveMessage');
      // Optionally: disconnectSocket();
    };
  }, [selectedSession, hallId, dispatch]);

  // Fetch messages when session is selected
  useEffect(() => {
    if (selectedSession) {
      dispatch(fetchMessages(selectedSession.bookingId));
      dispatch(markMessagesRead({ bookingId: selectedSession.bookingId, reader: 'owner' }));
    }
  }, [selectedSession, dispatch]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatState.messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedSession) return;
    if (socket) {
      const msg = {
        hallId,
        bookingId: selectedSession.bookingId,
        sender: 'owner',
        senderEmail: ownerEmail,
        text: chatInput,
      };
      socket.emit('sendMessage', msg);
    } else {
      dispatch(sendMessageThunk({ hallId, bookingId: selectedSession.bookingId, sender: 'owner', senderEmail: ownerEmail, text: chatInput }));
    }
    setChatInput('');
  };

  return (
    <div className="p-0 md:p-4 w-full h-full flex flex-col md:flex-row gap-0 md:gap-6 ">
      {/* Sidebar: Chat Sessions */}
      <div className="w-full md:w-1/3 bg-white rounded-l-3xl shadow h-full flex flex-col animate-fadeInUp">
        <div className="px-6 py-4 border-b border-marriagePink/30">
          <h2 className="text-xl font-bold text-marriageHotPink">Chats</h2>
        </div>
        {/* Sidebar: Remove avatars, just show name and time */}
        <ul className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-marriagePink/10">
          {sessionsLoading ? (
              <div className="loader"></div>
            ) : sessionsError ? (
            <li className="px-6 py-4 text-marriageRed">{sessionsError}</li>
          ) : sessions.length === 0 ? (
            <li className="px-6 py-4 text-gray-400">No chat sessions found.</li>
          ) : (
            sessions.map(s => (
              <li
                key={s.bookingId}
                className={`px-6 py-4 cursor-pointer hover:bg-marriagePink/10 transition ${selectedSession && selectedSession.bookingId === s.bookingId ? 'bg-marriagePink/20' : ''}`}
                onClick={() => setSelectedSession(s)}
              >
                <div className="font-bold truncate text-marriageHotPink">{s.guestName || s.guestEmail || s.guestId || 'Anonymous Guest'}</div>
                <div className="text-xs text-gray-500 truncate">{s.lastMessage ? new Date(s.lastMessage.createdAt).toLocaleString() : ''}</div>
              </li>
            ))
          )}
        </ul>
      </div>
      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-r-3xl shadow h-full animate-fadeInUp">
        {/* Chat Header: marriageHotPink background, white text, guest name and session ID, icon right */}
        <div className="px-6 py-4 border-b border-marriagePink/30 flex items-center gap-3 sticky top-0 z-10 bg-marriageHotPink rounded-tr-3xl">
          {selectedSession && (
            <>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="font-bold text-white truncate text-lg">{selectedSession.guestName || selectedSession.guestEmail || selectedSession.guestId || 'Anonymous Guest'}</div>
                <div className="text-xs text-white/80 truncate">Session: {selectedSession.bookingId}</div>
              </div>
              <button
                className="ml-auto p-2 rounded-full bg-white text-marriageHotPink hover:bg-marriagePink hover:text-white transition shadow"
                title="Request Booking Details"
                disabled={requestingDetails}
                onClick={() => {
                  setRequestingDetails(true);
                  if (socket) {
                    socket.emit('sendMessage', {
                      hallId,
                      bookingId: selectedSession.bookingId,
                      sender: 'owner',
                      type: 'requestBookingDetails',
                      text: 'Please provide your booking details to proceed.'
                    });
                  }
                  setTimeout(() => setRequestingDetails(false), 1000);
                }}
              >
                <FiFileText className="text-xl" />
              </button>
            </>
          )}
        </div>
        {/* Chat Area: soft gradient background, modern bubbles, no avatars */}
        <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar bg-gradient-to-br from-white via-marriagePink/10 to-marriagePink/5" style={{ minHeight: '16rem', maxHeight: '34rem' }}>
          {fetchError ? (
            <div className="text-red-500 font-bold p-4">{fetchError}</div>
          ) : selectedSession ? (
            chatState.messages.length === 0 ? (
              <div className="text-gray-400 text-center mt-8">No messages yet.</div>
            ) : (
              <>
                {chatState.messages.map((msg, idx) => (
                  <div key={idx} className={`mb-3 flex ${msg.sender === 'owner' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                    <div className={`relative max-w-[75%] px-4 py-2 rounded-2xl shadow-lg ${msg.sender === 'owner' ? 'bg-marriageHotPink text-white rounded-br-none mr-2' : 'bg-white text-marriageHotPink border border-marriagePink rounded-bl-none ml-2'}`}
                      style={{ transition: 'box-shadow 0.2s' }}
                    >
                      <div className="whitespace-pre-line break-words text-base">{msg.text}</div>
                      <div className="text-xs text-right mt-1 opacity-60">
                        {msg.sender === 'owner' ? 'You' : 'Client'}
                        {msg.createdAt && (
                          <span className="ml-2">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        )}
                        {!msg.read && msg.sender !== 'owner' && <span className="ml-2 text-marriageRed">● Unread</span>}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )
          ) : (
            <div className="text-gray-400 flex-1 flex items-center justify-center">Select a chat to view messages</div>
          )}
        </div>
        {/* Chat Input */}
        <form className="flex gap-2 items-end mt-auto px-6 py-4 border-t border-marriagePink/30 bg-white sticky bottom-0 rounded-b-3xl" onSubmit={handleSend}>
          <input
            className="flex-1 px-4 py-2 rounded-full border-2 border-marriagePink focus:ring-2 focus:ring-marriageHotPink focus:outline-none bg-white text-marriageHotPink shadow"
            placeholder={disableSend ? "Sending disabled for this role" : "Type your message..."}
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            disabled={disableSend}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-full bg-marriageHotPink text-white font-bold hover:bg-marriageRed transition shadow text-lg"
            disabled={disableSend}
            title={disableSend ? "Admins and managers cannot send messages from this chat" : "Send"}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default OwnerChat; 