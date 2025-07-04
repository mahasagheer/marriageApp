import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOwnerAvailableDates, updateHallAvailableDate, addAvailableDates } from "../slice/hallSlice";
import OwnerLayout from "../components/OwnerLayout";

const MyBookings = () => {
  const dispatch = useDispatch();
  const { ownerAvailableDates, loading, error } = useSelector((state) => state.halls);
  const [editId, setEditId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [addDate, setAddDate] = useState({}); // { [hallName]: dateString }
  const [adding, setAdding] = useState({}); // { [hallName]: boolean }

  useEffect(() => {
    dispatch(fetchOwnerAvailableDates());
  }, [dispatch]);

  // Group dates by hall name and keep hallId
  const grouped = ownerAvailableDates.reduce((acc, date) => {
    const hallName = date.hall?.name || "Unknown Hall";
    const hallId = date.hall?._id;
    if (!acc[hallName]) acc[hallName] = { hallId, dates: [] };
    acc[hallName].dates.push(date);
    return acc;
  }, {});

  const handleEdit = (date) => {
    setEditId(date._id);
    setEditDate(new Date(date.date).toISOString().slice(0, 10));
  };

  const handleSave = async (dateId) => {
    setSaving(true);
    await dispatch(updateHallAvailableDate({ id: dateId, date: editDate }));
    setSaving(false);
    setEditId(null);
    setEditDate("");
    dispatch(fetchOwnerAvailableDates());
  };

  const handleAddDate = async (hallName, hallId) => {
    if (!addDate[hallName]) return;
    setAdding(prev => ({ ...prev, [hallName]: true }));
    await dispatch(addAvailableDates({ hallId, dates: addDate[hallName] }));
    setAdding(prev => ({ ...prev, [hallName]: false }));
    setAddDate(prev => ({ ...prev, [hallName]: "" }));
    dispatch(fetchOwnerAvailableDates());
  };

  return (
    <OwnerLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-marriageHotPink mb-6">My Hall Booking Dates</h2>
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center text-gray-400">No available dates found.</div>
        ) : (
          Object.entries(grouped).map(([hallName, { hallId, dates }]) => (
            <div key={hallName} className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{hallName}</h3>
              <div className="flex items-center mb-4 gap-2">
                <input
                  type="date"
                  value={addDate[hallName] || ""}
                  onChange={e => setAddDate(prev => ({ ...prev, [hallName]: e.target.value }))}
                  className="border rounded px-2 py-1"
                  disabled={adding[hallName]}
                />
                <button
                  className="bg-marriageHotPink text-white px-3 py-1 rounded"
                  onClick={() => handleAddDate(hallName, hallId)}
                  disabled={adding[hallName] || !addDate[hallName]}
                >
                  {adding[hallName] ? "Adding..." : "Add Date"}
                </button>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="py-2 px-4">Date</th>
                      <th className="py-2 px-4">Status</th>
                      <th className="py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dates.map(date => (
                      <tr key={date._id}>
                        <td className="py-2 px-4">
                          {editId === date._id ? (
                            <input
                              type="date"
                              value={editDate}
                              onChange={e => setEditDate(e.target.value)}
                              className="border rounded px-2 py-1"
                              disabled={saving}
                            />
                          ) : (
                            new Date(date.date).toLocaleDateString()
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {date.isBooked ? (
                            <span className="text-red-500 font-semibold">Booked</span>
                          ) : (
                            <span className="text-green-600 font-semibold">Available</span>
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {editId === date._id ? (
                            <>
                              <button
                                className="bg-marriageHotPink text-white px-3 py-1 rounded mr-2"
                                onClick={() => handleSave(date._id)}
                                disabled={saving}
                              >
                                {saving ? "Saving..." : "Save"}
                              </button>
                              <button
                                className="bg-gray-300 text-gray-700 px-3 py-1 rounded"
                                onClick={() => { setEditId(null); setEditDate(""); }}
                                disabled={saving}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              className="bg-marriagePink text-white px-3 py-1 rounded"
                              onClick={() => handleEdit(date)}
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </OwnerLayout>
  );
};

export default MyBookings; 