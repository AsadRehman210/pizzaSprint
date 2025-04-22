import React, { useCallback, useEffect, useRef, useState } from "react";
import logo from "../../assets/images/logo.svg";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { showRestaurantInfo } from "../../redux/slice/authSlice";
import { BASE_URL } from "../../global/Config";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const restaurantInfo = useSelector(showRestaurantInfo);

  const menuRef = useRef(null);

  // Toggle menu visibility for mobile
  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  // Close menu
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        isMenuOpen
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, closeMenu]);

  // Close menu on screen size change (from mobile to larger screens)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMenuOpen) closeMenu();
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check on initial load

    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen, closeMenu]);

  return (
    <header className="bg-white h-[4.5rem] sm:h-[5.5rem] flex items-center border-b">
      <div className="container mx-auto flex items-center justify-between px-4 xl:px-28">
        <NavLink
          to="/home"
          className="flex items-center h-[4.25rem] sm:h-[5.063rem] w-[2.636rem] sm:w-[3.688rem]"
        >
          <img
            src={`${BASE_URL}${restaurantInfo?.logoUrl}`}
            alt="Logo"
            className="h-[50px] w-[50px]"
          />
        </NavLink>

        <div className={`hidden md:flex items-center space-x-6`}>
          <NavLink to="/contact" className="font-medium text-lg text-[#00274D]">
            Restaurant Info
          </NavLink>

          <button
            className="hidden md:block px-6 py-3 bg-[#00274D] font-medium text-lg text-white rounded-lg focus:outline-none"
            disabled
          >
            Sign in / Register
          </button>
        </div>

        {/* Hamburger Icon (Visible on small screens) */}
        <div className="md:hidden flex items-center Navmenu">
          <button onClick={toggleMenu} className="text-[#00274D]">
            <i className="fa-solid fa-bars-staggered text-base"></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Background Overlay (Visible when menu is open) */}
      {isMenuOpen && (
        <div
          onClick={closeMenu}
          className="md:hidden fixed inset-0 bg-black opacity-50 z-10"
        />
      )}

      <div
        ref={menuRef}
        className={`md:hidden fixed top-0 right-0 w-64 h-full bg-white shadow-md transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <button
          onClick={closeMenu}
          className="absolute top-4 right-4 text-[#00274D] z-50"
        >
          <i className="fa-regular fa-circle-xmark font-sm"></i>
        </button>

        <div className="flex flex-col gap-4 p-4 mt-12">
          <NavLink
            to="/"
            className="block font-medium text-base text-[#00274D]"
            onClick={closeMenu}
          >
            Restaurant Info
          </NavLink>
          <button
            className="block px-6 py-3 bg-[#00274D] font-medium text-base text-white rounded-lg focus:outline-none"
            onClick={closeMenu}
            disabled
          >
            Sign in / Register
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
