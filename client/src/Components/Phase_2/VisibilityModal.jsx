import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { getSuccessfullyPaidUsers } from "../../slice/userProfile";
import { createVisibilty, getVisibility } from "../../slice/profileVisibilitySlice";
import { Button } from "../Layout/Button";

export default function PaidUsersVisibilityModal({ agencyId, targetUserId, onClose }) {
    const [profiles, setProfiles] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    const [targetUser, setTargetUser] = useState({})
    const [initialSelectedUsers, setInitialSelectedUsers] = useState([]); // 👈

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
                    userId: targetedProfile._id,
                })).unwrap();
    
                const trueSelected = Object.entries(visibilityRes.visibility || {})
                    .filter(([_, canSee]) => canSee === true)
                    .map(([toUserId]) => toUserId);
    
                setSelectedUsers(trueSelected);
                setInitialSelectedUsers(trueSelected); // 👈 Save initial state
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
            const additions = selectedUsers.filter((id) => !initialSelectedUsers.includes(id));
            const removals = initialSelectedUsers.filter((id) => !selectedUsers.includes(id));
    
            const updates = [...additions.map((toUserId) => ({
                fromUserId: targetUser?._id,
                toUserId,
                canSee: true,
            })), ...removals.map((toUserId) => ({
                fromUserId: targetUser?._id,
                toUserId,
                canSee: false,
            }))];
    
            for (const visibilityData of updates) {
                await dispatch(createVisibilty({ agencyId, visibilityData }));
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
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-2xl shadow-lg">
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
                    <Button
                        onClick={onClose}
                        btnText={"Cancel"}
                        btnColor='dark:bg-gray-700 bg-gray-200'
                        textColor='text-gray-800 dark:text-white'
                        hoverColor='bg-gray-800'
                    />
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        btnText={loading ? "Saving..." : "Save"}
                    />
                </div>
            </div>
        </div>
    );
}
