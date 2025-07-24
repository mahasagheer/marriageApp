import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiMapPin, FiUsers, FiDollarSign, FiEdit2, FiMessageCircle, FiPhone, FiSettings } from "react-icons/fi";
import { Button } from "../Components/Layout/Button";
import AddHallModal from "../Components/AddHallModal";
import EditHallModal from "../Components/EditHallModal";
import { useDispatch, useSelector } from "react-redux";
import { addHall, resetSuccess, fetchHalls, changeHallStatus, updateHall, fetchManagerHalls } from "../slice/hallSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OwnerHalls = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusModalHall, setStatusModalHall] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
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

  const handleStatusChange = (id, status) => {
    dispatch(changeHallStatus({ id, status }));
  };

  const handleEdit = (hall) => {
    setSelectedHall(hall);
    setEditModalOpen(true);
  };

  const handleUpdateHall = (formData) => {
    if (!selectedHall) return;
    dispatch(updateHall({ id: selectedHall._id, hallData: formData }));
  };

  const openStatusModal = (hall) => {
    setStatusModalHall(hall);
    setSelectedStatus(hall.status);
    setStatusModalOpen(true);
  };
  const closeStatusModal = () => {
    setStatusModalOpen(false);
    setStatusModalHall(null);
    setSelectedStatus('');
  };
  const handleStatusModalSubmit = (e) => {
    e.preventDefault();
    if (statusModalHall && selectedStatus && selectedStatus !== statusModalHall.status) {
      dispatch(changeHallStatus({ id: statusModalHall._id, status: selectedStatus }));
    }
    closeStatusModal();
  };

  return (
    <div className="p-2 sm:p-4 md:p-6  md:mt-0 sm:mt-[5%] mt-[15%]">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className="flex flex-row sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
        <h2 className="text-3xl font-bold text-marriageHotPink">My Halls</h2>
        <Button
          btnText={
            <span className="flex items-center gap-2">
              <FiPlus className="text-xl" /> Hall
            </span>
          }
          btnColor="marriageHotPink"
          padding="w-auto px-6 py-3"
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
      {statusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs animate-fadeInUp border-2 border-marriagePink">
            <h3 className="text-lg font-bold text-marriageHotPink mb-4 text-center">Change Hall Status</h3>
            <form onSubmit={handleStatusModalSubmit} className="flex flex-col gap-4">
              <select
                className="w-full p-2 rounded-lg border border-marriagePink focus:ring-2 focus:ring-marriageHotPink text-gray-800 bg-marriagePink/10"
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="open">Open</option>
              </select>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition"
                  onClick={closeStatusModal}
                >Cancel</button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-marriageHotPink text-white font-bold hover:bg-marriagePink transition"
                  disabled={selectedStatus === statusModalHall?.status}
                >Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Halls List */}
      <div className="flex flex-col gap-4 sm:gap-6">
        {loading ? (
              <div className="loader"></div>
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
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${hall.status === 'active' ? 'bg-green-100 text-green-700' : hall.status === 'closed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{hall.status}</span>
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
                  <button
                    className="p-2 rounded-full bg-marriagePink/10 text-marriageHotPink hover:bg-marriagePink transition ml-2"
                    title="Change Status"
                    onClick={e => { e.stopPropagation(); openStatusModal(hall); }}
                  >
                    <FiSettings className="text-lg" />
                  </button>
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