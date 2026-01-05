import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black/40 border-t border-white/5 py-8 mt-auto backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <Link
              to="/"
              className="text-xl font-black text-primary tracking-tighter italic"
            >
              POKE<span className="text-white">NIME</span>
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              &copy; {new Date().getFullYear()}{" "}
              <span className="text-white font-bold">IzzPrjct</span>. All rights
              reserved.
            </p>
          </div>

          {/* Optional Links */}
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link
              to="/directory"
              className="hover:text-primary transition-colors"
            >
              List Anime
            </Link>
            <Link
              to="/schedule"
              className="hover:text-primary transition-colors"
            >
              Jadwal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
