import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiX } from 'react-icons/fi';

import { fetchAgencyById } from '../../slice/agencySlice';
import { fetchSessions } from '../../slice/AgencyChatSlice';
import AgencyChat from './AgencyChat';
import { useAuth } from '../../context/AuthContext';
import AllowedProfiles from '../../Components/Phase_2/AllowedProfilesCard';

const AgencyDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const result = await dispatch(fetchAgencyById(id));
        const agencyData = result.payload?.data;

        if (result.payload?.message?.includes('Profile not found') || !agencyData) {
          setError('Agency profile not found');
          return;
        }

        setAgency(agencyData);

        if (agencyData.userId) {
          try {
            const sessions = await dispatch(fetchSessions({ role: 'user', id: user?.id })).unwrap();
            setUnreadCount(sessions[0]?.unreadCount || 0);
          } catch {
            setError("Failed to fetch sessions");
          }
        }
      } catch (err) {
        setError(err?.message || 'Failed to load agency profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id, dispatch]);

  const toggleChat = () => {
    if (!showChat && unreadCount > 0) setUnreadCount(0);
    setShowChat(!showChat);
  };

  const getVerificationBadge = () => {
    const baseClass = "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider flex items-center";
    const icon = (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    );

    if (agency?.isVerified || agency?.verification === 'verified') {
      return <span className={`${baseClass} bg-green-200 text-green-800`}>{icon}Verified</span>;
    } else if (agency?.verification === 'rejected') {
      return <span className={`${baseClass} bg-red-200 text-red-800`}>Rejected</span>;
    } else {
      return <span className={`${baseClass} bg-yellow-200 text-yellow-800`}>Pending</span>;
    }
  };

  const renderInfoBlock = (title, icon, content) => (
    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">{title}</h2>
      <div className="flex items-start text-gray-600 dark:text-gray-300">
        <div className="w-5 h-5 mr-3 text-indigo-600">{icon}</div>
        <div>{content}</div>
      </div>
    </div>
  );

  const contactInfo = renderInfoBlock(
    "Contact Information",
    <svg className="w-5 h-5 mt-0.5 mr-3 dark:text-white text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>, <div><h3 className="font-medium text-gray-700 dark:text-gray-200">Phone</h3><p>{agency?.contactNo || 'Not provided'}</p></div>
  );

  const address = agency?.address || {};
  const addressInfo = renderInfoBlock(
    "Address",
    <svg className="w-5 h-5 mt-0.5 mr-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>,
    address?.street || address?.city || address?.country ? (
      <>
        {address.street && <p>{address.street}</p>}
        {address.city && <p>{address.city}, {address.state}</p>}
        {address.postalCode && <p>{address.postalCode}</p>}
        {address.country && <p>{address.country}</p>}
      </>
    ) : <p className="italic">No address provided</p>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
          <div className="text-red-500 text-xl font-semibold mb-3">{error}</div>
          <p className="text-gray-600 dark:text-gray-300">Please try again later</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">Retry</button>
        </div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
          <div className="text-gray-800 dark:text-gray-100 text-xl font-semibold mb-3">No agency found</div>
          <p className="text-gray-600 dark:text-gray-300">The requested agency profile does not exist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-gray-800 dark:text-gray-100">
      {/* Top Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="relative bg-gradient-to-r from-marriageRed to-marriageHotPink h-48">
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-32"></div>
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 rounded-xl border-4 border-white bg-white shadow-md overflow-hidden">
              <img
                src={agency.images?.[0] ? `http://localhost:5000/${agency.images[0]}` : 'https://via.placeholder.com/150'}
                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
                className="w-full h-full object-cover"
                alt={`${agency.name} logo`}
              />
            </div>
          </div>
        </div>

        {/* Agency Details */}
        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold">{agency.name}</h1>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mt-2">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                </svg>                {agency.yearOfExp} {agency.yearOfExp === 1 ? 'year' : 'years'} of experience
              </div>
            </div>
            {getVerificationBadge()}
          </div>

          {/* About */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">About Us</h2>
            <p className="leading-relaxed whitespace-pre-line">{agency.description || 'No description available'}</p>
          </div>

          {/* Contact & Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {contactInfo}
            {addressInfo}
          </div>

          {/* Gallery */}
          {agency.images?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {agency.images.map((img, index) => (
                  <div key={index} className="group relative rounded-lg overflow-hidden h-48 bg-gray-100 dark:bg-gray-700">
                    <img
                      src={`http://localhost:5000/${img}`}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button onClick={toggleChat} className="relative bg-marriageHotPink text-white p-4 rounded-full shadow-lg hover:bg-marriageRed transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>          {unreadCount > 0 && <span className="absolute -top-2 -right-2 bg-marriageRed text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>}
        </button>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <button onClick={() => setShowChat(false)} className="absolute top-4 right-8 text-4xl text-marriageRed hover:text-marriageHotPink"><FiX /></button>
          <div className="bg-white dark:bg-gray-800 border-2 border-marriagePink rounded-3xl shadow-2xl p-0 h-[90vh] w-[80vw] max-w-[700px] flex flex-col">
            <AgencyChat isAgency={user?.role === 'agency'} agencyId={agency.userId} />
          </div>
        </div>
      )}

      {/* Allowed Profiles */}
      <AllowedProfiles agencyId={agency.userId} />
    </div>
  );
};

export default AgencyDetail;
