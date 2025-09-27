"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FaEdit, FaTrash, FaBalanceScale } from 'react-icons/fa';
import StarRating from './StarRating';
import { useRouter } from 'next/navigation';
import { useComparison } from './ComparisonContext';

export default function SchoolCard({ school, session, onDelete }) {
  const router = useRouter();
  const { compareList, toggleCompare } = useComparison();
  const isInCompare = compareList.includes(school._id);

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
    toggleCompare(school._id);
  };

  const displayRating = school.rating || 0;

  return (
    <Link href={`/school/${school._id}`} className="block bg-white border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl group transition-transform transform hover:-translate-y-1">
      <div className="relative">
        <div className="w-full h-56 bg-gray-200 relative overflow-hidden">
          <Image 
            src={school.image} 
            alt={school.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        </div>

        {/* --- FIX 1: Icons are now always visible --- */}
        <button 
          onClick={handleCompareToggle} 
          className={`absolute top-2 left-2 flex items-center p-2 rounded-full cursor-pointer transition-colors ${isInCompare ? 'bg-blue-600 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'}`}
          title={isInCompare ? "Remove from Compare" : "Add to Compare"}
        >
          <FaBalanceScale size={18} />
        </button>
        
        {session?.user?.role === 'admin' && (
          <div className="absolute top-2 right-2 flex space-x-2">
            <button onClick={handleEdit} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-lg" title="Edit School"><FaEdit /></button>
            <button onClick={handleDelete} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg" title="Delete School"><FaTrash /></button>
          </div>
        )}
        {/* --- END OF FIX 1 --- */}
      </div>
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-900 truncate">{school.name}</h2>
        
        {/* --- FIX 2: Darker text for address and city --- */}
        <p className="text-gray-700 text-sm mt-2">{school.address}</p>
        <p className="text-gray-700 text-sm">{school.city}</p>
        {/* --- END OF FIX 2 --- */}

        <div className="flex items-center mt-4">
          <StarRating rating={displayRating} />
          <span className="text-gray-800 font-bold ml-2">{displayRating.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}