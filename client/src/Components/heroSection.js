export const HeroSection = ({ onRegisterClick }) => {
    return (
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Find Your Muslim Life Partner
            </h1>
            <p className="text-xl text-gray-600">
              The UK's most trusted Muslim marriage service. Over 60,000 successful marriages since 2000.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onRegisterClick}
                className="px-8 py-4 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700"
              >
                Register Today - It's FREE
              </button>
              <button className="px-8 py-4 border border-green-600 text-green-600 rounded-lg text-lg font-semibold hover:bg-green-50">
                How It Works
              </button>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((item) => (
                  <img 
                    key={item}
                    src={`https://randomuser.me/api/portraits/women/${item}.jpg`}
                    alt="User"
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <span>Join 500,000+ members finding their perfect match</span>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://singlemuslim.com/wp-content/uploads/2020/02/hero-image.png" 
              alt="Happy couple"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>
    );
  };