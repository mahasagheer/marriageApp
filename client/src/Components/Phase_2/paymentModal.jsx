import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useDispatch } from 'react-redux';
import { fetchAccounts } from '../../slice/savedAccountsSlice';
import { toast } from 'react-toastify';
export const PaymentRequestModal = ({
  onClose,
  onRequestPayment,
  isLoading,
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [dueDate, setDueDate] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [useSaved, setUseSaved] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [savedAccounts, setSavedAccounts] = useState([]);

  const { user } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    const loadAccounts = async () => {
      if (!user?.id) return;
      try {
        const data = await dispatch(fetchAccounts(user.id)).unwrap().then((res)=>{

          if (Array.isArray(res)) {
            setSavedAccounts(res);
          }
        }); 
      
      } catch (error) {
        console.error('Failed to load saved accounts:', error);
      }
    };

    loadAccounts();
  }, [user, dispatch]);

  const handleAccountSelect = (index) => {
    const acc = savedAccounts[index];
    if (!acc) return;
    setSelectedAccount(acc);
    setAccountTitle(acc.accountTitle || '');
    setAccountNumber(acc.accountNumber || '');
    setBankName(acc.bankName || '');
    setUseSaved(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || !description || !accountTitle || !accountNumber || !bankName) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!/^\d{10,20}$/.test(accountNumber)) {
      toast.error('Account number must be 10–20 digits.');
      return;
    }

    onRequestPayment({
      amount: parseFloat(amount),
      currency,
      description,
      dueDate: dueDate || undefined,
      accountTitle,
      accountNumber,
      bankName,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            Request Payment
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto custom-scrollbar"
        >
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              Amount *
            </label>
            <div className="relative rounded-md shadow-sm">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="absolute left-0 top-0 h-full pl-3 pr-7 border border-r-0 border-gray-300 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white rounded-l-md focus:ring-marriageHotPink focus:border-marriageHotPink"
              >
                <option value="USD">$</option>
                <option value="EUR">€</option>
                <option value="GBP">£</option>
                <option value="INR">₹</option>
                <option value="PKR">Rs</option>
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full pl-20 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-marriageHotPink focus:border-marriageHotPink"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          {/* Saved Accounts */}
          {savedAccounts.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Use Saved Account
              </label>
              <div className="flex gap-2">
                <select
                  onChange={(e) => handleAccountSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  defaultValue=""
                  disabled={isLoading}
                >
                  <option value="" disabled>
                    Select an account
                  </option>
                  {savedAccounts.map((acc, index) => (
                    <option key={index} value={index}>
                      {acc.bankName} — {acc.accountTitle}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setUseSaved(false);
                    setAccountTitle('');
                    setAccountNumber('');
                    setBankName('');
                    setSelectedAccount(null);
                  }}
                  className="text-sm text-blue-600 dark:text-blue-400 underline"
                  disabled={isLoading}
                >
                  Enter manually
                </button>
              </div>
            </div>
          )}

          {/* Account Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              Account Title *
            </label>
            <input
              type="text"
              value={accountTitle}
              onChange={(e) => setAccountTitle(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-marriageHotPink focus:border-marriageHotPink"
              placeholder="e.g., Khushi Shahbaz"
              required
              disabled={isLoading}
            />
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              Account Number *
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-marriageHotPink focus:border-marriageHotPink"
              placeholder="e.g., 12345678901234"
              required
              disabled={isLoading}
            />
          </div>

          {/* Bank Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              Bank Name *
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-marriageHotPink focus:border-marriageHotPink"
              placeholder="e.g., HBL, UBL, Meezan"
              required
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-marriageHotPink focus:border-marriageHotPink"
              placeholder="Payment for matchmaking services"
              rows={3}
              required
              disabled={isLoading}
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              Due Date (Optional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-marriageHotPink focus:border-marriageHotPink"
              disabled={isLoading}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Payment Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
