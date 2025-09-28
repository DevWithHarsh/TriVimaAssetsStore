import React, { useEffect } from "react";
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
  return (
    <div className="flex item-center py-2 px-4[4%] justify-between mx-5">
      <img
        src={assets.logo}
        alt="DharmaDristi Logo"
        className="w-20 sm:w-24 md:w-28 lg:w-32 h-auto object-contain"
      />
      <button
        onClick={() => setToken("")}
        className="h-10 mt-5 bg-[#BB9A9B] hover:bg-gray-800 transition-all text-white px-6 py-2 rounded-xl text-sm font-medium shadow-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
