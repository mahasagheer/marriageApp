// MatchmakingHome.jsx
import React, { useEffect, useState } from "react";
import {
  Headset,
  BadgeCheck,
  EyeOff,
  Filter,
  Heart,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { fetchProfileByuserId } from "../../slice/userProfile";

import match from "../../assets/match.png";

export const HeroSection = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const handleCreateProfile = () => {
    if (user?.role === "user") navigate("/user/addProfile");
    else if (user?.role === "agency") navigate("/agency/addProfile");
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!user?.id) throw new Error("User ID not found");

        const result = await dispatch(fetchProfileByuserId(user.id)).unwrap();

        if (result?.message?.includes("Profile not found")) {
          localStorage.setItem("id", JSON.stringify(false));
          setProfile(null);
        } else if (result) {
          localStorage.setItem("userId", JSON.stringify(result._id));
          localStorage.setItem("id", JSON.stringify(true));
          setProfile(result);
        }
      } catch (err) {
        if (err?.message?.includes("404") || err?.message?.includes("not found")) {
          setProfile(null);
        } else {
          setError(err.message || "Failed to load profile");
        }
      }
    };

    loadProfile();
  }, [dispatch, user?.id]);

  return (
    <div className="relative py-10 md:py-20 px-4 overflow-hidden bg-gradient-to-br from-marriagePink via-marriageHotPink to-marriageRed text-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-2xl">
      {/* Floating hearts */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-200 dark:text-pink-500 opacity-30"
            initial={{ y: -50 }}
            animate={{
              y: [0, 1000],
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              fontSize: `${20 + Math.random() * 20}px`,
            }}
          >
            <Heart />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto text-center relative z-10">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4 font-serif"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Find your{" "}
          <span className="relative inline-block">
            <span className="relative z-10 dark:text-marriageRed  text-yellow-400">
              Perfect Life Partner
            </span>
            <Sparkles className="absolute md:top-[-4] bottom-10 md:right-[-6] -right-1 dark:text-marriageRed animate-spin-slow  text-yellow-400" size={32} />
          </span>
        </motion.h1>

        <motion.h2
          className="text-2xl md:text-3xl font-medium mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Your <span className="dark:text-marriageHotPink font-bold  text-yellow-400">Perfect Partner</span> a few clicks away!
        </motion.h2>

        {!profile && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <button
              onClick={handleCreateProfile}
              className="bg-gradient-to-r from-marriageRed to-marriageHotPink hover:marriageRed hover:to-marriagePink text-white font-bold px-10 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center mx-auto"
            >
              <Heart className="mr-2" fill="currentColor" />
              Create Profile
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      title: "Verified Profiles",
      icon: <BadgeCheck size={28} />,
      description: "All profiles are manually verified for authenticity",
    },
    {
      title: "Privacy Control",
      icon: <EyeOff size={28} />,
      description: "Complete control over your profile visibility",
    },
    {
      title: "Advanced Search",
      icon: <Filter size={28} />,
      description: "Filter matches by education, profession & more",
    },
    {
      title: "24/7 Support",
      icon: <Headset size={28} />,
      description: "Dedicated relationship managers available anytime",
    },
  ];

  return (
    <div className="py-16 px-4 dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-marriageRed  mb-12 text-center">
        Why Choose WedLink?
      </h2>

      <div className="flex flex-wrap justify-center flex-0 gap-10">
        {features.map(({ title, icon, description }, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-pink-100 dark:border-gray-700 text-center w-full max-w-[350px] hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-full text-marriageRed ">
                {icon}
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfileShowcase = () => (
  <div className="m-12 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-pink-100 dark:border-gray-700">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div className="p-6 rounded-lg border border-pink-200 dark:border-gray-600 h-[60vh]">
        <img src={match} alt="Match" className="h-full w-full object-cover rounded-lg" />
      </div>
      <div className="p-6">
        <h2 className="text-3xl md:text-4xl font-bold text-marriageRed  mb-6 text-center">
          Finding your perfect match just got easy!
        </h2>
        <p className="text-center text-md text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          RishtaDhondo helps you find the partner of your choice through its
          detailed AI-based matching filters.
        </p>
      </div>
    </div>
  </div>
);

const MatchmakingHome = () => {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen transition-colors duration-500">
      <HeroSection />
      <ProfileShowcase />
      <FeaturesSection />
    </div>
  );
};

export default MatchmakingHome;
