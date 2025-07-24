import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProfileByuserId, deleteProfile } from '../../slice/userProfile';
import {
  FiUser, FiMail, FiPhone, FiCalendar, FiBook, FiEdit2, FiTrash2,
  FiTrendingUp,
  FiHeart
} from 'react-icons/fi';
import defaultProfilePic from '../../assets/profile.jfif';
import { useDispatch } from 'react-redux';
import { HeroSection } from './Home';
import { Button } from '../../Components/Layout/Button';

export default function UserProfileDisplay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
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
  
        const result = await dispatch(fetchProfileByuserId(user.id)).unwrap();
  
        // Check if result exists and has a message property
        if (result?.message?.includes('Profile not found')) {
          setProfile(null);
          setError(null);
        } else {
          setProfile(result || null);
        }
      } catch (err) {
        // Safely check error message
        const errMessage = err?.message || '';
        if (errMessage.includes('404') || errMessage.includes('Profile not found')) {
          setProfile(null);
          setError(null);
        } else {
          setError(errMessage || 'Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };
  
    loadProfile();
  }, [dispatch, id]);

  const handleEditProfile = () => {
    if (profile?._id) {
      navigate(`/user/addProfile/${profile._id}`);
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      try {
        await dispatch(deleteProfile(profile._id)).unwrap();
        navigate('/');
      } catch (err) {
        setError(err.message);
      }
    }
  };

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
    <div className="min-h-screen bg-white">
      {!profile ? (
        <div className='flex flex-col items-center justify-center py-[6rem]'>
          <HeroSection />
          
        </div>
      ) : (
        <div className="w-[100%] py-8 px-4">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 relative">
            {/* Action Buttons - Top Right Corner */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                onClick={handleEditProfile}
                btnText="Edit"
                btnIcon={FiEdit2}
                btnColor="marriageHotPink"
                padding="px-4 py-2"
              />
              <Button
                onClick={handleDeleteProfile}
                btnText="Delete"
                btnIcon={FiTrash2}
                btnColor="marriageRed"
                padding="px-4 py-2"
              />
            </div>

            <div className="md:flex">
              {/* Profile Image */}
              <div className="md:w-1/3 p-6 flex flex-col items-center">
                <img
                  src={
                    profile.pic
                      ? `http://localhost:5000/${profile.pic}`
                      : defaultProfilePic
                  }
                  alt={profile.name || 'Profile'}
                  className="h-56 w-56 object-cover rounded-full border-2 border-white shadow-md"
                  onError={(e) => {
                    e.target.src = defaultProfilePic;
                  }}
                />
              </div>

              {/* Basic Info */}
              <div className="md:w-2/3 p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{profile.name}</h1>
                <div className="flex flex-col mb-2 gap-2">
                  <div className="flex items-center text-gray-600">
                    <FiUser className="mr-2" />
                    <span>{profile.gender}, {profile.age} years</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiHeart
                      className="mr-2" />
                    <span>{profile.maritalStatus || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiTrendingUp className="mr-2" />
                    <span>{profile.height} tall</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="mr-2" />
                    <span>Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Religion/Caste */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.religion && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {profile.religion}
                    </span>
                  )}
                  {profile.caste && (
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {profile.caste}
                    </span>
                  )}
                </div>


              </div>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Education & Career */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiBook className="mr-2 text-blue-500" />
                Education & Career
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">Education</h3>
                  <p className="text-gray-600">{profile.education || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Occupation</h3>
                  <p className="text-gray-600">{profile.occupation || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Income</h3>
                  <p className="text-gray-600">{profile.income || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiUser className="mr-2 text-green-500" />
                Personal Details
              </h2>
              <div className="space-y-4">
                {/* Contact Info */}
                <div className="mt-4 space-y-2">
                  {profile.userId.email && (
                    <div className="flex items-center  text-gray-600">
                      <FiMail className="mr-2" />
                      <span>{profile?.userId?.email}</span>
                    </div>
                  )}
                  {profile?.userId?.phone && (
                    <div className="flex items-center  text-gray-600">
                      <FiPhone className="mr-2 " />
                      <span>{profile.userId.phone}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">About Me</h3>
                  <p className="text-gray-600 whitespace-pre-line">
                    {profile.bio || 'No bio provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          {profile.gallery?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile.gallery.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      className="h-48 w-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button className="p-2 bg-white rounded-full text-red-500 hover:bg-red-100">
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}