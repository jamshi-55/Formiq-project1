import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram,FaFacebookF,FaWhatsapp} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import About from '../pages/About';


function Footer() {
  return (
    <footer className="bg-gray-600 text-white py-8 cursor-pointer ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {/* About Formiq */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Formiq</h3>
            <About/>
            {/* <p className="text-gray-300">
              <span className='text-teal-600'>Formiq</span>, launched in 2025, redefines premium formal wear. Crafting  suits, ties, and accessories with unmatched quality.  
              Elevate your style with timeless elegance.Confidence begins with Formiq.
            </p> */}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/men" className="text-gray-300 hover:text-white">
                  Men
                </Link>
              </li>
              <li>
                <Link to="/women" className="text-gray-300 hover:text-white">
                  Women
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* i cons*/}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link to="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <FaFacebookF size={24}/>
              </Link>
              <Link to="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <FaXTwitter size={24}/>
              </Link>
              <Link to="https://www.instagram.com/j4mshil_r" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <FaInstagram size={24}/>
              </Link>
              <Link to='https://whatsapp.com' target='_blank' rel='noopner noreferrer' className='text-gray-300 hover:text-white'> 
               <FaWhatsapp size={24}/>
               </Link>
            </div>
          </div>
        </div>

        {/* Copyright of */}
        <div className="mt-8 text-center text-gray-300">
            {/* <h5>Developed by <span className="text-shadow-green-600" >jamshil</span></h5> */}
          <p>&copy; 2025 <span className='text-teal-600'>Formiq</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;