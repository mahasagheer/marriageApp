// src/components/AgencyProfileDisplay.js
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteAgency, fetchAgencyByuserId } from '../../slice/agencySlice';
import { Button } from '../../Components/Layout/Button';

export const AgencyProfileDisplay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.id) {
          throw new Error('User ID not found');
        }

        const result = await dispatch(fetchAgencyByuserId(user.id)).unwrap();

        if (result?.message?.includes('Agency not found') || result?.message?.includes("Agency not verified")) {
          setAgency(null);
          setError(null);
        } else {
          setAgency(result?.data);
        }
      } catch (err) {
        const errMessage = err?.message || '';
        if (errMessage.includes('404') || errMessage.includes('Profile not found')) {
          setAgency(null);
          setError(null);
        } else {
          setError(errMessage || 'Failed to load agency profile');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [dispatch, id]);

  const handleEditProfile = () => {
    if (agency?._id) {
      navigate(`/agency/addProfile/${agency._id}`);
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete your agency profile? This action cannot be undone.')) {
      try {
        await dispatch(deleteAgency(agency._id)).unwrap();
        navigate('/');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleCardClick = () => {
    navigate("/agency/addProfile")
  }

  if (loading) return (
    <div className="text-center py-20">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-2">Loading profile...</p>
    </div>
  );

  if (error) return (
    <div className="text-center py-20 text-red-500">
      <p>Error: {error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className='ml-[15rem]'>
      {!agency ? (
        <div className='flex flex-col items-center justify-center min-h-screen'>
          <div className="text-white bg-gradient-to-br from-marriagePink via-marriageHotPink to-marriageRed p-10 rounded-2xl shadow-xl text-center border border-white/20">
            <h2 className="text-2xl font-semibold mb-3">
              Create Agency Profile
            </h2>
            <p className="mb-4 text-white/80">
              "Find your perfect match with intelligent matchmaking."
            </p>
            <button
              className="bg-white text-marriageHotPink px-5 py-2 rounded-full hover:bg-gray-200 transition"
              onClick={() => handleCardClick()}
            >
              Create Profile
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Section with Action Buttons */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-start">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center">
                    {agency.images?.[0] ? (
                      <img
                        src={`http://localhost:5000/${agency.images[0]}`}
                        alt="Agency Logo"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl text-blue-600">🏢</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-800">{agency.name}</h1>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${agency.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {agency.isVerified ? 'Verified' : 'Pending Verification'}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                        {agency.yearOfExp} years experience
                      </span>
                    </div>
                    <p className="mt-4 text-gray-600">{agency.profile}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleEditProfile}
                    btnText={"Edit"}
                  />
                  <Button
                    onClick={handleDeleteProfile}
                    btnText="Delete Profile"
                  />
                </div>
              </div>
            </div>

            {/* Rest of your profile display content remains the same */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Business Number</p>
                    <p className="text-gray-800">{agency.businessNo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">License Number</p>
                    <p className="text-gray-800">{agency.licenseNo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">CNIC Number</p>
                    <p className="text-gray-800">{agency.cnicNo || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contact Number</p>
                    <p className="text-gray-800">{agency.contactNo}</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Address</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Street</p>
                    <p className="text-gray-800">{agency?.address?.street}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">City</p>
                      <p className="text-gray-800">{agency?.address?.city}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">State</p>
                      <p className="text-gray-800">{agency?.address?.state || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Postal Code</p>
                      <p className="text-gray-800">{agency?.address?.postalCode || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Country</p>
                      <p className="text-gray-800">{agency?.address?.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            {agency.images?.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Documents</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {agency.images.map((img, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <img
                        src={`http://localhost:5000/${img}`}
                        alt={`Document ${index + 1}`}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-2 text-center bg-gray-50">
                        <p className="text-sm text-gray-600">Document {index + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Verification Status</h2>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${agency.isVerified ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                  {agency.isVerified ? (
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    {agency.isVerified ? 'Verified Agency' : 'Pending Verification'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {agency.isVerified
                      ? 'This agency has been verified by our team'
                      : 'Verification is under process'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};