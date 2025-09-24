import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSchools } from '@/lib/data'; // Import the direct data fetching function
import SchoolList from '@/components/SchoolList'; // Import our new interactive component

// This is now a Server Component again (no "use client")
export default async function ShowSchoolsPage() {
  // 1. Fetch the data on the SERVER before sending anything to the user.
  const initialSchools = await getSchools();

  // 2. Render the page with all components.
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-800">Our Schools</h1>
              <p className="text-gray-500 mt-1">Discover the best schools in our directory.</p>
            </div>
            <Link href="/addSchool" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md mt-4 sm:mt-0 whitespace-nowrap">
              + Add Your School
            </Link>
          </div>

          {/* 3. Pass the pre-loaded data to our interactive client component */}
          <SchoolList initialSchools={initialSchools} />

        </div>
      </main>
      <Footer />
    </div>
  );
}