import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { BsHeart } from "react-icons/bs";
import { LuShoppingBag } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
import { IoMdLogOut } from "react-icons/io";
import { FaBox } from "react-icons/fa";
import { toast } from 'react-toastify';

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || null;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    navigate('/user');
    setIsMenuOpen(false); // Close mobile menu
  };

  return (
    <header className="border-gray-500 bg-white cursor-pointer sticky top-13 z-50">
      <nav className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="nav-left">
          <Link to="/">
            <div className="text-3xl font-bold text-teal-600">
              Formiq
              <div className="text-xs font-normal text-black">Elevate Your Everyday</div>
            </div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-black">
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Menu Links */}
        <div
          className={`${
            isMenuOpen ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row md:items-center absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0 space-y-4 md:space-y-0 md:space-x-6`}
        >
          {/* MEN/WOMEN */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            <Link to="/men" className="text-black hover:text-gray-600">
              MEN
            </Link>
            <Link to="/women" className="text-black hover:text-gray-600">
              WOMEN
            </Link>
          </div>

          {/* Icons Section */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="md:ml-4">
              <input
                type="text"
                placeholder="Search...."
                className="border border-teal-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0bbbb]"
              />
            </div>

            {user?.email ? (
              <button
                onClick={handleLogout}
                className="text-black hover:text-gray-600 flex items-center gap-2"
              >
                <FiUser size={24} />
                <IoMdLogOut size={24} />
              </button>
            ) : (
              <Link to="/user" className="text-black hover:text-gray-600">
                <FiUser size={24} />
              </Link>
            )}

            <Link to="/wishlist" className="text-black hover:text-gray-600">
              <BsHeart size={24} />
            </Link>
            <Link to="/bag" className="text-black hover:text-gray-600">
              <LuShoppingBag size={24} />
            </Link>
            <Link to="/ordertrack" className="text-black hover:text-gray-600">
              <FaBox size={24} />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
