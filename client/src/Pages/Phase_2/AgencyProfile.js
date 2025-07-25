// src/components/AgencyProfileDisplay.js
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteAgency, fetchAgencyByuserId } from '../../slice/agencySlice';
import { Button } from '../../Components/Layout/Button';
import { Building, Phone, FileText, MapPin, UserCheck, ShieldCheck, BadgeInfo, Calendar, IdCard, Globe } from 'lucide-react';

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

<div className="ml-[3rem]   text-gray-900 dark:text-gray-100 min-h-screen">
  {!agency ? (
    <div className='flex items-center justify-center min-h-[90vh]'>
      <div className="text-white bg-gradient-to-br from-marriagePink via-marriageHotPink to-marriageRed p-10 rounded-2xl shadow-xl text-center border border-white/20 dark:border-white/10">
        <h2 className="text-2xl font-semibold mb-3">Create Agency Profile</h2>
        <p className="mb-4 text-white/80">"Find your perfect match with intelligent matchmaking."</p>
       
        <button
          className="bg-white text-marriageHotPink px-5 py-2  hover:bg-gray-200 transition"
          onClick={handleCardClick}
        >
          Create Profile
        </button>
              </div>
    </div>
  ) : (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white border-gray-200 border-2 dark:border-gray-700 dark:bg-gray-900 rounded-2xl shadow p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center overflow-hidden">
              {agency.images?.[0] ? (
                <img src={`http://localhost:5000/${agency.images[0]}`} alt="Agency Logo" className="w-full h-full object-cover" />
              ) : (
                <Building className="text-blue-600 dark:text-blue-300 w-12 h-12" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{agency.name}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${agency.isVerified ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                  {agency.isVerified ? 'Verified' : 'Pending Verification'}
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm font-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {agency.yearOfExp} yrs experience
                </span>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-200">{agency.profile}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button onClick={handleEditProfile} btnText={"Edit"} />
            <Button onClick={handleDeleteProfile} btnText="Delete Profile" />
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white  dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
              <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" /> Contact Information
            </h2>
            <InfoItem icon={<Phone className="w-4 h-4" />} label="Business Number" value={agency.businessNo} />
            <InfoItem icon={<FileText className="w-4 h-4" />} label="License Number" value={agency.licenseNo} />
            <InfoItem icon={<IdCard className="w-4 h-4" />} label="CNIC Number" value={agency.cnicNo || 'Not provided'} />
            <InfoItem icon={<Phone className="w-4 h-4" />} label="Contact Number" value={agency.contactNo} />
          </div>

          {/* Address */}
          <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
              <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" /> Address
            </h2>
            <InfoItem icon={<MapPin className="w-4 h-4" />} label="Street" value={agency?.address?.street} />
            <div className="grid grid-cols-2 gap-4">
              <InfoItem icon={<MapPin className="w-4 h-4" />} label="City" value={agency?.address?.city} />
              <InfoItem icon={<MapPin className="w-4 h-4" />} label="State" value={agency?.address?.state || 'Not provided'} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem icon={<BadgeInfo className="w-4 h-4" />} label="Postal Code" value={agency?.address?.postalCode || 'Not provided'} />
              <InfoItem icon={<Globe className="w-4 h-4" />} label="Country" value={agency?.address?.country} />
            </div>
          </div>
        </div>

        {/* Documents */}
        {agency.images?.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border-2 border-gray-200  dark:border-gray-700 rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" /> Documents
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {agency.images.map((img, index) => (
                <div key={index} className="border rounded-lg overflow-hidden dark:border-gray-700">
                  <img src={`http://localhost:5000/${img}`} alt={`Document ${index + 1}`} className="w-full h-40 object-cover" />
                  <div className="p-2 text-center bg-gray-50 dark:bg-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Document {index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verification Status */}
        <div className="bg-white  dark:bg-gray-900 border-2 border-gray-200  dark:border-gray-700 rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-gray-500 dark:text-gray-400" /> Verification Status
          </h2>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${agency.isVerified ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'}`}>
              {agency.isVerified ? (
                <UserCheck className="w-6 h-6 text-green-600 dark:text-green-300" />
              ) : (
                <BadgeInfo className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white">
                {agency.isVerified ? 'Verified Agency' : 'Pending Verification'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {agency.isVerified
                  ? 'This agency has been verified by our team.'
                  : 'Verification is under process.'}
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

const InfoItem = ({ icon, label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-700 dark:text-gray-100 flex items-center gap-1">
      {icon} {label}
    </p>
    <p className="text-gray-800 dark:text-gray-200">{value}</p>
  </div>
);
