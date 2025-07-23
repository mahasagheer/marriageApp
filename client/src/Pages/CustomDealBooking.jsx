import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

const CustomDealBooking = () => {
  const { token } = useParams();
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      setError('');
      try {
        // Try fetching from custom deal endpoint first
        const dealRes = await fetch(`/api/bookings/custom-deal/${token}`);
        const dealData = await dealRes.json();
        
        // Then try fetching from public booking endpoint
        const paymentRes = await fetch(`/api/booking/public/by-token/${token}`);
        const paymentData = await paymentRes.json();

        // Determine which response contains the booking data
        const bookingData = paymentData.booking || dealData.booking;
        
        if (!bookingData) {
          setError(dealData.message || paymentData.message || 'Booking not found');
          setLoading(false);
          return;
        }

        setBooking(bookingData);
        setPayment(paymentData.payment || null);
      } catch (err) {
        setError('Failed to fetch booking/payment info');
        console.error('Fetch error:', err);
      }
      setLoading(false);
    };

    fetchBookingDetails();
  }, [token, uploadSuccess]);

  const handleConfirm = async () => {
    setConfirmLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/bookings/custom-deal/${token}/confirm`, { 
        method: 'POST' 
      });
      const data = await res.json();
      if (res.ok) {
        setConfirmed(true);
        // Update local booking state to reflect confirmation
        setBooking(prev => ({ ...prev, status: 'approved' }));
      } else {
        setError(data.message || 'Failed to confirm booking');
      }
    } catch (err) {
      setError('Network error');
      console.error('Confirmation error:', err);
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
    if (!file || !booking?._id) return;
    
    setUploading(true);
    setUploadError('');
    setUploadSuccess('');
    
    const formData = new FormData();
    formData.append('proofImage', file);
    
    try {
      const res = await fetch(`/api/booking/public/${booking._id}/upload-payment-proof`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        setUploadSuccess('Payment proof uploaded successfully!');
        setFile(null);
        // Update local payment state
        setPayment(prev => ({ 
          ...prev, 
          proofImage: data.proofImage,
          status: 'awaiting_verification' 
        }));
      } else {
        setUploadError(data.message || 'Failed to upload payment proof');
      }
    } catch (err) {
      setUploadError('Network error');
      console.error('Upload error:', err);
    }
    setUploading(false);
  };

  if (loading) return <div className="loader"></div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!booking) return <div className="text-center mt-8">Booking not found.</div>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-start justify-center p-4 md:p-5 bg-gray-50 gap-8 animate-fadeInUp">
      {/* Booking Details Section */}
      <div className="flex-1 max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-marriagePink/20 w-full">
        <h2 className="text-2xl md:text-3xl font-extrabold text-marriageHotPink mb-6 text-center md:text-left tracking-tight">
          Booking Details for {booking.guestName || 'Guest'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Hall Information */}
          <div className="bg-marriagePink/10 rounded-xl p-4">
            <div className="font-semibold text-marriageHotPink">Hall</div>
            <div className="text-gray-800">
              {booking.hallId?.name || booking.hallName || '-'}
            </div>
          </div>

          {/* Booking Date */}
          <div className="bg-marriagePink/10 rounded-xl p-4">
            <div className="font-semibold text-marriageHotPink">Date</div>
            <div className="text-gray-800">
              {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : '-'}
            </div>
          </div>

          {/* Menu Items */}
          <div className="bg-marriagePink/10 rounded-xl p-4">
            <div className="font-semibold text-marriageHotPink">Menu Items</div>
            <div className="text-gray-800">
              {booking.menuItems?.length ? (
                <ul className="list-disc pl-5">
                  {booking.menuItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : booking.menuId?.items?.length ? (
                <ul className="list-disc pl-5">
                  {booking.menuId.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                '-'
              )}
            </div>
          </div>

          {/* Decoration Items */}
          <div className="bg-marriagePink/10 rounded-xl p-4">
            <div className="font-semibold text-marriageHotPink">Decoration Items</div>
            <div className="text-gray-800">
              {booking.decorationItems?.length ? (
                <ul className="list-disc pl-5">
                  {booking.decorationItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : booking.decorationIds?.length ? (
                <ul className="list-disc pl-5">
                  {booking.decorationIds.map((item, index) => (
                    <li key={index}>
                      {typeof item === 'object' ? item.name : item}
                    </li>
                  ))}
                </ul>
              ) : (
                '-'
              )}
            </div>
          </div>

          {/* Price */}
          <div className="bg-marriagePink/10 rounded-xl p-4">
            <div className="font-semibold text-marriageHotPink">Price</div>
            <div className="text-gray-800">
              {booking.price ? `Rs. ${booking.price}` : '-'}
            </div>
          </div>

          {/* Status */}
          <div className="bg-marriagePink/10 rounded-xl p-4">
            <div className="font-semibold text-marriageHotPink">Status</div>
            <div className="text-gray-800">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                booking.status === 'approved' ? 'bg-green-100 text-green-700' :
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                booking.status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {booking.status || 'N/A'}
              </span>
            </div>
          </div>

          {/* Guest Information */}
          <div className="bg-marriagePink/10 rounded-xl p-4 sm:col-span-2">
            <div className="font-semibold text-marriageHotPink">Guest Information</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <div>
                <span className="font-medium">Name:</span> {booking.guestName || '-'}
              </div>
              <div>
                <span className="font-medium">Email:</span> {booking.guestEmail || '-'}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {booking.guestPhone || '-'}
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-marriagePink/10 rounded-xl p-4 sm:col-span-2">
            <div className="font-semibold text-marriageHotPink">Message</div>
            <div className="text-gray-800">
              {booking.message || 'No message provided'}
            </div>
          </div>
        </div>

        {/* Confirmation Button */}
        {(!confirmed && booking.status === 'pending') && (
          <button
            className="w-full mt-6 px-6 py-3 rounded-xl bg-marriageHotPink text-white font-bold shadow hover:bg-marriageRed transition text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleConfirm}
            disabled={confirmLoading}
          >
            {confirmLoading ? 'Confirming...' : 'Confirm Booking'}
          </button>
        )}

        {confirmed && (
          <div className="mt-6 p-3 bg-green-50 rounded-lg text-green-700 font-semibold flex items-center gap-2">
            <FiCheckCircle className="text-green-500 text-xl" /> 
            Booking confirmed successfully!
          </div>
        )}
      </div>

      {/* Payment Section */}
      <div className="flex-1 max-w-md w-full bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-marriagePink/20">
        <h3 className="text-xl font-bold text-marriageHotPink mb-4">Payment Information</h3>
        
        {payment ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-semibold">Payment Number:</div>
              <div className="text-gray-800 mt-1">
                {payment.paymentNumber || <span className="text-gray-400">Not provided</span>}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-semibold">Payment Status:</div>
              <div className="mt-1">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                  payment.status === 'verified' ? 'bg-green-100 text-green-700' :
                  payment.status === 'awaiting_verification' ? 'bg-yellow-100 text-yellow-700' :
                  payment.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {payment.status || 'N/A'}
                </span>
              </div>
            </div>

            {payment.proofImage && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-semibold mb-2">Payment Proof:</div>
                <img 
                  src={`/${payment.proofImage}`} 
                  alt="Payment proof" 
                  className="max-w-full h-auto max-h-40 rounded shadow border" 
                />
              </div>
            )}

            {payment.status === 'awaiting_payment' && (
              <form onSubmit={handleUpload} className="bg-gray-50 p-4 rounded-lg">
                <div className="font-semibold mb-2">Upload Payment Proof</div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  disabled={uploading}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-marriagePink/80 file:text-white
                    hover:file:bg-marriagePink/100
                    disabled:opacity-50"
                />
                {file && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected: {file.name}
                  </div>
                )}
                {uploadError && (
                  <div className="mt-2 text-sm text-red-600">{uploadError}</div>
                )}
                {uploadSuccess && (
                  <div className="mt-2 text-sm text-green-600">{uploadSuccess}</div>
                )}
                <button
                  type="submit"
                  className="mt-4 w-full px-4 py-2 bg-marriageHotPink text-white rounded-lg font-bold shadow hover:bg-marriageRed transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={uploading || !file}
                >
                  {uploading ? 'Uploading...' : 'Upload Proof'}
                </button>
              </form>
            )}

            {payment.status === 'awaiting_verification' && (
              <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700">
                Your payment proof has been submitted and is awaiting verification.
              </div>
            )}

            {payment.status === 'verified' && (
              <div className="bg-green-50 p-4 rounded-lg text-green-700 flex items-center gap-2">
                <FiCheckCircle className="text-green-500" />
                Your payment has been verified successfully!
              </div>
            )}

            {payment.status === 'rejected' && (
              <div className="bg-red-50 p-4 rounded-lg text-red-700">
                Your payment was rejected. Please upload a new payment proof or contact support.
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg text-gray-500">
            No payment information available yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDealBooking;