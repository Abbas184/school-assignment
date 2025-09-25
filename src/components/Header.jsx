"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { FaUserCircle } from 'react-icons/fa';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          SchoolFinder
        </Link>

        <div className="flex items-center space-x-4">
          {status === 'loading' ? (
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          ) : session ? (
            <>
              <span className="font-semibold hidden sm:block">Welcome, {session.user.name}</span>
              {/* --- THIS IS THE FIX --- */}
              <Link href="/profile" title="View Profile" className="text-gray-600 hover:text-blue-600">
                {/* Wrapping the icon in a span ensures the link is clickable */}
                <span>
                  <FaUserCircle size={28} />
                </span>
              </Link>
              {/* --- END OF FIX --- */}
              <button onClick={() => signOut({ callbackUrl: '/login' })} className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 font-semibold transition duration-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-blue-600 font-semibold">Login</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 font-semibold transition duration-300">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}