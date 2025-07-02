import React, { useState } from "react";
import { Button } from "./Layout/Button";

export const LoginModal = ({ onClose, onSwitch }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative border-2 border-marriagePink">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-marriageRed text-2xl font-bold hover:text-marriageHotPink"
        >
          &times;
        </button>
        {/* Title */}
        <h2 className="text-2xl font-extrabold text-marriageRed mb-2 text-center font-serif">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>
        <p className="text-center text-marriageHotPink mb-6 font-mono">
          {isSignUp ? "Sign up to find your perfect match" : "Login to your account"}
        </p>
        {/* Form */}
        <form className="space-y-4">
          {isSignUp && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded-lg border border-marriagePink focus:outline-none focus:ring-2 focus:ring-marriageHotPink"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg border border-marriagePink focus:outline-none focus:ring-2 focus:ring-marriageHotPink"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg border border-marriagePink focus:outline-none focus:ring-2 focus:ring-marriageHotPink"
            required
          />
          {isSignUp && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 rounded-lg border border-marriagePink focus:outline-none focus:ring-2 focus:ring-marriageHotPink"
              required
            />
          )}
          <Button
            btnText={isSignUp ? "Sign Up" : "Login"}
            btnColor="marriageHotPink"
            padding="w-full py-3"
            type="submit"
          />
        </form>
        {/* Switch Mode */}
        <div className="text-center mt-4 text-sm text-gray-600">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <button
                className="text-marriageHotPink font-semibold hover:underline"
                onClick={() => setIsSignUp(false)}
              >
                Login
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                className="text-marriageHotPink font-semibold hover:underline"
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 