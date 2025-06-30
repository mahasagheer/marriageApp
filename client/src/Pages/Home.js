import React from 'react';
import { useState } from 'react';
import { HeroSection } from '../Components/heroSection';
import { LoginModal } from '../Components/loginModal';
import { RegisterModal } from '../Components/registerModal';
import { NavBar } from '../Components/Layout/navbar';

export const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="font-sans text-gray-800">
      {/* Navigation Bar */}
      <NavBar
        onLoginClick={() => setShowLogin(true)} 
        onRegisterClick={() => setShowRegister(true)}
      />
      
      {/* Hero Section */}
      <HeroSection
        onRegisterClick={() => setShowRegister(true)}
      />
      
      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)} 
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}
      
      {/* Registration Modal */}
      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)} 
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </div>
  );
};
