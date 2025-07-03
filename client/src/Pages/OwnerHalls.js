import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { Button } from "../components/Layout/Button";
import AddHallModal from "../components/AddHallModal";
import { useDispatch, useSelector } from "react-redux";
import { addHall, resetSuccess, fetchHalls, deleteHall } from "../slice/hallSlice";

const OwnerHalls = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, success, halls } = useSelector((state) => state.halls);

  useEffect(() => {
    dispatch(fetchHalls());
  }, [dispatch]);

  const handleAddHall = (formData) => {
    dispatch(addHall(formData));
  };

  useEffect(() => {
    if (success) {
      setModalOpen(false);
      setTimeout(() => {
        dispatch(resetSuccess());
        dispatch(fetchHalls());
      }, 2000);
    }
  }, [success, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this hall?")) {
      dispatch(deleteHall(id));
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 font-serif">My Halls</h2>
        <Button
          btnText={
            <span className="flex items-center gap-2">
              <FiPlus className="text-xl" /> Add Hall
            </span>
          }
          btnColor="marriageHotPink"
          padding="w-full sm:w-auto px-6 py-3"
          onClick={() => setModalOpen(true)}
        />
      </div>
      <AddHallModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAddHall} />
      {success && (
        <div className="mb-4 text-green-600 text-center font-semibold">Hall added successfully!</div>
      )}
      {error && (
        <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>
      )}
      {/* Halls List */}
      <div className="grid gap-6">
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : halls.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
            No halls added yet.
          </div>
        ) : (
          halls.map((hall) => (
            <div key={hall._id} className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-lg font-bold text-marriageHotPink">{hall.name}</div>
                <div className="text-gray-500">{hall.location}</div>
                <div className="text-gray-400 text-sm">{hall.description}</div>
                <div className="text-gray-600 text-sm mt-1">
                  Capacity: {hall.capacity} | Price: {hall.price}
                </div>
              </div>
              <Button
                btnText={
                  <span className="flex items-center gap-2">
                    <FiTrash2 /> Delete
                  </span>
                }
                btnColor="marriageRed"
                padding="px-6 py-2"
                onClick={() => handleDelete(hall._id)}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default OwnerHalls; 