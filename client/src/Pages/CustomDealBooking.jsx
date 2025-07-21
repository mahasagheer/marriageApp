import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

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

  if (confirmed) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] animate-fadeInUp">
      <FiCheckCircle className="text-green-500 text-5xl mb-4 animate-bounce" />
      <div className="text-green-700 text-center text-2xl sm:text-3xl font-extrabold mb-2">Booking Confirmed!</div>
      <div className="text-gray-600 text-center text-base sm:text-lg font-medium">Thank you for confirming your booking. We look forward to hosting your event!</div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-4 sm:p-8 mt-8 sm:mt-12 animate-fadeInUp border border-marriagePink/20 flex flex-col gap-4">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-marriageHotPink mb-2 sm:mb-4 text-center tracking-tight">Custom Deal for {deal.guestName}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
        <div className="bg-marriagePink/10 rounded-xl p-4 flex flex-col gap-1">
          <span className="font-semibold text-marriageHotPink">Hall</span>
          <span className="text-gray-800 text-base">{deal.hallId?.name || '-'}</span>
        </div>
        <div className="bg-marriagePink/10 rounded-xl p-4 flex flex-col gap-1">
          <span className="font-semibold text-marriageHotPink">Date</span>
          <span className="text-gray-800 text-base">{deal.bookingDate ? new Date(deal.bookingDate).toLocaleDateString() : '-'}</span>
        </div>
        <div className="bg-marriagePink/10 rounded-xl p-4 flex flex-col gap-1">
          <span className="font-semibold text-marriageHotPink">Menu Items</span>
          <span className="text-gray-800 text-base">{deal.menuItems && deal.menuItems.length > 0 ? deal.menuItems.join(', ') : '-'}</span>
        </div>
        <div className="bg-marriagePink/10 rounded-xl p-4 flex flex-col gap-1">
          <span className="font-semibold text-marriageHotPink">Decoration Items</span>
          <span className="text-gray-800 text-base">{deal.decorationItems && deal.decorationItems.length > 0 ? deal.decorationItems.join(', ') : '-'}</span>
        </div>
        <div className="bg-marriagePink/10 rounded-xl p-4 flex flex-col gap-1">
          <span className="font-semibold text-marriageHotPink">Price</span>
          <span className="text-gray-800 text-base">{deal.price ? `Rs. ${deal.price}` : '-'}</span>
        </div>
        <div className="bg-marriagePink/10 rounded-xl p-4 flex flex-col gap-1 sm:col-span-2">
          <span className="font-semibold text-marriageHotPink">Message</span>
          <span className="text-gray-800 text-base">{deal.message || '-'}</span>
        </div>
      </div>
      {/* Payment Section */}
      <div className="my-2 sm:my-6 p-4 rounded-2xl bg-marriagePink/10 border border-marriagePink/20 flex flex-col gap-2">
        <h3 className="text-lg sm:text-xl font-bold text-marriageHotPink mb-2 flex items-center gap-2"><span>Payment Instructions</span></h3>
        {payment ? (
          <>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 mb-2">
              <div>
                <span className="font-semibold">Payment Number:</span> <span className="text-gray-800">{payment.paymentNumber || <span className="text-gray-400">Not shared yet</span>}</span>
              </div>
              <div>
                <span className="font-semibold">Status:</span> <span className="text-gray-800">{payment.status ? payment.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}</span>
              </div>
            </div>
            {payment.proofImage && (
              <div className="mb-2 flex flex-col items-center">
                <span className="font-semibold">Your Uploaded Proof:</span>
                <img src={`/${payment.proofImage}`} alt="Payment Proof" className="max-w-xs max-h-40 rounded shadow border mt-2" />
              </div>
            )}
            {/* Upload form if payment is awaiting proof */}
            {payment.status === 'awaiting_payment' && !payment.proofImage && (
              <form onSubmit={handleUpload} className="mt-4 flex flex-col gap-2">
                <label className="font-semibold">Upload Payment Screenshot:</label>
                <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-marriagePink/80 file:text-marriageHotPink hover:file:bg-marriagePink/100" />
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
              <div className="text-yellow-700 font-semibold mt-2 flex items-center gap-2"><svg className="w-5 h-5 text-yellow-500 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg> Your payment proof is awaiting verification by the manager.</div>
            )}
            {payment.status === 'verified' && (
              <div className="text-green-700 font-semibold mt-2 flex items-center gap-2"><FiCheckCircle className="text-green-500 text-xl" /> Your payment has been verified! Thank you.</div>
            )}
            {payment.status === 'rejected' && (
              <div className="text-red-700 font-semibold mt-2 flex items-center gap-2"><svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg> Your payment proof was rejected. Please contact support or re-upload.</div>
            )}
          </>
        ) : (
          <div className="text-gray-400">No payment instructions yet. Please wait for the manager to share payment details.</div>
        )}
      </div>
      {/* Confirm Booking Button (if not confirmed and not approved) */}
      {(!confirmed && deal.status !== 'approved') && (
        <button
          className="w-full mt-4 px-6 py-2 rounded-xl bg-marriageHotPink text-white font-bold shadow hover:bg-marriageRed transition text-lg disabled:opacity-60 disabled:cursor-not-allowed"
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