import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSingleHall } from "../slice/hallSlice";
import OwnerLayout from "../components/OwnerLayout";

const HallDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleHall, loading, error } = useSelector((state) => state.halls);

  useEffect(() => {
    if (id) dispatch(fetchSingleHall(id));
  }, [id, dispatch]);

  return (
    <OwnerLayout>
      <div className="max-w-3xl mx-auto p-6">
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : singleHall ? (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-marriageHotPink mb-2">{singleHall.name}</h2>
            <div className="text-gray-500 mb-2">{singleHall.location}</div>
            <div className="text-gray-400 mb-4">{singleHall.description}</div>
            <div className="mb-4">Capacity: <b>{singleHall.capacity}</b> | Price: <b>{singleHall.price}</b></div>
            {singleHall.images && singleHall.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {singleHall.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={`http://localhost:5000/${img.replace(/\\/g, '/').replace(/^uploads\//, 'uploads/')}`}
                    alt="hall"
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </OwnerLayout>
  );
};

export default HallDetail; 