"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Header from '@/components/Header'; // The only change is how we use this
import Footer from '@/components/Footer';
import SchoolCard from '@/components/SchoolCard';

export default function ShowSchoolsPage() {
  // --- State Management ---
  const [schools, setSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // This state now lives in the page
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching (Debounced) ---
  // This logic remains exactly the same as before.
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setIsLoading(true);
      setError(null);
      
      const url = searchTerm 
        ? `/api/getSchools?search=${searchTerm}` 
        : '/api/getSchools';
        
      fetch(url)
        .then(res => {
          if (!res.ok) { throw new Error('Network response was not ok'); }
          return res.json();
        })
        .then(data => setSchools(data))
        .catch(err => {
          setError('Failed to load schools. Please try again later.');
          console.error(err);
        })
        .finally(() => setIsLoading(false));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* --- The Key Change is Here --- */}
      {/* We now pass the search state and the function to update it TO the Header */}
      <Header 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-800">Our Schools</h1>
              <p className="text-gray-500 mt-1">Discover the best schools in our directory.</p>
            </div>
            <Link href="/addSchool" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md mt-4 sm:mt-0 whitespace-nowrap">
              + Add Your School
            </Link>
          </div>

          {/* --- The search bar that was here has been REMOVED --- */}
          
          {/* --- Conditional Rendering Logic (same as before) --- */}
          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : schools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {schools.map((school) => (
                <SchoolCard key={school._id} school={school} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-700">No Schools Found</h2>
              <p className="text-gray-500 mt-2">Try adjusting your search or add a new school!</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}