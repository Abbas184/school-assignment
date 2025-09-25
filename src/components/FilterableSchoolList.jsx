"use client";

import { useState, useEffect, useMemo, useTransition } from 'react';
import SchoolCard from '@/components/SchoolCard';

export default function FilterableSchoolList({ initialSchools, cities, states, session }) {
  const [schools, setSchools] = useState(initialSchools);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    state: '',
    sortBy: ''
  });
  const [isPending, startTransition] = useTransition();

  // --- THIS IS THE POLISHED LOGIC FOR CASCADING DROPDOWNS ---
  const dependentCities = useMemo(() => {
    // If no state is selected (i.e., the value is an empty string for "All States")
    if (!filters.state) {
      // Return the full, original list of all cities.
      return cities; 
    }
    
    // Otherwise, if a specific state IS selected...
    // Find all schools that are in that state.
    const citiesInState = initialSchools
      .filter(school => school.state === filters.state)
      .map(school => school.city);
    
    // Return a unique, sorted list of those specific cities.
    return [...new Set(citiesInState)].sort();
  }, [filters.state, cities, initialSchools]);
  // --- END OF POLISHED LOGIC ---

  useEffect(() => {
    startTransition(() => {
      const fetchFilteredSchools = async () => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.city) params.append('city', filters.city);
        if (filters.state) params.append('state', filters.state);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);

        try {
          const response = await fetch(`/api/getSchools?${params.toString()}`);
          const data = await response.json();
          setSchools(data);
        } catch (error) {
          console.error("Failed to fetch filtered schools:", error);
        }
      };
      
      fetchFilteredSchools();
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
    try {
      const res = await fetch(`/api/schools/${schoolId}`, { method: 'DELETE' });
      if (res.ok) {
        setSchools(currentSchools => currentSchools.filter(s => s._id !== schoolId));
        initialSchools = initialSchools.filter(s => s._id !== schoolId);
        alert('School deleted successfully.');
      } else {
        const data = await res.json();
        alert(`Failed to delete school: ${data.message}`);
      }
    } catch (error) {
      alert('An error occurred while deleting the school.');
    }
  };

  return (
    <div>
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
        {/* The City dropdown is now always enabled */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
          <select id="city" name="city" value={filters.city} onChange={handleFilterChange} className="mt-1 w-full p-2 border rounded-md">
            {/* --- The default option text is now more generic --- */}
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
            <SchoolCard key={school._id} school={school} session={session} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700">No Schools Found</h2>
          <p className="text-gray-500 mt-2">Try adjusting your filters or add a new school!</p>
        </div>
      )}
    </div>
  );
}