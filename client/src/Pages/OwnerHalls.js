import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiMapPin, FiUsers, FiDollarSign, FiEdit2, FiMessageCircle, FiPhone } from "react-icons/fi";
import { Button } from "../Components/Layout/Button";
import AddHallModal from "../Components/AddHallModal";
import EditHallModal from "../Components/EditHallModal";
import { useDispatch, useSelector } from "react-redux";
import { addHall, resetSuccess, fetchHalls, deleteHall, updateHall, fetchManagerHalls } from "../slice/hallSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OwnerHalls = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);
  const dispatch = useDispatch();
  const { loading, error, success, halls } = useSelector((state) => state.halls);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    dispatch(fetchHalls());
  }, [dispatch]);

  const handleAddHall = (formData) => {
    dispatch(addHall(formData));
  };

  useEffect(() => {
    if (success) {
      setModalOpen(false);
      setEditModalOpen(false);
      setSelectedHall(null);
      toast.success(selectedHall ? 'Hall updated successfully!' : 'Hall added successfully!');
      setTimeout(() => {
        dispatch(resetSuccess());
        dispatch(fetchHalls());
      }, 2000);
    }
  }, [success, dispatch, selectedHall]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this hall?")) {
      dispatch(deleteHall(id));
    }
  };

  const handleEdit = (hall) => {
    setSelectedHall(hall);
    setEditModalOpen(true);
  };

  const handleUpdateHall = (formData) => {
    if (!selectedHall) return;
    dispatch(updateHall({ id: selectedHall._id, hallData: formData }));
  };

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-marriageHot font-bold text-gray-800 font-mono">My Halls</h2>
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
      {/* Filter Bar */}
      <AddHallModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAddHall} />
      <EditHallModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleUpdateHall}
        initialValues={selectedHall}
      />
      {/* Halls List */}
      <div className="flex flex-col gap-4 sm:gap-6">
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : halls.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 sm:p-8 text-center text-gray-400">
            No halls added yet.
          </div>
        ) : (
          halls.map((hall) => (
            <div 
              key={hall._id} 
              className="flex flex-col md:flex-row bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/${user.role}/halls/${hall._id}`)}
            >
              {/* Hall Image */}
              <div className="md:w-56 w-full h-40 md:h-auto flex-shrink-0 bg-gray-200 flex items-center justify-center">
                {/* Show first hall image if available, else placeholder */}
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
              <div className="flex-1 flex flex-col md:flex-row md:items-center p-4 gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">{hall.name}</span>
                    <span className="ml-2 text-xs text-green-600 font-semibold">Active</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-xs sm:text-sm mb-2">
                    <FiMapPin className="mr-1" /> {hall.location}
                  </div>
                  <div className="text-gray-600 text-xs sm:text-sm mb-2">
                    {hall.description && hall.description.length > 250 
                      ? `${hall.description.substring(0, 100)}...` 
                      : hall.description}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-500 text-xs mb-2">
                    <span className="flex items-center gap-1"><FiUsers /> {hall.capacity || 0} Guests</span>
                    <span className="flex items-center gap-1"><FiDollarSign /> {hall.price || 0} PKR</span>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex flex-row md:flex-col gap-2 md:items-end md:justify-between min-w-[100px] sm:min-w-[120px] mt-2 md:mt-0">
                  <Button
                    btnText={<span className="flex items-center gap-2"><FiEdit2 className="text-marriageHotPink" /></span>}
                    btnColor="marriagePink"
                    padding="px-2 py-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(hall);
                    }}
                  />
                  <Button
                    btnText={
                      <span className="flex items-center gap-2 rounded-full bg-marriageRed/10 p-2">
                        <FiTrash2 />
                      </span>
                    }
                    btnColor="marriageRed"
                    padding="px-2 py-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(hall._id);
                    }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OwnerHalls; 