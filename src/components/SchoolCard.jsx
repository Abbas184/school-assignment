"use client";

import Link from 'next/link';
import { FaEdit, FaTrash, FaBalanceScale } from 'react-icons/fa';
import StarRating from './StarRating';
import { useRouter } from 'next/navigation';

export default function SchoolCard({ school, session, onDelete, isInCompare, onCompareToggle }) {
  const router = useRouter();
  
  const handleDelete = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (window.confirm(`Delete ${school.name}?`)) onDelete(school._id);
  };
  
  const handleEdit = (e) => {
    e.preventDefault(); e.stopPropagation();
    router.push(`/edit-school/${school._id}`);
  };

  const handleCompareToggle = (e) => {
    e.preventDefault(); e.stopPropagation();
    onCompareToggle();
  };

  const displayRating = school.rating || 0;

  return (
    <Link href={`/school/${school._id}`} className="block bg-white border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 group">
      <div className="relative">
        <div className="w-full h-56 bg-gray-200">
          <img src={school.image} alt={school.name} className="w-full h-full object-cover" />
        </div>
        {/* --- Add to Compare Checkbox --- */}
        <div 
          onClick={handleCompareToggle} 
          className={`absolute top-2 left-2 flex items-center space-x-2 p-2 rounded-full cursor-pointer transition-all ${isInCompare ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 opacity-0 group-hover:opacity-100'}`}
          title="Add to Compare"
        >
          <FaBalanceScale />
        </div>
        {session?.user?.role === 'admin' && (
          <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleEdit} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-lg"><FaEdit /></button>
            <button onClick={handleDelete} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg"><FaTrash /></button>
          </div>
        )}
      </div>
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-900 truncate">{school.name}</h2>
        <p className="text-gray-500 text-sm">{school.city}</p>
        <div className="flex items-center mt-4">
          <StarRating rating={displayRating} />
          <span className="text-gray-600 font-bold ml-2">{displayRating.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}