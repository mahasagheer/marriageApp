import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHalls, associateManager } from '../slice/hallSlice';
import OwnerSidebar from '../Components/OwnerSidebar';
import { Button } from '../Components/Layout/Button';
import { Input } from '../Components/Layout/Input';
import OwnerLayout from '../Components/OwnerLayout';
import { FiEdit, FiUserPlus } from 'react-icons/fi';

function getInitials(name) {
  if (!name) return '';
  const parts = name.split(' ');
  return parts.length === 1 ? parts[0][0] : parts[0][0] + parts[1][0];
}

const AssignedManagerPage = () => {
  const dispatch = useDispatch();
  const { halls, loading, error, success } = useSelector(state => state.halls);
  const [managers, setManagers] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [hallId, setHallId] = useState('');
  const [managerId, setManagerId] = useState('');
  const [department, setDepartment] = useState('');
  const [tasks, setTasks] = useState('');
  const [fetchingManagers, setFetchingManagers] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    dispatch(fetchHalls());
  }, [dispatch]);

  useEffect(() => {
    setFetchingManagers(true);
    fetch('/api/users?role=manager')
      .then(res => res.json())
      .then(data => {
        setManagers(data.users || []);
        setFetchingManagers(false);
      })
      .catch(() => {
        setFetchError('Failed to fetch managers');
        setFetchingManagers(false);
      });
  }, []);

  const handleAssignClick = (hall) => {
    setHallId(hall._id);
    setShowPanel(true);
    setManagerId('');
    setDepartment('');
    setTasks('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(associateManager({
      hallId,
      managerId,
      department,
      tasks: tasks.split(',').map(t => t.trim()).filter(Boolean)
    }));
  };

  return (
    <>
     <OwnerLayout>
      <main className="p-2 sm:p-4 md:p-6 md:mt-0 sm:mt-[5%] mt-[15%]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-marriageHotPink">Assigned Managers</h1>
          {/**  <p className="text-gray-500 text-sm">Manage manager assignments for all halls.</p> */}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-gray-600 text-sm bg-gray-50">
                <th className="py-2 px-4 text-left">Hall Name</th>
                <th className="py-2 px-4 text-left">Managers</th>
                <th className="py-2 px-4 text-left">Department</th>
                <th className="py-2 px-4 text-left">Tasks</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {halls.map(hall => (
                <tr key={hall._id} className="border-b last:border-b-0">
                  <td className="py-2 px-4 font-medium text-gray-800">{hall.name}</td>
                  <td className="py-2 px-4">
                    {(hall.managers && hall.managers.length > 0) ? hall.managers.map((m, idx) => (
                      <span key={m.manager?._id || idx}>
                        {m.manager?.name || '-'}
                        {idx < hall.managers.length - 1 ? ', ' : ''}
                      </span>
                    )) : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="py-2 px-4">
                    {(hall.managers && hall.managers.length > 0) ? hall.managers.map((m, idx) => (
                      <span key={idx} className="block text-gray-700 text-sm">{m.department}</span>
                    )) : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="py-2 px-4">
                    {(hall.managers && hall.managers.length > 0) ? hall.managers.map((m, idx) => (
                      <span key={idx} className="block text-gray-700 text-sm">{(m.tasks || []).join(', ')}</span>
                    )) : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="py-2 px-4">
                    {(hall.managers && hall.managers.length > 0) ? (
                      <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Assigned</span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">Unassigned</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <Button
                      size="sm"
                      padding='rounded-full p-2'
                      onClick={() => handleAssignClick(hall)}
                      btnText={hall.managers && hall.managers.length > 0 ? <FiEdit/> : <FiUserPlus/>}
                    >
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Assign Manager Panel */}
        {showPanel && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
              <button onClick={() => setShowPanel(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
              <h2 className="text-xl font-bold mb-4 text-gray-800">Assign Manager</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Select Hall</label>
                  <select
                    value={hallId}
                    onChange={e => setHallId(e.target.value)}
                    required
                    className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select a hall</option>
                    {halls.map(hall => (
                      <option key={hall._id} value={hall._id}>{hall.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Select Manager</label>
                  {fetchingManagers ? (
              <div className="loader"></div>
            ) : (
                    <select
                    value={managerId}
                    onChange={e => setManagerId(e.target.value)}
                    required
                    className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select a manager</option>
                    {managers.map(m => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                  )}
                  {fetchError && <div className="text-red-500 text-sm mt-1">{fetchError}</div>}
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Department</label>
                  <Input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    required
                    placeholder="Department"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Tasks (comma separated)</label>
                  <Input
                    type="text"
                    value={tasks}
                    onChange={e => setTasks(e.target.value)}
                    placeholder="e.g. Booking, Customer Support"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                  btnText={loading ? 'Assigning...' : 'Assign Manager'}
                />
                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                {success && <div className="text-green-600 text-sm mt-2">Manager associated successfully!</div>}
              </form>
            </div>
          </div>
        )}
      </main>
      </OwnerLayout>

      </>
  );
};

export default AssignedManagerPage; 