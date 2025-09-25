"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ComparePage() {
  const searchParams = useSearchParams();
  const ids = searchParams.get('ids');
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (ids) {
      const schoolIds = ids.split(',');
      Promise.all(schoolIds.map(id => 
        fetch(`/api/schools/${id}`).then(res => res.json())
      )).then(data => {
        setSchools(data);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [ids]);

  if (isLoading) {
    return <p>Loading comparison...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">School Comparison</h1>
        {schools.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="w-full bg-gray-100 text-left">
                  <th className="p-3 font-semibold">Feature</th>
                  {schools.map(school => <th key={school._id} className="p-3 font-semibold">{school.name}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-gray-50"><td className="p-3 font-semibold">Rating</td>{schools.map(s => <td key={s._id} className="p-3 text-center">{s.rating.toFixed(1)}</td>)}</tr>
                <tr className="hover:bg-gray-50"><td className="p-3 font-semibold">City</td>{schools.map(s => <td key={s._id} className="p-3 text-center">{s.city}</td>)}</tr>
                <tr className="hover:bg-gray-50"><td className="p-3 font-semibold">State</td>{schools.map(s => <td key={s._id} className="p-3 text-center">{s.state}</td>)}</tr>
                <tr className="hover:bg-gray-50"><td className="p-3 font-semibold">Contact</td>{schools.map(s => <td key={s._id} className="p-3 text-center">{s.contact}</td>)}</tr>
              </tbody>
            </table>
          </div>
        ) : <p>No schools selected for comparison.</p>}
      </main>
      <Footer />
    </div>
  );
}