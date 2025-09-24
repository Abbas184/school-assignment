"use client";
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          SchoolFinder
        </Link>

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