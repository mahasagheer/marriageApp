import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getVisibility } from '../../slice/profileVisibilitySlice';

const AllowedProfiles = ({ agencyId,userId }) => {
  const [allowedProfiles,setAllowedProfiles]=useState([])
  const dispatch=useDispatch()
useEffect(()=>{
  dispatch(getVisibility({agencyId, userId})).unwrap().then((res)=>{
    console.log(res)
  })
},[])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Allowed Profiles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {allowedProfiles.map((user) => (
          <div
            key={user._id}
            className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 border border-gray-200 dark:border-gray-700"
          >
            {user.profileImage && (
              <img
                src={user.profileImage}
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

            {/* Add more fields if needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllowedProfiles;
