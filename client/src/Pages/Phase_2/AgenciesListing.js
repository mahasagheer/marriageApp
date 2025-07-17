import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAgencies } from '../../slice/agencySlice';
import { useDispatch } from 'react-redux';

const AgencyListing = () => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    verified: false,
    experience: '',
    city: ''
  });
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadProfile = async () => {
      try {
  
        const result = await dispatch(fetchAgencies()).unwrap();
  
        // Check if result exists and has a message property
        if (result?.message?.includes('Profile not found')) {
            setAgencies(null);
          setError(null);
        } else {
            setAgencies(result || null);
        }
      } catch (err) {
        // Safely check error message
        const errMessage = err?.message || '';
        if (errMessage.includes('404') || errMessage.includes('Agencies not found')) {
          setAgencies(null);
          setError(null);
        } else {
          setError(errMessage || 'Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };
  
    loadProfile();
  }, []);

  const filteredAgencies = agencies.filter(agency => {
    // Search term filter
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         agency.address.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Additional filters
    const matchesVerified = !filters.verified || agency.isVerified;
    const matchesExperience = !filters.experience || 
                            (filters.experience === '5+' ? agency.yearOfExp >= 5 : agency.yearOfExp >= parseInt(filters.experience));
    const matchesCity = !filters.city || agency.address.city === filters.city;
    
    return matchesSearch && matchesVerified && matchesExperience && matchesCity;
  });

  const cities = [...new Set(agencies.map(agency => agency.address.city))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-[15rem] bg-gray-50 p-4 md:p-8">
      <div className="max-w-[100%] mx-auto">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Find Wedding Agencies</h1>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search by agency name or city..."
              className="w-full p-4 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-4 top-4 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Verified Filter */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.verified}
                  onChange={() => setFilters({...filters, verified: !filters.verified})}
                  className="h-5 w-5 text-blue-600 rounded"
                />
                <span className="text-gray-700">Verified Only</span>
              </label>
            </div>

            {/* Experience Filter */}
            <div>
              <select
                value={filters.experience}
                onChange={(e) => setFilters({...filters, experience: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Experience Levels</option>
                <option value="1">1+ Years</option>
                <option value="3">3+ Years</option>
                <option value="5">5+ Years</option>
                <option value="10">10+ Years</option>
              </select>
            </div>

            {/* City Filter */}
            <div>
              <select
                value={filters.city}
                onChange={(e) => setFilters({...filters, city: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Agencies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgencies.length > 0 ? (
            filteredAgencies.map(agency => (
              <div key={agency._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gray-200">
                  {agency.images?.[0] ? (
                    <img
                      src={agency.images[0]}
                      alt={agency.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <span className="text-5xl">🏢</span>
                    </div>
                  )}
                  {agency.isVerified && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Verified
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-gray-800">{agency.name}</h2>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {agency.yearOfExp}+ years
                    </span>
                  </div>
                  <div className="flex items-center mt-2 text-gray-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{agency.address.city}, {agency.address.country}</span>
                  </div>
                  <p className="mt-3 text-gray-600 line-clamp-2">{agency.profile}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() => navigate(`/agencies/${agency._id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      View Profile
                    </button>
                    <a 
                      href={`tel:${agency.contactNo}`}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Contact
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <h3 className="text-xl font-medium text-gray-600">No agencies found matching your criteria</h3>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({
                    verified: false,
                    experience: '',
                    city: ''
                  });
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgencyListing;