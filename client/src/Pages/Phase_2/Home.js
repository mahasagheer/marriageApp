import React, { useEffect, useState } from "react";
import { Headset, BadgeCheck, EyeOff, Filter, Heart, Sparkles } from "lucide-react";
import { Button } from "../../Components/Layout/Button";
import UserProfileModal from "./UserProfileForm";
import { Footer } from "../../Components/Layout/Footer";
import logo from "../../assets/logo.png";
import match from "../../assets/match.png";
import { motion } from "framer-motion";
import { NavBar } from "../../Components/Layout/navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDispatch } from "react-redux";
import { fetchProfileByuserId } from "../../slice/userProfile";

export const HeroSection = () => {
  const { user } = useAuth();

  const navigate = useNavigate()
  const handleProfileModal = () => {
    if (user.role === "user") navigate("/user/addProfile")
    else if (user.role === "agency") navigate("/agency/addProfile")
  };

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.id) {
          throw new Error('User ID not found');
        }
  
        const result = await dispatch(fetchProfileByuserId(user.id)).unwrap();
  
        // Check if result exists and has a message property
        if (result?.message?.includes('Profile not found')) {
          setProfile(null);
          setError(null);
        } else {
          setProfile(result || null);
        }
      } catch (err) {
        // Safely check error message
        const errMessage = err?.message || '';
        if (errMessage.includes('404') || errMessage.includes('Profile not found')) {
          setProfile(null);
          setError(null);
        } else {
          setError(errMessage || 'Failed to load profile');
        }
      } 
    };
  
    loadProfile();
  }, [dispatch]);

  
  return (
    <div className={`h-[100%] relative bg-gradient-to-br from-marriagePink via-marriageHotPink to-marriageRed text-white py-10 md:py-18 px-4 overflow-hidden`}>
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

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-medium mb-8">
            Your <span className="text-yellow-300 font-bold">Perfect Partner </span> a few
            clicks away !
          </h2>
         { !profile &&  <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold px-10 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center mx-auto"
              onClick={() => handleProfileModal()}>
              <Heart className="mr-2" fill="currentColor" />
              Create Profile
            </button>
          </motion.div>}
        </motion.div>
      </div>
    </div>
  )
}

const FeaturesSection = () => (
  <div className="my-16 px-4">
    <h2 className="text-3xl font-bold text-marriageRed mb-12 text-center">
      Why Choose WedLink?
    </h2>

    <div className="flex flex-col items-center space-y-8">
      {/* First Row */}
      <div className="flex flex-wrap justify-center md:gap-[5rem] w-full">
        {[
          {
            title: "Verified Profiles",
            icon: <BadgeCheck className="text-marriageRed" size={28} />,
            description:
              "All profiles are manually verified for authenticity",
          },
          {
            title: "Privacy Control",
            icon: <EyeOff className="text-marriageRed" size={28} />,
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
      <div className="flex flex-wrap justify-center md:gap-[5rem] w-full">
        {[
          {
            title: "Advanced Search",
            icon: <Filter className="text-marriageRed" size={28} />,
            description: "Filter matches by education, profession & more",
          },
          {
            title: "24/7 Support",
            icon: <Headset className="text-marriageRed" size={28} />,
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
  <div className="m-12 bg-white p-6 rounded-lg shadow-md border border-pink-100">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center">
      {/* Profile Card 1 */}
      <div className=" p-6 rounded-lg border border-pink-200 h-[60vh] ">
        <img
          src={match}
          alt="Match"
          className="h-full w-full bg-white object-cover"
        />
      </div>
      <div className="p-[2rem] ">
        <h2 className="md:text-4xl font-bold text-marriageRed mb-6 text-center">
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

const MatchmakingHome = () => {

  return (
    <div className=" bg-white min-h-screen ">

        <HeroSection />

        <ProfileShowcase />
        <FeaturesSection />
      
    </div>
  );
};

export default MatchmakingHome;
