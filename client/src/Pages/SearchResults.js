import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FiMapPin, FiUsers, FiDollarSign } from "react-icons/fi";
import { Button } from "../Components/Layout/Button";
import { useDispatch, useSelector } from "react-redux";
import { searchHalls } from "../slice/hallSlice";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery();
  const dispatch = useDispatch();
  const { searchResults: halls, loading, error } = useSelector((state) => state.halls);

  const name = query.get("name") || "";
  const location = query.get("location") || "";

  useEffect(() => {
    dispatch(searchHalls({ name, location }));
  }, [dispatch, name, location]);

  return (
    <div className="min-h-screen bg-white font-sans px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-marriageHotPink mb-8 font-mono text-center">
          Search Results
        </h2>
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-center text-marriageRed">{error}</div>
        ) : halls.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
            No halls found matching your criteria.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {halls.map((hall) => (
              <div
                key={hall._id}
                className="flex flex-col md:flex-row bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-lg transition cursor-pointer"
              >
                {/* Hall Image */}
                <div className="md:w-56 w-full h-40 md:h-auto flex-shrink-0 bg-gray-200 flex items-center justify-center">
                  <img
                    src={
                      hall.images && hall.images.length > 0
                        ? `http://localhost:5000/${hall.images[0].replace(/\\/g, '/').replace(/^uploads\//, 'uploads/')}`
                        : 'https://via.placeholder.com/220x160?text=Hall+Image'
                    }
                    alt={hall.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                {/* Hall Info */}
                <div className="flex-1 flex flex-col md:flex-row md:items-center p-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-gray-800 truncate">{hall.name}</span>
                      <span className="ml-2 text-xs text-green-600 font-semibold">Active</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <FiMapPin className="mr-1" /> {hall.location}
                    </div>
                    <div className="text-gray-600 text-sm mb-2">
                      {hall.description && hall.description.length > 250
                        ? `${hall.description.substring(0, 100)}...`
                        : hall.description}
                    </div>
                    <div className="flex items-center gap-4 text-gray-500 text-xs mb-2">
                      <span className="flex items-center gap-1"><FiUsers /> {hall.capacity || 0} Guests</span>
                      <span className="flex items-center gap-1"><FiDollarSign /> {hall.price || 0} PKR</span>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex flex-col gap-2 md:items-end md:justify-between min-w-[120px]">
                    <Button
                      btnText={"View Details"}
                      btnColor="marriageHotPink"
                      padding="px-4 py-2"
                      onClick={() => window.location.href = `/public-halls/${hall._id}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults; 