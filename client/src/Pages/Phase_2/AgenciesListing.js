import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAgencies } from '../../slice/agencySlice';
import { useDispatch } from 'react-redux';
import { Button } from '../../Components/Layout/Button';

const AgencyListing = () => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ verified: false, experience: '', city: '' });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const loadAgencies = async () => {
      try {
        const result = await dispatch(fetchAgencies()).unwrap();
        const message = result?.message || '';
        if (message.includes('Profile not found') || message.includes('Agencies not found')) {
          setAgencies([]);
          setError(null);
        } else {
          setAgencies(result?.data || []);
        }
      } catch (err) {
        const errMsg = err?.message || 'Failed to load agencies';
        setError(errMsg.includes('404') ? null : errMsg);
        setAgencies([]);
      } finally {
        setLoading(false);
      }
    };

    loadAgencies();
  }, [dispatch]);

  const cities = useMemo(() => [...new Set(agencies.map((a) => a.address.city))], [agencies]);

  const filteredAgencies = useMemo(() => {
    return agencies.filter(({ name, address, isVerified, yearOfExp }) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = name.toLowerCase().includes(search) || address.city.toLowerCase().includes(search);
      const matchesVerified = !filters.verified || isVerified;
      const matchesExperience =
        !filters.experience ||
        (filters.experience === '5+'
          ? yearOfExp >= 5
          : yearOfExp >= parseInt(filters.experience));
      const matchesCity = !filters.city || address.city === filters.city;

      return matchesSearch && matchesVerified && matchesExperience && matchesCity;
    });
  }, [agencies, filters, searchTerm]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({ verified: false, experience: '', city: '' });
  };

  const handleProfileView = (id) => {
    const user = JSON.parse(localStorage.getItem('id'));
    navigate(user ? `/user/agencies/${id}` : '/user/addProfile');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Mobile Filter Dialog */}
      <div className={`fixed inset-0 z-40 my-5 lg:hidden ${mobileFiltersOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileFiltersOpen(false)}></div>
        <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white dark:bg-gray-800 py-4 pb-12 shadow-xl">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Filters</h2>
            <button
              type="button"
              className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white dark:bg-gray-800 p-2 text-gray-400"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filters */}
          <div className="mt-4 px-4 space-y-6">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.verified}
                  onChange={() => setFilters({ ...filters, verified: !filters.verified })}
                  className="h-5 w-5 text-blue-600 rounded"
                />
                <span className="text-gray-700 dark:text-gray-300">Verified Only</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience</label>
              <select
                value={filters.experience}
                onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Experience Levels</option>
                <option value="1">1+ Years</option>
                <option value="3">3+ Years</option>
                <option value="5">5+ Years</option>
                <option value="10">10+ Years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
              <select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="pt-6 pb-4 relative">
          <input
            type="text"
            placeholder="Search by agency name or city..."
            className="w-full p-4 pl-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-4 top-10 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Filters</h2>

              <div className="mb-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.verified}
                    onChange={() => setFilters({ ...filters, verified: !filters.verified })}
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Verified Only</span>
                </label>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience</label>
                <select
                  value={filters.experience}
                  onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">All Experience Levels</option>
                  <option value="1">1+ Years</option>
                  <option value="3">3+ Years</option>
                  <option value="5">5+ Years</option>
                  <option value="10">10+ Years</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                <select
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <Button onClick={handleClearFilters} btnText="Clear Filters" />
            </div>
          </div>

          {/* Agencies List */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Wedding Agencies</h1>
              <button
                type="button"
                className="lg:hidden inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgencies.length > 0 ? (
                filteredAgencies.map((agency) => (
                  <div
                    key={agency._id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                      {agency.images?.[0] ? (
                        <img
                          src={`http://localhost:5000/${agency.images[0]}`}
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
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{agency.name}</h2>
                        <span className="bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100 text-xs px-2 py-1 rounded-full">
                          {agency.yearOfExp}+ years
                        </span>
                      </div>
                      <div className="flex items-center mt-2 text-gray-600 dark:text-gray-300">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{agency.address.city}, {agency.address.country}</span>
                      </div>
                      <p className="mt-3 text-gray-600 dark:text-gray-400 line-clamp-2">{agency.profile}</p>
                      <div className="mt-4 flex justify-center">
                        <Button onClick={() => handleProfileView(agency._id)} btnText="View Profile" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">
                    No agencies found matching your criteria
                  </h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyListing;
