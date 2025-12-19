import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ setIsLoggedIn, userEmail }) => {
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("passop_passwords");
    if (setIsLoggedIn) setIsLoggedIn(false);
    navigate("/Home");
  };

  return (
    <nav className="bg-slate-800 px-6 py-4 shadow-lg shadow-slate-700/30">
      <div className="flex items-center justify-between">
        <div className="font-extrabold text-2xl flex items-center gap-2">
          <span className="text-blue-400 animate-pulse">&lt;</span>
          <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-300 via-purple-400 to-pink-400 drop-shadow-lg">
            PASS-OP ☠️
          </span>
          <span className="text-pink-400 animate-pulse">&gt;</span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-lg">
          <ul className="flex gap-6">
            <li>
              <Link
                to="/"
                className="hover:text-blue-300 text-white transition-all"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-blue-300 text-white transition-all"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-blue-300 text-white transition-all"
              >
                Contact
              </Link>
            </li>
          </ul>

          {token && userEmail && (
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-black font-bold">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-200 font-medium">
                {userEmail}
              </span>
            </div>
          )}

          {token && (
            <button
              onClick={handleLogout}
              className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md hover:bg-red-500/80 transition-all duration-300"
            >
              <div className="text-sm text-gray-200 font-medium">Logout</div>
              <lord-icon
                src="https://cdn.lordicon.com/vfiwitrm.json"
                trigger="hover"
                target="button"
                colors="primary:#ffffff,secondary:#ffffff"
              ></lord-icon>
            </button>
          )}
        </div>

        <button
          className="text-white text-3xl md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? "✖" : "☰"}
        </button>
      </div>

      <ul
        className={`md:hidden flex flex-col gap-4 mt-4 text-lg text-white transition-all duration-300 overflow-hidden ${
          open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <li>
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="hover:text-blue-300"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            onClick={() => setOpen(false)}
            className="hover:text-blue-300"
          >
            About
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="hover:text-blue-300"
          >
            Contact
          </Link>
        </li>

        {token && userEmail && (
          <li className="mt-2 flex flex-col gap-2">
            <span className="text-white font-medium">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-400 px-3 py-1 rounded-lg text-white transition"
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
