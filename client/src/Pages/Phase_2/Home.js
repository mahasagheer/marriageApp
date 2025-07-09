import React, { useState } from "react";
import { Headset, BadgeCheck, EyeOff, Filter, Heart , Sparkles} from "lucide-react";
import { Button } from "../../Components/Layout/Button";
import UserProfileModal from "./UserProfileForm";
import { Footer } from "../../Components/Layout/Footer";
import logo from "../../assets/logo.png";
import match from "../../assets/match.png";
import { motion } from "framer-motion";

const HeroSection = () => (
  <div className="h-[60vh] relative bg-gradient-to-br from-red-700 via-pink-600 to-rose-600 text-white py-10 md:py-18 px-4 overflow-hidden">
    {/* Floating Hearts Animation */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-pink-200 opacity-40"
          initial={{ y: -50, x: Math.random() * 1000 }}
          animate={{
            y: [0, 1000],
            x: [0, Math.random() * 200 - 100],
            rotate: Math.random() * 360
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: `${20 + Math.random() * 30}px`
          }}
        >
          <Heart />
        </motion.div>
      ))}
    </div>

    <div className="container mx-auto text-center relative z-10">
      {/* Main Heading with Sparkles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4 font-serif">
          Find your 
          <span className="relative inline-block">
            <span className="relative z-10 text-yellow-300">Perfect Life Partner</span>
            <Sparkles className="absolute -top-4 -right-6 text-yellow-400 animate-spin-slow" size={32} />
          </span>
        </h1>
      </motion.div>

      {/* Tagline
      <motion.p 
        className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Pakistan's <span className="font-bold">#1</span> Matrimonial Service with{" "}
        <span className="text-yellow-200 font-semibold">3 Million+</span> Verified Profiles
      </motion.p> */}

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <h2 className="text-2xl md:text-3xl font-medium mb-8">
          Find your <span className="text-yellow-300 font-bold">perfect match</span> today!
        </h2>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold px-10 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center mx-auto">
            <Heart className="mr-2" fill="currentColor" />
            Create Profile
          </button>
        </motion.div>
      </motion.div>
    </div>
  </div>
);

const RishtaDhondoHome = () => {
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleProfileModal = () => {
    setOpen(true);
  };

  const MatchmakingSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg border border-pink-200">
        <h3 className="text-2xl font-bold text-red-700 mb-6 text-center">
          Find Your Perfect Life Partner
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-pink-100 text-center">
            <div className="flex justify-center items-center mb-4">
              <Heart className="text-red-600 mr-2" size={24} />
              <h4 className="font-semibold text-lg text-gray-800">
                Create Profile
              </h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Register your profile to find compatible matches
            </p>
            <Button
              btnText={"Register Free"}
              btnColor={"marriageRed"}
              onClick={() => handleProfileModal()}
              className="w-full"
            />
          </div>

          {/* <div className="bg-white p-6 rounded-lg shadow-md border border-pink-100 text-center">
            <div className="flex justify-center items-center mb-4">
              <Search className="text-red-600 mr-2" size={24} />
              <h4 className="font-semibold text-lg text-gray-800">
                Search Profiles
              </h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Search from thousands of verified profiles
            </p>
            <Button
              btnText={"Search Now"}
              btnColor={"marriageRed"}
              onClick={() => {}}
              className="w-full"
            />
          </div> */}

          {/* <div className="bg-white p-6 rounded-lg shadow-md border border-pink-100 text-center">
            <div className="flex justify-center items-center mb-4">
              <Users className="text-red-600 mr-2" size={24} />
              <h4 className="font-semibold text-lg text-gray-800">
                Premium Services
              </h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Get personalized matchmaking assistance
            </p>
            <Button
              btnText={"View Plans"}
              btnColor={"marriageRed"}
              onClick={() => {}}
              className="w-full"
            />
          </div> */}
        </div>
      </div>
    </div>
  );

  const FeaturesSection = () => (
    <div className="mt-16 px-4">
      <h2 className="text-3xl font-bold text-red-700 mb-12 text-center">
        Why Choose RishtaDhondo?
      </h2>

      <div className="flex flex-col items-center space-y-8">
        {/* First Row */}
        <div className="flex flex-wrap justify-center gap-8 w-full">
          {[
            {
              title: "Verified Profiles",
              icon: <BadgeCheck className="text-red-600" size={28} />,
              description:
                "All profiles are manually verified for authenticity",
            },
            {
              title: "Privacy Control",
              icon: <EyeOff className="text-red-600" size={28} />,
              description: "Complete control over your profile visibility",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md border border-pink-100 text-center w-full md:w-[350px] hover:shadow-lg transition-all duration-300 hover:border-red-200"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-red-50 p-4 rounded-full">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Second Row */}
        <div className="flex flex-wrap justify-center gap-8 w-full">
          {[
            {
              title: "Advanced Search",
              icon: <Filter className="text-red-600" size={28} />,
              description: "Filter matches by education, profession & more",
            },
            {
              title: "24/7 Support",
              icon: <Headset className="text-red-600" size={28} />,
              description: "Dedicated relationship managers available anytime",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md border border-pink-100 text-center w-full md:w-[350px] hover:shadow-lg transition-all duration-300 hover:border-red-200"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-red-50 p-4 rounded-full">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ProfileShowcase = () => (
    <div className="mt-12 bg-white p-6 rounded-lg shadow-md border border-pink-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center">
        {/* Profile Card 1 */}
        <div className=" p-6 rounded-lg border border-pink-200 h-[60vh] ">
          <img
            src={match}
            alt="Match"
            className="h-full w-full bg-white object-cover"
          />
        </div>
        <div className="p-[2rem]">
          <h2 className="text-3xl font-bold text-red-700 mb-6 text-center">
            Finding your perfect match just got easy!
          </h2>
          <p className="text-center  text-md text-gray-600 mb-8 max-w-2xl mx-auto">
            RishtaDhondo helps you find the partner of your choice through its
            detailed AI based matching filters.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans text-gray-800 bg-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={logo} alt="RishtaDhondo" className="h-16" />
              <h1 className="text-2xl font-bold text-red-700 hidden md:block">
                RishtaDhondo
              </h1>
            </div>

            <div className="flex space-x-4">
              <Button
                btnText={"Login"}
                btnColor={"marriageRedOutline"}
                onClick={() => setShowLogin(true)}
                className="px-4"
              />
              <Button
                btnText={"Register Free"}
                btnColor={"marriageRed"}
                onClick={() => handleProfileModal()}
                className="px-4"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <HeroSection />

        <MatchmakingSection />
        <ProfileShowcase />
        <FeaturesSection />
      </main>

      <Footer />
      {setOpen && (
        <UserProfileModal isOpen={open} onClose={() => setOpen(false)} />
      )}
    </div>
  );
};

export default RishtaDhondoHome;
