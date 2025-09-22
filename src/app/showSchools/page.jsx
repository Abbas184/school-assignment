import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SchoolCard from '@/components/SchoolCard';
import { getSchools } from '@/lib/data'; // <-- IMPORT THE DIRECT LOGIC

export default async function ShowSchoolsPage() {
  // No more fetch! Just call the function directly.
  const schools = await getSchools();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-800">Our Schools</h1>
              <p className="text-gray-500 mt-1">Discover the best schools available in our directory.</p>
            </div>
            <Link href="/addSchool" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md mt-4 sm:mt-0 whitespace-nowrap">
              + Add Your School
            </Link>
          </div>

          {schools && schools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {schools.map((school) => (
                <SchoolCard key={school._id} school={school} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-700">No Schools Found</h2>
              <p className="text-gray-500 mt-2">Be the first to add a school to our directory!</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}