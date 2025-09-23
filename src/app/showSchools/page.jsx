"use client"; // <-- This is the most important change

import Link from 'next/link';
import { useState, useEffect } from 'react'; // <-- Import React hooks
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SchoolCard from '@/components/SchoolCard';

export default function ShowSchoolsPage() {
  // Set up states for loading, data, and errors
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // This useEffect hook runs in the browser AFTER the page loads
  useEffect(() => {
    // We define a function inside to fetch the data
    const fetchSchools = async () => {
      try {
        // This is a standard browser API call to our own backend
        const response = await fetch('/api/getSchools');
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server.');
        }
        const data = await response.json();
        setSchools(data); // Put the fetched schools into our state
      } catch (err) {
        setError(err.message); // If an error occurs, save the message
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false); // No matter what, stop loading
      }
    };

    fetchSchools(); // Call the function
  }, []); // The empty array [] means this runs only once

  // --- Render logic based on the state ---

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-xl text-gray-500">Loading schools...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center text-center p-4">
          <div>
            <h2 className="text-2xl font-semibold text-red-600">An Error Occurred</h2>
            <p className="text-gray-500 mt-2">{error}</p>
            <p className="text-gray-400 mt-4">This usually means the server could not connect to the database. Please check the Vercel logs.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- This is the successful render, same as before ---
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-800">Our Schools</h1>
              <p className="text-gray-500 mt-1">Discover the best schools available in our directory.</p>
            </div>
            <Link href="/addSchool" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md mt-4 sm:mt-0 whitespace-nowrap">
              + Add Your School
            </Link>
          </div>

          {schools && schools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg-grid-cols-3 xl:grid-cols-4 gap-8">
              {schools.map((school) => (
                <SchoolCard key={school._id} school={school} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-700">No Schools Found</h2>
              <p className="text-gray-500 mt-2">Be the first to add a school to our directory!</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}