"use client";

import { useState, useEffect, useMemo, useTransition } from 'react';
import SchoolCard from '@/components/SchoolCard';
import { useComparison } from './ComparisonContext'; // <-- Import the context hook

export default function FilterableSchoolList({ initialSchools, cities, states, session }) {
  const [schools, setSchools] = useState(initialSchools);
  const [filters, setFilters] = useState({ search: '', city: '', state: '', sortBy: '' });
  const [isPending, startTransition] = useTransition();
  
  const { compareList, toggleCompare } = useComparison(); // <-- Use the context

  const dependentCities = useMemo(() => {
    if (!filters.state) return cities;
    const citiesInState = initialSchools
      .filter(school => school.state === filters.state)
      .map(school => school.city);
    return [...new Set(citiesInState)].sort();
  }, [filters.state, cities, initialSchools]);

  useEffect(() => {
    startTransition(() => {
      // ... (fetch logic remains the same)
      const params = new URLSearchParams(Object.entries(filters).filter(([_, value]) => value));
      fetch(`/api/getSchools?${params.toString()}`)
        .then(res => res.json())
        .then(data => setSchools(data))
        .catch(error => console.error("Failed to fetch filtered schools:", error));
    });
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'state') {
      setFilters(prev => ({ ...prev, state: value, city: '' }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDelete = async (schoolId) => {
    // ... (delete logic remains the same)
    if (window.confirm("Are you sure?")) {
        const res = await fetch(`/api/schools/${schoolId}`, { method: 'DELETE' });
        if (res.ok) {
            setSchools(current => current.filter(s => s._id !== schoolId));
        }
    }
  };

  return (
    <div>
      {/* ... (Filter Bar remains the same) ... */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search by Name</label>
          <input id="search" name="search" type="text" placeholder="e.g., Central High" value={filters.search} onChange={handleFilterChange} className="mt-1 w-full p-2 border rounded-md" />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
          <select id="state" name="state" value={filters.state} onChange={handleFilterChange} className="mt-1 w-full p-2 border rounded-md">
            <option value="">All States</option>
            {states.map(state => <option key={state} value={state}>{state}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
          <select id="city" name="city" value={filters.city} onChange={handleFilterChange} className="mt-1 w-full p-2 border rounded-md">
            <option value="">All Cities</option>
            {dependentCities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">Sort By</label>
          <select id="sortBy" name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="mt-1 w-full p-2 border rounded-md">
            <option value="">Default (Newest)</option>
            <option value="a_z">Name (A-Z)</option>
            <option value="rating_desc">Rating (High to Low)</option>
          </select>
        </div>
      </div>

      {isPending ? (
        <p className="text-center text-gray-500 py-10">Updating list...</p>
      ) : schools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {schools.map((school) => (
            <SchoolCard 
              key={school._id} 
              school={school} 
              session={session} 
              onDelete={handleDelete}
              // --- Pass the new comparison props down ---
              isInCompare={compareList.includes(school._id)}
              onCompareToggle={() => toggleCompare(school._id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700">No Schools Found</h2>
            <p className="text-gray-500 mt-2">Try adjusting your filters!</p>
        </div>
      )}
    </div>
  );
}