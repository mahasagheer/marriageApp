import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchSessions } from '../../slice/AgencyChatSlice';
import { useDispatch } from 'react-redux';
import AgencyChat from './AgencyChat';
import { FiX } from 'react-icons/fi';
import { Button } from '../../Components/Layout/Button';

function AgencyCandidateList() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch()
    const [showChat, setShowChat] = useState(false);
    const [userId, setUserId] = useState("")
    const { user } = useAuth();
    const agencyId = user?.id;


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
    //   if (candidates?.length>0) return <div className="ml-[14rem] p-4 text-gray-600">No users have messaged you yet.</div>;

    return (
        <div className="p-6 ml-[14rem] max-w-[90vw] mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Matchmaking Requests</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 shadow-sm overflow-hidden rounded-xl">
                    <thead className="bg-marriagePink">
                        <tr className="rounded-t-xl">
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates?.map((session, index) => (
                            <tr
                                key={session._id}
                                className={`border-t border-gray-200 ${index === candidates.length - 1 ? 'rounded-b-xl' : ''}`
                                }
                            >
                                <td className="px-6 py-3 text-sm text-gray-700">{index + 1}</td>
                                <td className="px-6 py-3 text-sm text-gray-800 font-medium">
                                    {session.userId?.name || 'N/A'}
                                </td>
                                <td className="px-6 py-3 text-sm text-gray-700">
                                    {session.userId?.email || 'N/A'}
                                </td>
                                <td className="px-6 py-3 text-sm flex ">
                                    <Button
                                        onClick={() => toggleChat(session?.userId?._id)}
                                        btnText={'Open Chat'}
                                    />
                                    {Number(session?.unreadCount) > 0 && (
                                        <>


                                            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                                                {session.unreadCount}
                                            </span>
                                        </>
                                    )}

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
                    <div className="bg-white rounded-3xl my-2 shadow-2xl border-2 border-marriagePink p-0 flex flex-col relative h-[90vh] w-[80vw] max-w-[700px]">
                        <div className="flex-1 flex flex-col w-full bg-gradient-to-br from-white via-marriagePink/10 to-marriagePink/5">
                            <AgencyChat isAgency={user?.role === 'agency'} agencyId={agencyId} userId={userId} />
                        </div>
                    </div>
                </div>

            )}
        </div>
    );
}

export default AgencyCandidateList;