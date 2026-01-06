import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 border-t border-white/5 py-6 mt-auto backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Side: Brand & Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
            <Link
              to="/"
              className="text-lg font-black text-primary tracking-tighter italic"
            >
              POKE<span className="text-white">NIME</span>
            </Link>
            <span className="hidden md:block text-white/10">|</span>
            <p className="text-xs text-gray-500 tracking-wide">
              &copy; {currentYear}{" "}
              <span className="text-gray-400 font-medium">IzzPrjct</span>. All
              rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
