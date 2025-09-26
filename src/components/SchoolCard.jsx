"use client";
import Link from 'next/link';
import Image from 'next/image'; // <-- Import next/image
import { FaEdit, FaTrash } from 'react-icons/fa';
import StarRating from './StarRating';
import { useRouter } from 'next/navigation';

export default function SchoolCard({ school, session, onDelete }) {
  const router = useRouter();
  const handleDelete = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (window.confirm(`Delete ${school.name}?`)) onDelete(school._id);
  };
  const handleEdit = (e) => {
    e.preventDefault(); e.stopPropagation();
    router.push(`/edit-school/${school._id}`);
  };
  const displayRating = school.rating || 0;

  return (
    <Link href={`/school/${school._id}`} className="block bg-white border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl group">
      <div className="relative">
        <div className="w-full h-56 bg-gray-200 relative overflow-hidden">
          <Image 
            src={school.image} 
            alt={school.name}
            fill // 'fill' makes the image fill its parent
            sizes="(max-width: 768px) 100vw, 50vw, 33vw" // Helps Next.js optimize for different devices
            className="object-cover transition-transform duration-300 group-hover:scale-105" // 'object-cover' is a Tailwind class
          />
        </div>
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