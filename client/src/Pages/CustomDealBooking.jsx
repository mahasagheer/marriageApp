import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CustomDealBooking = () => {
  const { token } = useParams();
  const [deal, setDeal] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [file, setFile] = useState(null);

  // Fetch booking and payment info
  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      fetch(`/api/bookings/custom-deal/${token}`).then(res => res.json()),
      fetch(`/api/booking/public/by-token/${token}`).then(res => res.json())
    ])
      .then(([dealData, paymentData]) => {
        // Always use the booking from paymentData for status and details
        if (paymentData.booking) {
          setDeal(paymentData.booking);
        } else if (dealData.booking) {
          setDeal(dealData.booking);
        } else {
          setError(dealData.message || paymentData.message || 'Deal not found');
        }
        if (paymentData.payment) {
          setPayment(paymentData.payment);
        } else {
          setPayment(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch booking/payment info');
        setLoading(false);
      });
  }, [token, uploadSuccess]);

  const handleConfirm = async () => {
    setConfirmLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/bookings/custom-deal/${token}/confirm`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setConfirmed(true);
      } else {
        setError(data.message || 'Failed to confirm booking');
      }
    } catch (err) {
      setError('Network error');
    }
    setConfirmLoading(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadError('');
    setUploadSuccess('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !deal?._id) return;
    setUploading(true);
    setUploadError('');
    setUploadSuccess('');
    const formData = new FormData();
    formData.append('proofImage', file);
    try {
      const res = await fetch(`/api/booking/public/${deal._id}/upload-payment-proof`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadSuccess('Payment proof uploaded successfully!');
        setFile(null);
      } else {
        setUploadError(data.message || 'Failed to upload payment proof');
      }
    } catch (err) {
      setUploadError('Network error');
    }
    setUploading(false);
  };

  if (loading) return <div className="flex justify-center items-center min-h-[40vh]">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!deal) return <div className="text-center mt-8">Deal not found.</div>;

  // Debug: log deal.status
  console.log('deal.status:', deal.status, 'typeof:', typeof deal.status);

  if (confirmed) return <div className="text-green-600 text-center mt-8 text-2xl font-bold">Booking confirmed! Thank you.</div>;

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 mt-12 animate-fadeInUp">
      <h2 className="text-2xl font-bold text-marriageHotPink mb-4 text-center">Custom Deal for {deal.guestName}</h2>
      <div className="mb-4">
        <span className="font-semibold">Hall:</span> {deal.hallId?.name || '-'}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Date:</span> {deal.bookingDate ? new Date(deal.bookingDate).toLocaleDateString() : '-'}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Menu Items:</span> {deal.menuItems && deal.menuItems.length > 0 ? deal.menuItems.join(', ') : '-'}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Decoration Items:</span> {deal.decorationItems && deal.decorationItems.length > 0 ? deal.decorationItems.join(', ') : '-'}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Price:</span> {deal.price ? `Rs. ${deal.price}` : '-'}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Message:</span> {deal.message || '-'}
      </div>
      {/* Payment Section */}
      <div className="my-6 p-4 rounded-xl bg-marriagePink/10">
        <h3 className="text-lg font-bold text-marriageHotPink mb-2">Payment Instructions</h3>
        {payment ? (
          <>
            <div className="mb-2">
              <span className="font-semibold">Payment Number:</span> {payment.paymentNumber || <span className="text-gray-400">Not shared yet</span>}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Status:</span> {payment.status ? payment.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
            </div>
            {payment.proofImage && (
              <div className="mb-2">
                <span className="font-semibold">Your Uploaded Proof:</span><br />
                <img src={`/${payment.proofImage}`} alt="Payment Proof" className="max-w-xs max-h-40 rounded shadow border mt-2" />
              </div>
            )}
            {/* Upload form if payment is awaiting proof */}
            {payment.status === 'awaiting_payment' && !payment.proofImage && (
              <form onSubmit={handleUpload} className="mt-4 flex flex-col gap-2">
                <label className="font-semibold">Upload Payment Screenshot:</label>
                <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                {uploadError && <div className="text-marriageRed text-sm">{uploadError}</div>}
                {uploadSuccess && <div className="text-green-600 text-sm">{uploadSuccess}</div>}
                <button
                  type="submit"
                  className="px-4 py-2 bg-marriageHotPink text-white rounded font-bold shadow hover:bg-marriageRed transition mt-2"
                  disabled={uploading || !file}
                >
                  {uploading ? 'Uploading...' : 'Upload Proof'}
                </button>
              </form>
            )}
            {payment.status === 'awaiting_verification' && (
              <div className="text-yellow-700 font-semibold mt-2">Your payment proof is awaiting verification by the manager.</div>
            )}
            {payment.status === 'verified' && (
              <div className="text-green-700 font-semibold mt-2">Your payment has been verified! Thank you.</div>
            )}
            {payment.status === 'rejected' && (
              <div className="text-red-700 font-semibold mt-2">Your payment proof was rejected. Please contact support or re-upload.</div>
            )}
          </>
        ) : (
          <div className="text-gray-400">No payment instructions yet. Please wait for the manager to share payment details.</div>
        )}
      </div>
      {/* Confirm Booking Button (if not confirmed and not approved) */}
      {(!confirmed && deal.status !== 'approved') && (
        <button
          className="w-full mt-4 px-6 py-2 rounded-lg bg-marriageHotPink text-white font-bold shadow hover:bg-marriageRed transition text-lg disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleConfirm}
          disabled={confirmLoading}
        >
          {confirmLoading ? 'Confirming...' : 'Confirm Booking'}
        </button>
      )}
    </div>
  );
};

export default CustomDealBooking;