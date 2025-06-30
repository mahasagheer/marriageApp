export const NavBar = ({ onLoginClick, onRegisterClick }) => {
    return (
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="https://singlemuslim.com/wp-content/uploads/2020/02/smlogo.svg" 
            alt="SingleMuslim" 
            className="h-10"
          />
        </div>
        <div className="hidden md:flex space-x-6">
          <a href="#" className="hover:text-green-600">How it works</a>
          <a href="#" className="hover:text-green-600">Success Stories</a>
          <a href="#" className="hover:text-green-600">About Us</a>
          <a href="#" className="hover:text-green-600">Blog</a>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={onLoginClick}
            className="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50"
          >
            Login
          </button>
          <button 
            onClick={onRegisterClick}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Register
          </button>
        </div>
      </nav>
    );
  };