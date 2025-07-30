import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchPaymentById, sendMessage, updatePaymentStatus } from "../../slice/AgencyChatSlice";
import { toast } from "react-toastify";

export const PaymentVerificationModal = ({ payment, onClose, selectedSession }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState({ verify: false, reject: false });
    useEffect(() => {
        if (payment?.formData?.paymentId) {
            dispatch(fetchPaymentById(payment?.formData?.paymentId))
                .unwrap()
                .then((res) => {
                    if (res.status === 'verified' || res.status === 'rejected') {
                        toast.error("Payment verification already done");
                        onClose(); // ✅ Close modal immediately
                    }
                })
                .catch((err) => {
                    toast.error("Failed to fetch payment status");
                    console.error("Fetch error:", err);
                });
        }
    }, []);
    
    const capitalize = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const handleVerification = async (status) => {
        const isVerify = status === "verified";
        setLoading((prev) => ({ ...prev, [isVerify ? "verify" : "reject"]: true }));

        try {
            const paymentId = payment?.formData?.paymentId;
            if (!paymentId) {
                toast.error("Payment ID is missing!");
                return;
            }

            const res = await dispatch(updatePaymentStatus({ paymentId, status }));
            if (res.payload) {
                const statusText = status === 'verified'
                    ? "Thank you! Your payment has been successfully verified. We will proceed with the next steps shortly."
                    : "Unfortunately, your payment could not be verified. Please review the details and try again.";

                const payload = {
                    sessionId: selectedSession._id,
                    sender: 'agency',
                    text: statusText,
                };
                dispatch(sendMessage(payload))
                toast.success(`Payment ${capitalize(status)} Successfully`);
                onClose();
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Verification error:", error);
            toast.error("An error occurred.");
        } finally {
            setLoading({ verify: false, reject: false });
        }
    };

    const proofImage = payment?.formData?.proofImage;
    const showImage = proofImage ? `http://localhost:5000/${proofImage}` : null;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Verify Payment</h2>

                {showImage ? (
                    <div className="mb-3 text-sm text-gray-700 space-y-1">
                        <p><strong>Proof Image:</strong></p>
                        <img
                            src={showImage}
                            alt="Proof"
                            className="w-full max-h-60 object-contain border rounded"
                        />
                    </div>
                ) : (
                    <p className="text-sm text-red-500">No proof image uploaded.</p>
                )}

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={() => handleVerification("rejected")}
                        disabled={loading.reject || loading.verify}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        {loading.reject ? "Rejecting..." : "Reject"}
                    </button>
                    <button
                        onClick={() => handleVerification("verified")}
                        disabled={loading.verify || loading.reject}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        {loading.verify ? "Verifying..." : "Verify"}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={loading.verify || loading.reject}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
