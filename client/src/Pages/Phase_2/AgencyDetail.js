import React, { useEffect, useState } from 'react';
import { fetchAgencyById } from '../../slice/agencySlice';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AgencyChat from './AgencyChat';
import { FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const AgencyDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agency, setAgency] = useState(null);
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(false);


  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = await dispatch(fetchAgencyById(id));

        if (result.payload?.message?.includes('Profile not found')) {
          setAgency(null);
          setError('Agency profile not found');
        } else {
          setAgency(result.payload?.data || null);
        }
      } catch (err) {
        const errMessage = err?.message || 'Failed to load agency profile';
        setError(errMessage);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id, dispatch]);


  const toggleChat = async() => {
    setShowChat(!showChat);
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="text-red-500 text-xl font-semibold mb-3">{error}</div>
          <p className="text-gray-600">Please try again later</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="max-w-6xl h-[30vh] mx-auto px-4 sm:px-6 lg:px-8 py-12 my-[2.9rem]">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="text-gray-800 text-xl font-semibold mb-3">No agency found</div>
          <p className="text-gray-600">The requested agency profile does not exist</p>
        </div>
      </div>
    );
  }

  // Destructure agency data with fallbacks
  const {
    name = 'Unnamed Agency',
    yearOfExp = 0,
    description = 'No description available',
    address = {},
    contactNo = 'Not provided',
    images = [],
    verification = 'pending'
  } = agency;
console.log(agency)
  const getVerificationBadge = () => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider";

    if (verification === 'verified') {
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800 flex items-center`}>
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified
        </span>
      );
    } else if (verification === 'rejected') {
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Rejected</span>;
    } else {
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
    }
  };

  return (
    <div className="max-w-6xl  mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header with Cover Photo */}
        <div className="relative bg-gradient-to-r from-marriageRed to-marriageHotPink h-48">
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-32"></div>
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 rounded-xl border-4 border-white bg-white shadow-md overflow-hidden">
              <img
                src={images[0] ? `http://localhost:5000/${images[0]}` : 'https://via.placeholder.com/150'}
                alt={`${name} logo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-20 px-8 pb-8">
          {/* Agency Name and Verification */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
              <div className="flex items-center text-gray-600 mt-2">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                </svg>
                {yearOfExp} {yearOfExp === 1 ? 'year' : 'years'} of experience
              </div>
            </div>
            {getVerificationBadge()}
          </div>

          {/* About Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">About Us</h2>
            <p className="text-gray-600 leading-relaxed">
              {description.split('\n').map((paragraph, i) => (
                <span key={i}>
                  {paragraph}
                  <br /><br />
                </span>
              ))}
            </p>
          </div>

          {/* Contact and Address Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 mt-0.5 mr-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-gray-700">Phone</h3>
                    <p className="text-gray-600">{contactNo}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Address</h2>
              <div className="flex items-start">
                <svg className="w-5 h-5 mt-0.5 mr-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div>
                  {address.street && <p className="text-gray-600">{address.street}</p>}
                  {address.city && <p className="text-gray-600">{address.city}, {address.state}</p>}
                  {address.postalCode && <p className="text-gray-600">{address.postalCode}</p>}
                  {address.country && <p className="text-gray-600">{address.country}</p>}
                  {!address.street && !address.city && !address.postalCode && !address.country && (
                    <p className="text-gray-600 italic">No address provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          {images.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="group relative rounded-lg overflow-hidden h-48 bg-gray-100">
                    <img
                      src={`http://localhost:5000/${img}`}
                      alt={`${name} gallery ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                     
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-white/90 text-gray-800 p-2 rounded-full">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-8 right-8 flex gap-4 z-40">
        <button
          onClick={toggleChat}
          className="bg-marriageHotPink text-white p-4 rounded-full shadow-lg hover:bg-marriageRed transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>

      {/* Chat component */}
      {showChat && (
        <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn">
          <button
            className="absolute top-[3%] right-[18%] rounded-full text-marriageRed text-4xl font-bold hover:text-marriageHotPink z-50 flex items-center justify-center"
            onClick={() => setShowChat(false)}
            aria-label="Close chat"
            style={{ width: 48, height: 48 }}
          >
            <FiX/>
          </button>
          <div className="bg-white rounded-3xl my-2 shadow-2xl border-2 h-[95vh]  max-w-4xl border-marriagePink p-0  flex flex-col overflow-hidden relative">
            <div className="flex-1 flex flex-col bg-gradient-to-br  w-full  from-white via-marriagePink/10 to-marriagePink/5">

              <AgencyChat isAgency={user?.role=='agency'}  agencyId={agency?.userId} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AgencyDetail;