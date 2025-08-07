import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPublicProfiles, getVisibility } from '../../slice/profileVisibilitySlice';
import { useNavigate } from 'react-router-dom';

const AllowedProfiles = ({ agencyId, }) => {
  const [allowedProfiles, setAllowedProfiles] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('userId'))
    dispatch(getVisibility({ agencyId, userId })).unwrap().then((res) => {
      setAllowedProfiles(res?.visibleProfiles)
    })
    dispatch(fetchPublicProfiles({ agencyId }))
  .unwrap()
  .then((res) => {
    // Filter out the current user
    const filteredProfiles = res.filter(profile => profile.userId !== userId);
    setAllowedProfiles(filteredProfiles);
  })

  }, [])

  const handleProfileNavigate = (id) => {
    navigate(`/user/${id}`);
  }
  return (
    <div className="p-4">
      {allowedProfiles?.length > 0 &&
        <>
          <h2 className="text-xl font-bold mb-4 dark:text-white">Allowed Profiles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {allowedProfiles?.map((user) => (
              <div
                key={user._id}
                onClick={() => handleProfileNavigate(user?.userId)}
                className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 border border-gray-200 dark:border-gray-700"
              >
                {user.pic && (
                  <img
                    src={`http://localhost:5000/${user.pic}`}
                    alt={user.name}
                    className="w-full h-40 object-cover rounded-xl mb-3"
                  />
                )}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Age: {user.age} <br />
                  Gender: {user.gender} <br />
                  {user.bio && (
                    <>
                      Bio: <span className="italic">{user.bio}</span>
                    </>
                  )}
                </p>
              </div>
            ))}
          </div></>
      }

    </div>
  );
};

export default AllowedProfiles;
