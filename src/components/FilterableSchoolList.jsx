"use client";
import { useState, useEffect, useTransition } from 'react';
import SchoolCard from '@/components/SchoolCard';
import Pagination from './Pagination'; // <-- Import
import { useRouter, useSearchParams } from 'next/navigation';

export default function FilterableSchoolList({ initialData, cities, states, session, userFavorites }) {
  const [schools, setSchools] = useState(initialData.schools);
  const [pagination, setPagination] = useState({ currentPage: initialData.currentPage, totalPages: initialData.totalPages });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setSchools(initialData.schools);
    setPagination({ currentPage: initialData.currentPage, totalPages: initialData.totalPages });
  }, [initialData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams);
    if (value) params.set(name, value);
    else params.delete(name);
    params.set('page', '1');
    startTransition(() => router.push(`/showSchools?${params.toString()}`));
  };

  const handleDelete = async (schoolId) => {
    if(window.confirm("Are you sure?")) {
        const res = await fetch(`/api/schools/${schoolId}`, { method: 'DELETE' });
        if (res.ok) router.refresh();
    }
  };
  
  return (
    <div>
       <div className="bg-white p-4 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
         <input name="search" defaultValue={searchParams.get('search') || ''} onChange={handleFilterChange} placeholder="Search..." className="p-2 border rounded" />
         <select name="state" defaultValue={searchParams.get('state') || ''} onChange={handleFilterChange} className="p-2 border rounded">
            <option value="">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
         </select>
         <select name="city" defaultValue={searchParams.get('city') || ''} onChange={handleFilterChange} className="p-2 border rounded">
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
         </select>
         <select name="sortBy" defaultValue={searchParams.get('sortBy') || ''} onChange={handleFilterChange} className="p-2 border rounded">
            <option value="">Default</option>
            <option value="a_z">Name (A-Z)</option>
            <option value="rating_desc">Rating (High-Low)</option>
         </select>
       </div>
      {isPending ? <p className="text-center">Loading...</p> : schools.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {schools.map((school) => (
              <SchoolCard key={school._id} school={school} session={session} onDelete={handleDelete} />
            ))}
          </div>
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
        </>
      ) : <p className="text-center">No schools found.</p>}
    </div>
  );
}