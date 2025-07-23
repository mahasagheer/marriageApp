import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSingleHall } from "../slice/hallSlice";
import { fetchMenusByHall, createMenu, updateMenu, deleteMenu, resetSuccess as resetMenuSuccess, changeMenuStatus } from "../slice/menuSlice";
import { fetchDecorationsByHall, createDecoration, updateDecoration, deleteDecoration, resetSuccess as resetDecorationSuccess, changeDecorationStatus } from "../slice/decorationSlice";
import AddMenuModal from "../Components/AddMenuModal";
import EditMenuModal from "../Components/EditMenuModal";
import AddDecorationModal from "../Components/AddDecorationModal";
import EditDecorationModal from "../Components/EditDecorationModal";
import { FiMapPin, FiUsers, FiDollarSign, FiCheckCircle, FiPlus, FiEdit2, FiTrash2, FiX, FiPhone, FiSettings } from "react-icons/fi";
import OwnerLayout from "../Components/OwnerLayout";
import { Button } from "../Components/Layout/Button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HallDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleHall, loading, error } = useSelector((state) => state.halls);
  const { menus, loading: menuLoading, success: menuSuccess, error: menuError } = useSelector((state) => state.menus);
  const { decorations, loading: decorationLoading, success: decorationSuccess, error: decorationError } = useSelector((state) => state.decorations);
  
  const [addMenuModalOpen, setAddMenuModalOpen] = useState(false);
  const [editMenuModalOpen, setEditMenuModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  
  const [addDecorationModalOpen, setAddDecorationModalOpen] = useState(false);
  const [editDecorationModalOpen, setEditDecorationModalOpen] = useState(false);
  const [selectedDecoration, setSelectedDecoration] = useState(null);

  const [imagePreview, setImagePreview] = useState({ open: false, src: null });
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusModalType, setStatusModalType] = useState(null); // 'menu' or 'decoration'
  const [statusModalItem, setStatusModalItem] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);
  useEffect(() => {
    if (id) {
      dispatch(fetchSingleHall(id));
      dispatch(fetchMenusByHall(id));
      dispatch(fetchDecorationsByHall(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (menuSuccess) {
      setAddMenuModalOpen(false);
      setEditMenuModalOpen(false);
      setSelectedMenu(null);
      toast.success(selectedMenu ? 'Menu updated successfully!' : 'Menu added successfully!');
      setTimeout(() => {
        dispatch(resetMenuSuccess());
      }, 2000);
    }
  }, [menuSuccess, dispatch, selectedMenu]);

  useEffect(() => {
    if (decorationSuccess) {
      setAddDecorationModalOpen(false);
      setEditDecorationModalOpen(false);
      setSelectedDecoration(null);
      toast.success(selectedDecoration ? 'Decoration updated successfully!' : 'Decoration added successfully!');
      setTimeout(() => {
        dispatch(resetDecorationSuccess());
      }, 2000);
    }
  }, [decorationSuccess, dispatch, selectedDecoration]);

  useEffect(() => {
    if (menuError) {
      toast.error(menuError);
    }
  }, [menuError]);

  useEffect(() => {
    if (decorationError) {
      toast.error(decorationError);
    }
  }, [decorationError]);

  const handleAddMenu = (menuData) => {
    dispatch(createMenu(menuData));
  };

  const handleEditMenu = (menu) => {
    setSelectedMenu(menu);
    setEditMenuModalOpen(true);
  };

  const handleUpdateMenu = (menuData) => {
    if (!selectedMenu) return;
    dispatch(updateMenu({ menuId: selectedMenu._id, menuData }));
  };

  const handleDeleteMenu = (menuId) => {
    if (window.confirm("Are you sure you want to delete this menu?")) {
      dispatch(deleteMenu(menuId));
    }
  };

  const handleAddDecoration = (decorationData) => {
    dispatch(createDecoration(decorationData));
  };

  const handleEditDecoration = (decoration) => {
    setSelectedDecoration(decoration);
    setEditDecorationModalOpen(true);
  };

  const handleUpdateDecoration = (decorationData) => {
    if (!selectedDecoration) return;
    dispatch(updateDecoration({ decorationId: selectedDecoration._id, decorationData }));
  };

  const handleDeleteDecoration = (decorationId) => {
    if (window.confirm("Are you sure you want to delete this decoration package?")) {
      dispatch(deleteDecoration(decorationId));
    }
  };

  const openStatusModal = (type, item) => {
    setStatusModalType(type);
    setStatusModalItem(item);
    setSelectedStatus(item.status);
    setStatusModalOpen(true);
  };
  const closeStatusModal = () => {
    setStatusModalOpen(false);
    setStatusModalType(null);
    setStatusModalItem(null);
    setSelectedStatus('');
  };
  const handleStatusModalSubmit = (e) => {
    e.preventDefault();
    if (!statusModalItem || !selectedStatus || selectedStatus === statusModalItem.status) return;
    if (statusModalType === 'menu') {
      dispatch(changeMenuStatus({ menuId: statusModalItem._id, status: selectedStatus }));
    } else if (statusModalType === 'decoration') {
      dispatch(changeDecorationStatus({ decorationId: statusModalItem._id, status: selectedStatus }));
    }
    closeStatusModal();
  };

  return (
    <OwnerLayout>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className="px-4 sm:px-6 lg:px-8 py-6 md:mt-0 sm:mt-[5%] mt-[15%]">
      {loading ? (
              <div className="loader"></div>
            ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : singleHall ? (
          <div className="space-y-6">
            {/* Hall Details */}
            <div className="bg-white rounded-xl shadow p-6">
              {/* Image Gallery */}
              {singleHall.images && singleHall.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {singleHall.images.slice(0, 6).map((img, idx) => (
                    <img
                      key={idx}
                      src={`http://localhost:5000/${img.replace(/\\/g, '/').replace(/^uploads\//, 'uploads/')}`}
                      alt="hall"
                      className="w-full h-40 object-cover rounded-lg border cursor-pointer hover:shadow-lg transition"
                      onClick={() => setImagePreview({ open: true, src: `http://localhost:5000/${img.replace(/\\/g, '/').replace(/^uploads\//, 'uploads/')}` })}
                    />
                  ))}
                </div>
              )}
              {/* Image Preview Modal */}
              {imagePreview.open && (
               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 px-4">
               <div className="relative w-full max-w-3xl flex flex-col items-center">
                 <button
                   onClick={() => setImagePreview({ open: false, src: null })}
                   className="absolute top-2 right-2 text-marriageRed text-3xl font-bold hover:text-marriageHotPink z-10"
                 >
                   <FiX />
                 </button>
                 <img
                   src={imagePreview.src}
                   alt="Preview"
                   className="max-h-[80vh] w-full object-contain rounded-xl shadow-lg border"
                 />
               </div>
             </div>
             
              )}
              {/* Hall Title & Location */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div>
                  <h2 className="text-3xl font-bold text-marriageHotPink mb-1 font-mono">{singleHall.name}</h2>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <FiMapPin className="mr-1" /> {singleHall.location}
                  </div>
                  {singleHall.phone && (
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <FiPhone className="mr-1" /> 
                      <span>{singleHall.phone}</span>
                      <button
                        onClick={() => window.open(`tel:${singleHall.phone}`)}
                        className="ml-2 text-marriageHotPink hover:text-marriageHotPink/80 font-semibold"
                      >
                        Call Now
                      </button>
                    </div>
                  )}
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
<div className="text-gray-700 mb-6 text-sm sm:text-base md:text-base">
  {singleHall.description ? (
    <div>
      {singleHall.description.length > 250 ? (
        <>
          <span>
            {showFullDescription 
              ? singleHall.description.split('\n').map((line, idx) => (
                  <span key={idx}>
                    {line}
                    <br />
                  </span>
                ))
              : `${singleHall.description.substring(0, 250)}...`}
          </span>
          <button 
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-marriageHotPink text-base hover:text-marriagePink font-semibold ml-1 focus:outline-none"
          >
            {showFullDescription ? 'Show Less' : 'Show More'}
          </button>
        </>
      ) : (
        <span>
          {singleHall.description.split('\n').map((line, idx) => (
            <span key={idx}>
              {line}
              <br />
            </span>
          ))}
        </span>
      )}
    </div>
  ) : (
    <span className="italic text-gray-400">No description provided for this hall.</span>
  )}
</div>
              {/* Facilities Section */}
              {singleHall.facilities && singleHall.facilities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Facilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {singleHall.facilities.map((facility, idx) => (
                      <span key={idx} className="inline-flex items-center gap-2 bg-marriagePink/10 text-marriageHotPink px-4 py-2 rounded-full text-sm font-semibold">
                        <FiCheckCircle className="text-green-500" /> {facility}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Menu Section */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <FiUsers className="text-marriageHotPink" /> Menu Packages
                </h3>
                <Button
                  btnText={<span className="flex items-center gap-2"><FiPlus />Menu</span>}
                  btnColor="marriageHotPink"
                  padding="px-6 py-3"
                  onClick={() => setAddMenuModalOpen(true)}
                />
              </div>
              {menuLoading ? (
              <div className="loader"></div>
            ) : menus.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No menus added yet. Add your first menu package!
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {menus.map((menu) => (
                    <div key={menu._id} className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl font-semibold">{menu.name}</h4>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${menu.status === 'active' ? 'bg-green-100 text-green-700' : menu.status === 'closed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{menu.status}</span>
                        </div>
                        <span className="text-lg font-bold text-marriageHotPink">{menu.basePrice} PKR</span>
                      </div>
                      <div className="mb-2">
                        <span className="block text-gray-500 font-medium mb-1">Items:</span>
                        <ul className="flex flex-wrap gap-2">
                          {menu.items.map((item, idx) => (
                            <li key={idx} className="bg-gray-100 rounded-full px-3 py-1 text-sm">{item}</li>
                          ))}
                        </ul>
                      </div>
                      {menu.addOns?.length > 0 && (
                        <div className="mb-2">
                          <span className="block text-gray-500 font-medium mb-1">Add-ons:</span>
                          <ul className="flex flex-wrap gap-2">
                            {menu.addOns.map((addon, idx) => (
                              <li key={idx} className="bg-marriagePink/10 text-marriageHotPink rounded-full px-3 py-1 text-sm">
                                {addon.name} (+{addon.price} PKR)
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="flex gap-2 mt-4">
                        <Button btnText={<FiEdit2 />}  padding="px-3 py-2" onClick={() => handleEditMenu(menu)} />
                        <button
                          className="p-2 rounded-full bg-marriagePink/10 text-marriageHotPink hover:bg-marriagePink transition ml-2"
                          title="Change Status"
                          onClick={() => openStatusModal('menu', menu)}
                        >
                          <FiSettings className="text-lg" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Decoration Section */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <FiCheckCircle className="text-marriageHotPink" /> Decoration Packages
                </h3>
                <Button
                  btnText={<span className="flex items-center gap-2"><FiPlus />Decoration</span>}
                  btnColor="marriageHotPink"
                  padding="px-6 py-3"
                  onClick={() => setAddDecorationModalOpen(true)}
                />
              </div>
              {decorationLoading ? (
              <div className="loader"></div>
            ) : decorations.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No decoration packages added yet. Add your first decoration package!
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {decorations.map((decoration) => (
                    <div key={decoration._id} className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl font-semibold">{decoration.name}</h4>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${decoration.status === 'active' ? 'bg-green-100 text-green-700' : decoration.status === 'closed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{decoration.status}</span>
                        </div>
                        <span className="text-lg font-bold text-marriageHotPink">{decoration.price} PKR</span>
                      </div>
                      {decoration.addOns?.length > 0 && (
                        <div className="mb-2">
                          <span className="block text-gray-500 font-medium mb-1">Add-ons:</span>
                          <ul className="flex flex-wrap gap-2">
                            {decoration.addOns.map((addon, idx) => (
                              <li key={idx} className="bg-marriagePink/10 text-marriageHotPink rounded-full px-3 py-1 text-sm">
                                {addon.name} (+{addon.price} PKR)
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="flex gap-2 mt-4">
                        <Button btnText={<FiEdit2 />}  padding="px-3 py-2" onClick={() => handleEditDecoration(decoration)} />
                        <button
                          className="p-2 rounded-full bg-marriagePink/10 text-marriageHotPink hover:bg-marriagePink transition ml-2"
                          title="Change Status"
                          onClick={() => openStatusModal('decoration', decoration)}
                        >
                          <FiSettings className="text-lg" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Menu Modals */}
        <AddMenuModal 
          open={addMenuModalOpen} 
          onClose={() => setAddMenuModalOpen(false)} 
          onSubmit={handleAddMenu}
          hallId={id}
        />
        <EditMenuModal
          open={editMenuModalOpen}
          onClose={() => setEditMenuModalOpen(false)}
          onSubmit={handleUpdateMenu}
          initialValues={selectedMenu}
        />

        {/* Decoration Modals */}
        <AddDecorationModal 
          open={addDecorationModalOpen} 
          onClose={() => setAddDecorationModalOpen(false)} 
          onSubmit={handleAddDecoration}
          hallId={id}
        />
        <EditDecorationModal
          open={editDecorationModalOpen}
          onClose={() => setEditDecorationModalOpen(false)}
          onSubmit={handleUpdateDecoration}
          initialValues={selectedDecoration}
        />

        {statusModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs animate-fadeInUp border-2 border-marriagePink">
              <h3 className="text-lg font-bold text-marriageHotPink mb-4 text-center">Change Status</h3>
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
                    disabled={selectedStatus === statusModalItem?.status}
                  >Update</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </OwnerLayout>
  );
};

export default HallDetail; 