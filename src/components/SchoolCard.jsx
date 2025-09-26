"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FaEdit, FaTrash, FaBalanceScale } from 'react-icons/fa'; // <-- Import the compare icon
import StarRating from './StarRating';
import { useRouter } from 'next/navigation';
import { useComparison } from './ComparisonContext'; // <-- Import the compare context

export default function SchoolCard({ school, session, onDelete }) {
  const router = useRouter();
  const { compareList, toggleCompare } = useComparison(); // <-- Use the context

  const handleDelete = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (window.confirm(`Delete ${school.name}?`)) onDelete(school._id);
  };
  
  const handleEdit = (e) => {
    e.preventDefault(); e.stopPropagation();
    router.push(`/edit-school/${school._id}`);
  };

  // --- THIS IS THE NEWLY ADDED FUNCTION ---
  const handleCompareToggle = (e) => {
    e.preventDefault(); e.stopPropagation();
    toggleCompare(school._id);
  };
  // --- END OF NEW FUNCTION ---

  const displayRating = school.rating || 0;
  const isInCompare = compareList.includes(school._id);

  return (
    <Link href={`/school/${school._id}`} className="block bg-white border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl group">
      <div className="relative">
        <div className="w-full h-56 bg-gray-200 relative overflow-hidden">
          <Image 
            src={school.image} 
            alt={school.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* --- THIS IS THE NEWLY ADDED COMPARE ICON --- */}
        <div 
          onClick={handleCompareToggle} 
          className={`absolute top-2 left-2 flex items-center p-2 rounded-full cursor-pointer transition-all ${isInCompare ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 opacity-0 group-hover:opacity-100'}`}
          title={isInCompare ? "Remove from Compare" : "Add to Compare"}
        >
          <FaBalanceScale size={18} />
        </div>
        {/* --- END OF COMPARE ICON --- */}

        {session?.user?.role === 'admin' && (
          <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100">
            <button onClick={handleEdit} className="bg-blue-600 text-white p-2 rounded-full"><FaEdit /></button>
            <button onClick={handleDelete} className="bg-red-600 text-white p-2 rounded-full"><FaTrash /></button>
          </div>
        )}
      </div>
      <div className="p-5">
        <h2 className="text-xl font-bold truncate">{school.name}</h2>
        <p className="text-gray-500 text-sm">{school.city}</p>
        <div className="flex items-center mt-4">
          <StarRating rating={displayRating} />
          <span className="text-gray-600 font-bold ml-2">{displayRating.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}