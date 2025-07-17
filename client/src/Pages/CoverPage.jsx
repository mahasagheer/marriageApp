/* CoverPage.jsx */
import React, {  useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { LoginModal } from "../Components/loginModal";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.3, duration: 0.6 },
  }),
};

export default function CoverPage() {
  const [open, setOpen] = useState(false);

  /* ② Grab state, setter, *and* helpers from the hook */
  const [label, setLabel, ] =useState("")

  /* ③ One handler that records which card was clicked */
  const handleCardClick = (type)=>{
    setLabel(type)
    setOpen(true)
  }

  return (
    <motion.div
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-marriagePink via-marriageHotPink to-marriageRed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Floating Hearts */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-200 opacity-40"
            initial={{ y: -50, x: Math.random() * 1000 }}
            animate={{
              y: [0, 1000],
              x: [0, Math.random() * 200 - 100],
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              fontSize: `${20 + Math.random() * 30}px`,
            }}
          >
            <Heart />
          </motion.div>
        ))}
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-10 text-center drop-shadow-lg"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Welcome to WedLink
        </motion.h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl text-center border border-white/20"
            >
              <h2 className="text-2xl font-semibold mb-3">
                {i === 0 ? "Match Making" : "Marriage Halls"}
              </h2>
              <p className="mb-4 text-white/80">
                {i === 0
                  ? "Find your perfect match with intelligent matchmaking."
                  : "Browse and book the perfect venue for your big day."}
              </p>
              <button
                className="bg-white text-black px-5 py-2 rounded-full hover:bg-gray-200 transition"
                onClick={() => handleCardClick(i === 0 ? "matches" : "hall")}
              >
                {i === 0 ? "Explore Matches" : "Book a Hall"}
              </button>
            </motion.div>
          ))}
        </div>

        
      </div>

      {open && <LoginModal onClose={() => setOpen(false)}  label={label}/>}
    </motion.div>
  );
}
