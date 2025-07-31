import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  fetchProfileByuserId,
  deleteProfile,
} from '../../slice/userProfile';
import { getPreferences } from '../../slice/matchMakingSlice';
import { fetchPaymentByUserId } from '../../slice/AgencyChatSlice';
import {
  FiUser, FiMail, FiPhone, FiCalendar, FiBook, FiEdit2,
  FiTrash2, FiTrendingUp, FiHeart,
} from 'react-icons/fi';
import defaultProfilePic from '../../assets/profile.jfif';
import { HeroSection } from './Home';
import { Button } from '../../Components/Layout/Button';
import PreferenceCard from '../../Components/Phase_2/preferenceCard';
import { PaymentCard } from '../../Components/Phase_2/paymentDetail';
import ConfirmationModal from '../../Components/Phase_2/ConfirmationModal';
import LoadingSpinner from '../../Components/Layout/Loading';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { fetchProfileVisibility, privateProfileVisibilty, publicProfileVisibilty } from '../../slice/profileVisibilitySlice';

export default function UserProfileDisplay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth()
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [paymentDetail, setPaymentDetail] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileDisplay, setProfileDisplay] = useState(false)
  const [isPublic, setIsPublic] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (!id) throw new Error('User ID missing');

        const profileData = await dispatch(fetchProfileByuserId(id)).unwrap();
        if (!profileData || profileData?.message?.includes('Profile not found')) {
          setProfile(null);
        } else {
          setProfile(profileData);
          const userId = JSON.parse(localStorage?.getItem('userId'))
          if (userId != null && userId != profileData?._id) {
            setProfileDisplay(true)
          }
        }


        const pref = await dispatch(getPreferences(id)).unwrap();
        setPreferences(pref?.data?.preferences || null);

        const payment = await dispatch(fetchPaymentByUserId(id)).unwrap();
        setPaymentDetail(payment || []);
      } catch (err) {
        setError(err?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dispatch, id]);

  const handlePublicToggle = async (profileId, makePublic) => {
    try {
      // Call redux thunk or API directly
      if (makePublic) {
        await dispatch(publicProfileVisibilty({ agencyId: user?.id, profileId })).unwrap();
        toast.success("Profile made public successfully");
      } else {
        // Optional: if you plan to implement "make private"
        await dispatch(privateProfileVisibilty({ agencyId: user?.id, profileId })).unwrap();
        toast.success("Profile visibility removed");
      }
      fetchVisibility()
    } catch (err) {
      toast.error("Failed to update visibility status.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVisibility()
  }, [user,profile])
const fetchVisibility=()=>{
  if (user?.role === 'agency' && profile) {
    dispatch(fetchProfileVisibility({ userId: profile?._id, agencyId: user?.id })).unwrap().then((res) => {
      setIsPublic(res)
    })
  }
}
  const handleEditProfile = () => {
    if (profile?._id) {
      navigate(`/user/addProfile/${profile._id}`);
    }
  };

  const handleDeleteProfile = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteProfile = async () => {
    try {
      await dispatch(deleteProfile(profile._id)).unwrap();
      toast.success('Profile Deleted successfully')
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to delete profile');
    } finally {
      setShowDeleteModal(false);
    }
  };


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

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <HeroSection />
      </div>
    );
  }



  return (
    <div className="min-h-screen w-full max-w-6xl mx-auto py-10 px-4">
      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg relative mb-10 border border-gray-200 dark:border-gray-700">
        {(!profileDisplay && user?.role == 'user') &&
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <Button
              onClick={handleEditProfile}
              btnText={<span className="hidden sm:inline">Edit</span>}
              BtnIcon={FiEdit2}
              btnColor="marriageHotPink"
              padding="md:px-4 md:py-2 p-2"
            />

            <Button
              onClick={handleDeleteProfile}
              btnText={<span className="hidden sm:inline">Delete</span>}
              BtnIcon={FiTrash2}
              btnColor="marriageHotPink"
              padding="md:px-4 md:py-2 p-2"
            />
          </div>}
        {
          user.role === 'agency' &&
          <div className="absolute top-4 right-4 flex gap-2 z-10">

            <div className="text-lg m-1 text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <label htmlFor={`public-${profile?._id}`} className="flex items-center gap-1 cursor-pointer">
                <input
                  id={`public-${profile?._id}`}
                  type="checkbox"
                  checked={isPublic || false}
                  onChange={(e) => handlePublicToggle(profile?._id, e.target.checked)}
                  className="form-checkbox h-4 w-4 text-green-600"
                />
                Make Profile Public
              </label>
            </div>
          </div>
        }
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

      {/* Payment Details */}
      {(paymentDetail.length > 0 && !profileDisplay) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentDetail.map((payment) => (
            <PaymentCard key={payment._id} payment={payment} />
          ))}
        </div>
      )}
      {showDeleteModal && (
        <ConfirmationModal
          onClickCancel={() => setShowDeleteModal(false)}
          onClickSubmit={confirmDeleteProfile}
          cnfrmText={'Are you sure you want to delete your profile? This action cannot be undone.'} />
      )}

    </div>
  );
}
