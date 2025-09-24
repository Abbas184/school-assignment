"use client";
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';

// The Header now accepts two new props: 'searchTerm' and 'onSearchChange'
export default function Header({ searchTerm, onSearchChange }) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          SchoolFinder
        </Link>
        
        {/* We only show the search bar if onSearchChange is provided.
            This allows us to hide it on pages that don't need a search bar. */}
        {onSearchChange && (
          <div className="relative w-full max-w-md hidden md:block">
            <input 
              type="text" 
              placeholder="Search for a school..."
              // The value is now controlled by the parent component
              value={searchTerm}
              // When the user types, we call the function passed from the parent
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          </div>
        )}

        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-blue-600 font-semibold">
            Login
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 font-semibold transition duration-300">
            Sign Up
          </button>
        </div>
      </nav>
    </header>
  );
}