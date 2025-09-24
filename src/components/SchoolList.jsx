"use client";

import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import SchoolCard from '@/components/SchoolCard';

// This component receives the initial list of schools from the server
export default function SchoolList({ initialSchools }) {
  // The state now starts with the pre-loaded data
  const [schools, setSchools] = useState(initialSchools);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Only for search loading

  // A simple function to handle the search logic
  const handleSearch = async (term) => {
    setSearchTerm(term);
    setIsLoading(true);

    // Fetch only when the user searches
    const url = term ? `/api/getSchools?search=${term}` : '/api/getSchools';
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSchools(data);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* The Search Bar now lives inside this component */}
      <div className="relative w-full max-w-2xl mx-auto mb-10">
        <input 
          type="text" 
          placeholder="Search by school name..." 
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border rounded-full text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 text-xl" />
      </div>

      {/* Rendering Logic */}
      {isLoading ? (
        <p className="text-center text-gray-500">Searching...</p>
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
  );
}