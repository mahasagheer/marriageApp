import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { Button } from "./Button";

export const NavBar = ({ onLoginClick, onRegisterClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="bg-white/90 py-4 px-4 md:px-12 lg:px-[15%] flex justify-between items-center font-serif relative z-20">
      <div className="flex items-center flex-shrink-0">
        <img 
          src={logo} 
          alt="WedLink" 
          className="h-12 md:h-20 bg-white mx-auto"
        />
      </div>
      {/* Hamburger for mobile */}
      <div className="md:hidden flex items-center">
        <button
          className="text-marriageHotPink focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Menu (hidden on mobile) */}
      <div className="hidden md:flex space-x-4 items-center">
        {/* <Button btnText={"Login"} btnColor={"marriageHotPink"} onClick={onLoginClick} />
        <Button btnText={"Register"} btnColor={"marriageHotPink"} /> */}
      </div>
      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg flex flex-col items-center py-4 md:hidden animate-fadeIn z-30">
          {/* <Button btnText={"Login"} btnColor={"marriageHotPink"} onClick={onLoginClick} className="mb-2 w-3/4" />
          <Button btnText={"Register"} btnColor={"marriageHotPink"} className="w-3/4" /> */}
        </div>
      )}
    </nav>
  );
};