import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import School from '@/models/School';
import dbConnect from '@/lib/db';
import FilterableSchoolList from '@/components/FilterableSchoolList';

async function getPageData() {
  await dbConnect();
  const [session, initialSchools, states, cities] = await Promise.all([
    getServerSession(authOptions),
    School.find({}).sort({ _id: -1 }).lean(),
    School.distinct('state').then(s => s.sort()),
    School.distinct('city').then(c => c.sort())
  ]);
  return { 
    session, 
    initialSchools: JSON.parse(JSON.stringify(initialSchools)), 
    states, 
    cities 
  };
}

export default async function ShowSchoolsPage() {
  const { session, initialSchools, states, cities } = await getPageData();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-800">Our Schools</h1>
              <p className="text-gray-500 mt-1">Discover and filter the best schools in our directory.</p>
            </div>
            {session?.user?.role === 'admin' && (
              <Link href="/addSchool" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md mt-4 sm:mt-0 whitespace-nowrap">
                + Add Your School
              </Link>
            )}
          </div>
          <FilterableSchoolList 
            initialSchools={initialSchools} 
            cities={cities}
            states={states}
            session={session}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}