"use client";

import { useState, useEffect, useMemo, useTransition } from 'react';
import SchoolCard from '@/components/SchoolCard';
import Pagination from './Pagination';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function FilterableSchoolList({ initialData, states, stateCityMap, session, userFavorites, searchParams }) {
  const [schools, setSchools] = useState(initialData?.schools || []);
  const [pagination, setPagination] = useState({ 
    currentPage: initialData?.currentPage || 1, 
    totalPages: initialData?.totalPages || 1 
  });
  const [favorites, setFavorites] = useState(userFavorites || []);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [filters, setFilters] = useState({
    search: searchParams.search || '',
    city: searchParams.city || '',
    state: searchParams.state || '',
    sortBy: searchParams.sortBy || ''
  });

  // --- THIS IS THE FIX ---
  const dependentCities = useMemo(() => {
    // If no state is selected ("All States"), return ALL unique cities.
    if (!filters.state) {
      // We can get all cities by combining the values from our stateCityMap
      const allCities = Object.values(stateCityMap).flat();
      return [...new Set(allCities)].sort();
    }
    // If a specific state is selected, return only its cities.
    return stateCityMap[filters.state] || [];
  }, [filters.state, stateCityMap]);
  // --- END OF FIX ---

  useEffect(() => {
    setSchools(initialData?.schools || []);
    setPagination({
      currentPage: initialData?.currentPage || 1,
      totalPages: initialData?.totalPages || 1
    });
  }, [initialData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    if (name === 'state') {
      newFilters.city = '';
    }
    setFilters(newFilters);

    const params = new URLSearchParams(window.location.search);
    Object.keys(newFilters).forEach(key => {
        if (newFilters[key]) params.set(key, newFilters[key]);
        else params.delete(key);
    });
    params.set('page', '1');
    
    startTransition(() => {
      router.push(`/showSchools?${params.toString()}`);
    });
  };
  
  const handleDelete = async (schoolId) => {
      if (window.confirm("Are you sure?")) {
          const res = await fetch(`/api/schools/${schoolId}`, { method: 'DELETE' });
          if (res.ok) {
              toast.success("School deleted.");
              router.refresh();
          }
      }
  };

  const handleFavoriteToggle = async (schoolId) => {
      const res = await fetch('/api/favorites', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ schoolId }) });
      const data = await res.json();
      if (res.ok) {
          toast.success(data.message);
          setFavorites(data.favorites);
      }
  };

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search..." className="p-2 border rounded" />
        <select name="state" value={filters.state} onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">All States</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {/* The "disabled" attribute is now removed */}
        <select name="city" value={filters.city} onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">All Cities</option>
          {dependentCities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">Default</option>
          <option value="a_z">Name (A-Z)</option>
          <option value="rating_desc">Rating (High-Low)</option>
        </select>
      </div>

      {isPending ? <p>Loading...</p> : schools.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {schools.map((school) => (
              <SchoolCard 
                key={school._id} 
                school={school} 
                session={session} 
                onDelete={handleDelete}
                isFavorite={favorites.includes(school._id)}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
        </>
      ) : <p>No schools found.</p>}
    </div>
  );
}