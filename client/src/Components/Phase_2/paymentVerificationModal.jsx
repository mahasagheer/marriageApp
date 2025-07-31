import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  fetchPaymentById,
  sendMessage,
  updatePaymentStatus,
} from "../../slice/AgencyChatSlice";
import { toast } from "react-toastify";
import { Button } from "../Layout/Button";

export const PaymentVerificationModal = ({
  payment,
  onClose,
  selectedSession,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState({ verify: false, reject: false });

  const paymentId = payment?.formData?.paymentId;
  const proofImage = payment?.formData?.proofImage;
  const showImage = proofImage ? `http://localhost:5000/${proofImage}` : null;

  useEffect(() => {
    if (!paymentId) return;
    dispatch(fetchPaymentById(paymentId))
      .unwrap()
      .then((res) => {
        if (["verified", "rejected"].includes(res.status)) {
          toast.error("Payment verification already done");
          onClose();
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch payment status");
      });
  }, [dispatch, paymentId, onClose]);

  const capitalize = (str) => str?.charAt(0).toUpperCase() + str.slice(1) || "";

  const handleVerification = async (status) => {
    const isVerify = status === "verified";
    setLoading((prev) => ({ ...prev, [isVerify ? "verify" : "reject"]: true }));

    if (!paymentId) {
      toast.error("Payment ID is missing!");
      return;
    }

    try {
      const res = await dispatch(updatePaymentStatus({ paymentId, status }));
      if (res.payload) {
        const statusText =
          status === "verified"
            ? "Thank you! Your payment has been successfully verified. We will proceed with the next steps shortly."
            : "Unfortunately, your payment could not be verified. Please review the details and try again.";

        await dispatch(
          sendMessage({
            sessionId: selectedSession._id,
            sender: "agency",
            text: statusText,
          })
        );

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

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-md p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Verify Payment</h2>

        {showImage ? (
          <div className="mb-3 text-sm text-gray-700 dark:text-gray-300 space-y-1">
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
          <Button
            onClick={() => handleVerification("rejected")}
            disabled={loading.reject || loading.verify}
            btnText={loading.reject ? "Rejecting..." : "Reject"}
            btnColor='bg-marriageHotPink'
            textColor='text-white'
          />
          <Button
            onClick={() => handleVerification("verified")}
            disabled={loading.verify || loading.reject}
             btnColor='bg-green-600'
            textColor='text-white'
            hoverColor='bg-green-700'
            btnText={loading.verify ? "Verifying..." : "Verify"}
          />
          <Button
            onClick={onClose}
            disabled={loading.verify || loading.reject}
            btnColor='dark:bg-gray-700 bg-gray-200'
            textColor='text-gray-800 dark:text-white'
                    hoverColor='bg-gray-800'
                    btnText={'Cancel'}
            // className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-60"
         />
        </div>
      </div>
    </div>
  );
};
