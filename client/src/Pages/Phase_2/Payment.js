// PaymentComponent.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PaymentComponent = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(`/api/chat/${chatId}`);
        const data = await response.json();
        setAmount(data.matchRequest.totalAmount);
      } catch (err) {
        setError('Failed to load payment details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaymentDetails();
  }, [chatId]);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // In a real app, you would integrate with a payment gateway here
      // For demo, we'll just simulate a successful payment
      const transactionId = `txn_${Math.random().toString(36).substr(2, 9)}`;
      
      const response = await fetch(`/api/chat/${chatId}/payment-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId,
          amount
        })
      });
      
      if (response.ok) {
        navigate(`/chat/${chatId}`);
      } else {
        setError('Payment failed');
      }
    } catch (err) {
      setError('Payment error');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div>Loading payment details...</div>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-marriageHotPink">₹{amount}</div>
          <div className="text-gray-500">Matchmaking Service Fee</div>
        </div>
        
        {/* In a real app, you would have payment gateway integration here */}
        <div className="space-y-4 mb-6">
          <div className="border rounded p-3">
            <label className="flex items-center">
              <input type="radio" name="payment" className="mr-2" defaultChecked />
              Credit/Debit Card
            </label>
          </div>
          <div className="border rounded p-3">
            <label className="flex items-center">
              <input type="radio" name="payment" className="mr-2" />
              UPI
            </label>
          </div>
          <div className="border rounded p-3">
            <label className="flex items-center">
              <input type="radio" name="payment" className="mr-2" />
              Net Banking
            </label>
          </div>
        </div>
        
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-marriageHotPink text-white py-3 rounded-lg hover:bg-marriageRed disabled:opacity-50"
        >
          {processing ? 'Processing...' : `Pay ₹${amount}`}
        </button>
      </div>
    </div>
  );
};

export default PaymentComponent;