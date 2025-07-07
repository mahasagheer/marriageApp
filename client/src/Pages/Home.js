import React, { useState } from 'react';
import { NavBar } from '../Components/Layout/navbar';
import landingImage from "../assets/landing.png";
import { Button } from '../Components/Layout/Button';
import { Footer } from '../Components/Layout/Footer';
import { LoginModal } from '../Components/loginModal';

export default function Home () {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="font-sans text-gray-800 bg-white min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <NavBar onLoginClick={() => setShowLogin(true)} />
      {/* Main Content */}
      <div className="flex-1">
        <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-16 md:py-24">
          {/* Left: Text and Buttons */}
          <div className="flex-1 space-y-6 md:pr-5">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#00185f] font-mono leading-tight mb-2">
              Your Perfect Partner a few <br className="hidden md:block" /> clicks away !
            </h1>
            <p className="text-lg text-gray-700 mb-4">
              Download Our App, Browse Member Profiles And Find Your Life Partner!
            </p>
            <div className="flex gap-4 mb-4">
              <Button btnText={"Register"} btnColor={"marriageHotPink"} />
            </div>
          </div>
          {/* Right: Illustration */}
          <div className="flex-1 flex justify-center md:justify-end mt-10 md:mt-0">
            <img 
              src={landingImage}
              alt="Marriage Illustration" 
              className="w-full h-full bg-white"
            />
          </div>
        </section>
        {/* Why Choose Section */}
        <section className="bg-marriagePink py-12">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-marriageRed mb-8">Why choose Online Nikah ?</h2>
            <p className="text-center text-gray-700 mb-10 max-w-2xl mx-auto">
              Online Nikah is one of the largest online Matrimonial Apps. The simple to use and exclusively online matrimony services makes us a differentiator among the other matrimonial sites.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="bg-marriageRed text-white rounded-full p-4 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zm0 0c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4-4 1.79-4 4zm0 0v2m0 4v.01" /></svg>
                </div>
                <h3 className="font-semibold text-xl text-marriageRed mb-2">Global Matrimonial Platform</h3>
                <p className="text-gray-700 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.</p>
              </div>
              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="bg-marriageRed text-white rounded-full p-4 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 16v-4" /></svg>
                </div>
                <h3 className="font-semibold  text-xl text-marriageRed mb-2">No Charge for Registration</h3>
                <p className="text-gray-700 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.</p>
              </div>
              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="bg-marriageRed text-white rounded-full p-4 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </div>
                <h3 className="font-semibold  text-xl text-marriageRed mb-2">Screening and Validation</h3>
                <p className="text-gray-700 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.</p>
              </div>
              {/* Feature 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="bg-marriageRed text-white rounded-full p-4 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zm0 0c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4-4 1.79-4 4zm0 0v2m0 4v.01" /></svg>
                </div>
                <h3 className="font-semibold  text-xl text-marriageRed mb-2">Data Security and Privacy</h3>
                <p className="text-gray-700 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Footer */}
      <Footer />
      {/* Login Modal */}
      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
};
