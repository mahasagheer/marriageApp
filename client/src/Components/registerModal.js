
// Register Modal Component
export const RegisterModal = ({ onClose, onSwitchToLogin }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Register</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Register
            </button>
          </form>
          <div className="mt-4 text-center">
            <button 
              onClick={onSwitchToLogin}
              className="text-green-600 hover:underline"
            >
              Already have an account? Login here
            </button>
          </div>
        </div>
      </div>
    );
  };