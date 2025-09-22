"use client";
import StarRating from './StarRating';
import { useState, useEffect } from 'react';

export default function SchoolCard({ school }) {
  const [rating, setRating] = useState(0);

  // This ensures the random rating is generated only once when the component mounts
  useEffect(() => {
    // Generate a random rating between 3.5 and 5
    const randomRating = (3.5 + Math.random() * 1.5).toFixed(1);
    setRating(parseFloat(randomRating));
  }, []);

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
      <div className="w-full h-56 bg-gray-200">
        <img src={school.image} alt={school.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-900 truncate">{school.name}</h2>
        <p className="text-gray-600 text-sm mt-2">{school.address}</p>
        <p className="text-gray-500 text-sm">{school.city}</p>
        
        {/* New Rating Section */}
        <div className="flex items-center mt-4">
          <StarRating rating={rating} />
          <span className="text-gray-600 font-bold ml-2">{rating}</span>
        </div>
      </div>
    </div>
  );
}