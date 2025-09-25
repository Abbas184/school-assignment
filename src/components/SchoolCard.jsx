"use client";

import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';
import StarRating from './StarRating';
import { useState, useEffect } from 'react';

export default function SchoolCard({ school, session, onDelete }) {
  const [displayRating, setDisplayRating] = useState(0);

  // This hook correctly sets the rating for display
  useEffect(() => {
    if (school.rating) {
      // If a rating exists in the database, use it.
      setDisplayRating(school.rating);
    } else {
      // If not, generate a TEMPORARY random one for display only.
      const randomRating = (3.5 + Math.random() * 1.5);
      setDisplayRating(randomRating);
    }
  }, [school.rating]); // Re-run if the school data changes

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${school.name}? This action cannot be undone.`)) {
      onDelete(school._id);
    }
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 group">
      <div className="relative">
        <div className="w-full h-56 bg-gray-200">
          <img src={school.image} alt={school.name} className="w-full h-full object-cover" />
        </div>
        {/* Admin buttons are only visible to admin users on hover */}
        {session?.user?.role === 'admin' && (
          <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Corrected Link Path */}
            <Link href={`/edit-school/${school._id}`} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-lg">
              <FaEdit />
            </Link>
            <button onClick={handleDelete} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg">
              <FaTrash />
            </button>
          </div>
        )}
      </div>
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-900 truncate">{school.name}</h2>
        <p className="text-gray-600 text-sm mt-2">{school.address}</p>
        <p className="text-gray-500 text-sm">{school.city}</p>
        <div className="flex items-center mt-4">
          <StarRating rating={displayRating} />
          <span className="text-gray-600 font-bold ml-2">{displayRating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}