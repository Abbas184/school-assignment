"use client";
import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm text-gray-400">&copy; 2025 SchoolFinder. All Rights Reserved.</p>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <a href="#" className="text-gray-400 hover:text-white transition duration-300">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition duration-300">
            <FaFacebook size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition duration-300">
            <FaInstagram size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}