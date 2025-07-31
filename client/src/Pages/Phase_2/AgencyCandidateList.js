import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchSessions } from '../../slice/AgencyChatSlice';
import { useDispatch } from 'react-redux';
import AgencyChat from './AgencyChat';
import { FiX } from 'react-icons/fi';
import { Button } from '../../Components/Layout/Button';
import { Link, useNavigate } from 'react-router-dom';
import PaidUsersVisibilityModal from '../../Components/Phase_2/VisibilityModal';
import { toast } from 'react-toastify';
import { privateProfileVisibilty, publicProfileVisibilty } from '../../slice/profileVisibilitySlice';

function AgencyCandidateList() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch()
    const [showChat, setShowChat] = useState(false);
    const [userId, setUserId] = useState("")
    const { user } = useAuth();
    const agencyId = user?.id;
    const navigate = useNavigate()
    const [openVisibilityModal, setOpenVisibilityModal] = useState(false)
    useEffect(() => {
        if (agencyId) {
            dispatch(fetchSessions({ role: 'agency', id: agencyId }))
                .unwrap()
                .then((session) => {
                    setCandidates(session);
                    setLoading(false); // ✅ update loading
                })
                .catch((err) => {
                    setError("Failed to fetch sessions");
                    setLoading(false); // ✅ also update on error
                });
        }
    }, [agencyId, dispatch]);

    const toggleChat = async (id) => {
        setUserId(id)
        setShowChat(!showChat);
    };

    if (loading) return <div className="p-4 text-gray-700">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

   
    
    return (
        <div className="p-6 ml-[3rem] max-w-[90vw] mx-auto">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">Matchmaking Requests</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full dark:bg-gray-600 bg-white border border-gray-200 shadow-sm overflow-hidden rounded-xl">
                    <thead className="dark:bg-gray-800 bg-marriagePink">
                        <tr className="rounded-t-xl">
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 ">#</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates?.map((session, index) => (
                            <tr
                                key={session._id}
                                className={`border-t border-gray-200 ${index === candidates.length - 1 ? 'rounded-b-xl' : ''}`
                                }
                            >
                                <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-400">{index + 1}</td>
                                <td className="px-6 py-3 text-sm text-gray-800  dark:text-gray-200 font-medium cursor-pointer">
                                    <Link onClick={() => {
                                        navigate(`/userDetail/${session.userId._id}`);
                                    }}>
                                        {session.userId?.name || 'N/A'}

                                    </Link>
                                </td>
                                <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-200">
                                    {session.userId?.email || 'N/A'}
                                </td>
                                <td className="px-6 py-3 text-sm flex item-center gap-2">
                                    {/* 🔹 Chat Button with Unread Count */}
                                    <div className="relative inline-block">
                                        <Button onClick={() => toggleChat(session?.userId?._id)} btnText="Open Chat" />
                                        {Number(session?.unreadCount) > 0 && (
                                            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-marriageRed rounded-full z-10">
                                                {session.unreadCount}
                                            </span>
                                        )}
                                    </div>

                                    {/* 🔹 Visibility Modal Button */}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() => {
                                                setUserId(session?.userId?._id)
                                                setOpenVisibilityModal(true)
                                            }}
                                            btnText="Set Visibility"
                                        />
                                    </div>


                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>


            </div>
            {/* Chat component */}
            {showChat && (
                <div className="fixed inset-0 min-h-screen h-screen overflow-y-auto z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn">
                    <button
                        className="absolute top-[3%] right-[18%] rounded-full text-marriageRed text-4xl font-bold hover:text-marriageHotPink z-50 flex items-center justify-center"
                        onClick={() => setShowChat(false)}
                        aria-label="Close chat"
                        style={{ width: 48, height: 48 }}
                    >
                        <FiX />
                    </button>

                    {/* Modal Container */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl my-2 shadow-2xl border-2 border-marriagePink p-0 flex flex-col relative h-[90vh] w-[80vw] max-w-[700px]">
                        <div className="flex-1 flex flex-col w-full">
                            <AgencyChat isAgency={user?.role === 'agency'} agencyId={agencyId} userId={userId} />
                        </div>
                    </div>
                </div>

            )}

            {openVisibilityModal && (
                <PaidUsersVisibilityModal
                    agencyId={agencyId}
                    targetUserId={userId}
                    onClose={() => setOpenVisibilityModal(false)}
                />
            )}
        </div>
    );
}

export default AgencyCandidateList;