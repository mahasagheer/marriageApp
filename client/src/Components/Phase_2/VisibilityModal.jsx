import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { getSuccessfullyPaidUsers } from "../../slice/userProfile";
import { createVisibilty, getVisibility } from "../../slice/profileVisibilitySlice";

export default function PaidUsersVisibilityModal({ agencyId, targetUserId, onClose }) {
    const [profiles, setProfiles] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    const [targetUser, setTargetUser] = useState({})

    useEffect(() => {
        async function fetchPaidProfiles() {
            try {
                const res = await dispatch(getSuccessfullyPaidUsers(agencyId)).unwrap();
    
                const filteredProfiles = res.profiles.filter(
                    (profile) => profile.userId !== targetUserId
                );
                const targetedProfile = res.profiles.find(
                    (profile) => profile.userId === targetUserId
                );
    
                if (!targetedProfile) {
                    toast.error("User's payment is pending");
                    onClose();
                    return;
                }
    
                setTargetUser(targetedProfile);
                setProfiles(filteredProfiles);
    
                const visibilityRes = await dispatch(getVisibility({
                    agencyId,
                    userId: targetedProfile._id, // 👈 MongoDB _id
                })).unwrap();
    
                const trueSelected = Object.entries(visibilityRes.visibility || {})
                    .filter(([_, canSee]) => canSee === true)
                    .map(([toUserId]) => toUserId);
    
                setSelectedUsers(trueSelected); // 👈 Pre-select checkboxes
            } catch (err) {
                console.error(err);
                toast.error("Failed to load paid user profiles.");
            }
        }
    
        fetchPaidProfiles();
    }, [agencyId]);
    

    const toggleSelect = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            for (let toUserId of selectedUsers) {
                const visibilityData = {
                    fromUserId: targetUser?._id,
                    toUserId,
                    canSee: true,
                }
                await dispatch(createVisibilty({ agencyId, visibilityData })).then((res) => {
                    console.log(res)
                })
                // await axios.post(`/api/visibility/update/${agencyId}`, );
            }

            toast.success("Visibility updated successfully.");
            onClose();
        } catch (err) {
            toast.error("Failed to update visibility.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-2xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">
                    Select Profiles Visible to User
                </h3>

                {profiles.length === 0 ? (
                    <p className="text-gray-500">No paid profiles found.</p>
                ) : (
                    <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
                        {profiles.map((profile) => (
                            <label
                                key={profile._id}
                                className="flex items-center gap-2 border p-2 rounded cursor-pointer dark:bg-gray-800 dark:text-white"
                            >
                                <input
                                    type="checkbox"
                                    value={profile._id}
                                    checked={selectedUsers.includes(profile._id)}
                                    onChange={() => toggleSelect(profile._id)}
                                />
                                <span>{profile.name}, {profile.age}, {profile.education}</span>
                            </label>
                        ))}
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`px-4 py-2 rounded ${loading
                            ? "bg-gray-400"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
