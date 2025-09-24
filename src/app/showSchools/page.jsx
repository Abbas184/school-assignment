"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react'; // <-- Import session hook
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SchoolList from '@/components/SchoolList';

export default function ShowSchoolsPage() {
  const { data: session } = useSession(); // <-- Get session data
  const [initialSchools, setInitialSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // We now fetch the initial data on the client side
  useEffect(() => {
    const fetchInitialSchools = async () => {
      try {
        const res = await fetch('/api/getSchools');
        const data = await res.json();
        setInitialSchools(data);
      } catch (err) {
        console.error("Failed to fetch initial schools", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialSchools();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-800">Our Schools</h1>
              <p className="text-gray-500 mt-1">Discover the best schools in our directory.</p>
            </div>
            {/* --- THIS IS THE KEY CHANGE --- */}
            {/* Only show the "Add School" button if the user is an admin */}
            {session?.user?.role === 'admin' && (
              <Link href="/addSchool" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md mt-4 sm:mt-0 whitespace-nowrap">
                + Add Your School
              </Link>
            )}
          </div>

          {isLoading ? (
            <p className="text-center text-gray-500">Loading schools...</p>
          ) : (
            <SchoolList initialSchools={initialSchools} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}