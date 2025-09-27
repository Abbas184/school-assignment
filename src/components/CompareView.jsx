"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CompareView() {
  const searchParams = useSearchParams();
  const ids = searchParams.get('ids');
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (ids) {
      const schoolIds = ids.split(',');
      Promise.all(schoolIds.map(id => fetch(`/api/schools/${id}`).then(res => res.json())))
        .then(data => {
          setSchools(data);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [ids]);

  if (isLoading) return <p className="text-center py-10 text-gray-700">Loading comparison...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">School Comparison</h1>
      {schools.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="w-full bg-gray-100 text-left">
                <th className="p-3 font-semibold text-gray-800">Feature</th>
                {schools.map(school => <th key={school._id} className="p-3 font-semibold text-gray-800">{school.name}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50"><td className="p-3 font-semibold text-gray-800">Rating</td>{schools.map(s => <td key={s._id} className="p-3 text-center text-gray-800">{s.rating.toFixed(1)}</td>)}</tr>
              <tr className="hover:bg-gray-50"><td className="p-3 font-semibold text-gray-800">City</td>{schools.map(s => <td key={s._id} className="p-3 text-center text-gray-800">{s.city}</td>)}</tr>
              <tr className="hover:bg-gray-50"><td className="p-3 font-semibold text-gray-800">State</td>{schools.map(s => <td key={s._id} className="p-3 text-center text-gray-800">{s.state}</td>)}</tr>
              <tr className="hover:bg-gray-50"><td className="p-3 font-semibold text-gray-800">Contact</td>{schools.map(s => <td key={s._id} className="p-3 text-center text-gray-800">{s.contact}</td>)}</tr>
            </tbody>
          </table>
        </div>
      ) : <p className="text-gray-700">No schools selected for comparison.</p>}
    </div>
  );
}