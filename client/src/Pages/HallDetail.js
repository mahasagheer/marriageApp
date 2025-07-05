import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSingleHall } from "../slice/hallSlice";
import OwnerLayout from "../components/OwnerLayout";
import { FiMapPin, FiUsers, FiDollarSign, FiCheckCircle } from "react-icons/fi";

const HallDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleHall, loading, error } = useSelector((state) => state.halls);

  useEffect(() => {
    if (id) dispatch(fetchSingleHall(id));
  }, [id, dispatch]);

  return (
    <OwnerLayout>
      <div className="ml-[15%] p-6">
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : singleHall ? (
          <div className="bg-white rounded-xl shadow p-6">
            {/* Image Gallery */}
            {singleHall.images && singleHall.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {singleHall.images.slice(0, 6).map((img, idx) => (
                  <img
                    key={idx}
                    src={`http://localhost:5000/${img.replace(/\\/g, '/').replace(/^uploads\//, 'uploads/')}`}
                    alt="hall"
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                ))}
              </div>
            )}
            {/* Hall Title & Location */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
              <div>
                <h2 className="text-3xl font-bold text-marriageHotPink mb-1 font-mono">{singleHall.name}</h2>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <FiMapPin className="mr-1" /> {singleHall.location}
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2 bg-marriagePink/10 px-4 py-2 rounded-lg">
                  <FiUsers className="text-marriageHotPink" />
                  <span className="font-semibold text-gray-700">{singleHall.capacity} Guests</span>
                </div>
                <div className="flex items-center gap-2 bg-marriagePink/10 px-4 py-2 rounded-lg">
                  <FiDollarSign className="text-marriageHotPink" />
                  <span className="font-semibold text-gray-700">{singleHall.price} PKR</span>
                </div>
              </div>
            </div>
            {/* Description */}
            <div className="text-gray-700 mb-6 text-lg">
              {singleHall.description}
            </div>
            {/* Amenities/Features Section */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Example amenities, replace with real data if available */}
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 border">
                  <FiCheckCircle className="text-green-500" />
                  <span>Parking</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 border">
                  <FiCheckCircle className="text-green-500" />
                  <span>WiFi</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 border">
                  <FiCheckCircle className="text-green-500" />
                  <span>Air Conditioning</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 border">
                  <FiCheckCircle className="text-green-500" />
                  <span>Sound System</span>
                </div>
              </div>
            </div>
            {/* Room Details Section (example) */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Where you'll stay</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border flex flex-col items-center">
                  <img
                    src={singleHall.images && singleHall.images[0] ? `http://localhost:5000/${singleHall.images[0].replace(/\\/g, '/').replace(/^uploads\//, 'uploads/')}` : 'https://via.placeholder.com/220x160?text=Room+1'}
                    alt="Room 1"
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <div className="font-semibold text-gray-700">Main Hall</div>
                  <div className="text-gray-500 text-sm">Spacious and well-lit</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border flex flex-col items-center">
                  <img
                    src={singleHall.images && singleHall.images[1] ? `http://localhost:5000/${singleHall.images[1].replace(/\\/g, '/').replace(/^uploads\//, 'uploads/')}` : 'https://via.placeholder.com/220x160?text=Room+2'}
                    alt="Room 2"
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <div className="font-semibold text-gray-700">VIP Room</div>
                  <div className="text-gray-500 text-sm">Private and comfortable</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </OwnerLayout>
  );
};

export default HallDetail; 