"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { FaUserCircle } from 'react-icons/fa';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center gap-2">
        {/* shrink-0 prevents the logo from shrinking */}
        <Link href="/" className="text-xl sm:text-2xl font-bold text-blue-600 shrink-0">
          SchoolFinder
        </Link>
        
        {/* min-w-0 allows the welcome text to truncate properly */}
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
          {status === 'loading' ? (
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          ) : session ? (
            <>
              {/* truncate will add "..." if the name is too long */}
              <span className="font-semibold text-sm sm:text-base text-gray-800 text-right truncate min-w-0">
                Welcome, {session.user.name}
              </span>
              <Link href="/profile" title="View Profile" className="text-gray-700 hover:text-blue-600">
                <span><FaUserCircle size={28} /></span>
              </Link>
              {/* shrink-0 prevents the button from shrinking */}
              <button 
                onClick={() => signOut({ callbackUrl: '/login' })} 
                className="bg-red-500 text-white px-3 py-2 text-xs sm:px-4 sm:py-2 rounded-full hover:bg-red-600 font-semibold shrink-0"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-blue-600 font-semibold">Login</Link>
              <Link href="/register" className="bg-blue-600 text-white px-3 py-2 text-sm sm:px-4 sm:py-2 rounded-full hover:bg-blue-700 font-semibold">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}