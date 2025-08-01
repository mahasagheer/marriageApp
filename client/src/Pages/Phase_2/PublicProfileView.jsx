import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  getTokenVerification,
} from '../../slice/userProfile';
import { getPreferences } from '../../slice/matchMakingSlice';
import {
  FiUser, FiMail, FiPhone, FiCalendar, FiBook, FiEdit2,
  FiTrash2, FiTrendingUp, FiHeart,
  FiArrowLeft,
} from 'react-icons/fi';
import defaultProfilePic from '../../assets/profile.jfif';
import PreferenceCard from '../../Components/Phase_2/preferenceCard';
import LoadingSpinner from '../../Components/Layout/Loading';

export default function PublicProfileView() {
  const { token } = useParams();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preferences, setPreferences] = useState(null);
  
  useEffect(() => {

   
    if(token)
    {
        setLoading(true)
      dispatch(getTokenVerification(token)).unwrap().then((res) => {
        setProfile(res)
        setLoading(false)
        dispatch(getPreferences(res?.userId)).unwrap().then((res)=>{
          setPreferences(res?.data?.preferences || null);
        });
      })
    }
    

  }, [dispatch, token]);

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  if (error) {
    return (
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
  }




  return (
    <div className="min-h-screen w-full  py-10 px-4 dark:bg-gray-900">
      <div className='flex flex-col gap-4 max-w-5xl mx-auto'>
      <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4 text-center text-md border border-yellow-300">
          You are viewing this profile via a secure access link.
        </div>
      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg relative mb-10 border border-gray-200 dark:border-gray-700">
       
        <div className="md:flex items-center">
          <div className="md:w-1/3 p-8 flex justify-center">
            <img
              src={profile.pic ? `http://localhost:5000/${profile.pic}` : defaultProfilePic}
              onError={(e) => (e.target.src = defaultProfilePic)}
              alt={profile.name || 'Profile'}
              className="h-56 w-56 object-cover rounded-full border-4 border-white shadow-xl"
            />
          </div>
          <div className="md:w-2/3 p-6 md:pr-10">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{profile.name || 'Unnamed'}</h1>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <div className="flex items-center"><FiUser className="mr-2" /><span>{profile.gender || 'N/A'}, {profile.age || '?'} years</span></div>
              <div className="flex items-center"><FiHeart className="mr-2" /><span>{profile.maritalStatus || 'Not specified'}</span></div>
              <div className="flex items-center"><FiTrendingUp className="mr-2" /><span>{profile.height || 'Not specified'} tall</span></div>
              <div className="flex items-center"><FiCalendar className="mr-2" /><span>Member since {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</span></div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.religion && (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {profile.religion}
                </span>
              )}
              {profile.caste && (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {profile.caste}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Education & Personal Details */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-600 dark:text-blue-400">
            <FiBook className="mr-2" /> Education & Career
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <div><h3 className="font-medium">Education</h3><p>{profile.education || 'Not specified'}</p></div>
            <div><h3 className="font-medium">Occupation</h3><p>{profile.occupation || 'Not specified'}</p></div>
            <div><h3 className="font-medium">Income</h3><p>{profile.income || 'Not specified'}</p></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-green-600 dark:text-green-400">
            <FiUser className="mr-2" /> Personal Details
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <div className="space-y-2">
              {profile?.userId?.email && <div className="flex items-center"><FiMail className="mr-2" /><span>{profile.userId.email}</span></div>}
              {profile?.userId?.phone && <div className="flex items-center"><FiPhone className="mr-2" /><span>{profile.userId.phone}</span></div>}
            </div>
            <div><h3 className="font-medium">About Me</h3><p className="whitespace-pre-line">{profile.bio || 'No bio provided'}</p></div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      {Array.isArray(profile.gallery) && profile.gallery.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 mb-10 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {profile.gallery.map((img, index) => (
              <div key={index} className="relative group">
                <img src={img} alt={`Gallery ${index + 1}`} className="h-48 w-full object-cover rounded-xl shadow-sm" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button className="p-2 bg-white rounded-full text-red-500 hover:bg-red-100">
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preferences */}
      {preferences && (
        <div className="mb-10">
          <PreferenceCard preferences={preferences} />
        </div>
      )}

</div>
    </div>
  );
}
