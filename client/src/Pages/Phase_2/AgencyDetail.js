import React, { useEffect, useState } from 'react';
import { fetchAgencyById } from '../../slice/agencySlice';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const AgencyDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agency, setAgency] = useState(null);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md text-center py-8">
        <div className="text-red-500 text-lg font-medium">{error}</div>
        <p className="text-gray-600 mt-2">Please try again later</p>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md text-center py-8">
        <div className="text-gray-800 text-lg font-medium">No agency found</div>
        <p className="text-gray-600 mt-2">The requested agency profile does not exist</p>
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Agency Logo/Image */}
        <div className="w-32 h-32 flex-shrink-0">
          <img 
            src={`http://localhost:5000/${images[0] }`|| 'https://via.placeholder.com/150'} 
            alt={`${name} logo`}
            className="w-full h-full object-cover rounded-lg border border-gray-200"
          />
        </div>
        
        {/* Agency Basic Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
            <span className={`px-3 py-1 rounded-full text-sm ${
              verification === 'verified' ? 'bg-green-100 text-green-800' :
              verification === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {verification}
            </span>
          </div>
          
          <div className="flex items-center text-gray-700 mt-4">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
            </svg>
            {yearOfExp} {yearOfExp === 1 ? 'year' : 'years'} of experience
          </div>
        </div>
      </div>
      
      {/* About Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">About</h2>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
      
      {/* Contact Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
          <div className="space-y-2">
            <p className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              {contactNo}
            </p>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Address</h2>
          <div className="text-gray-600 space-y-1">
            {address.street && <p>{address.street}</p>}
            {address.city && <p>{address.city}, {address.state}</p>}
            {address.postalCode && <p>{address.postalCode}</p>}
            {address.country && <p>{address.country}</p>}
            {!address.street && !address.city && !address.postalCode && !address.country && (
              <p>No address provided</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Gallery Section (if images available) */}
      {images.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, index) => (
              <img 
                key={index}
                src={img}
                alt={`${name} gallery ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300';
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyDetail;