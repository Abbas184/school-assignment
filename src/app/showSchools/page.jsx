import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import School from '@/models/School';
import User from '@/models/User';
import dbConnect from '@/lib/db';
import FilterableSchoolList from '@/components/FilterableSchoolList';

const SCHOOLS_PER_PAGE = 8;

async function getPageData({ search, city, state, sortBy, page: pageStr }) {
  await dbConnect();
  
  const page = parseInt(pageStr || '1', 10);
  const skip = (page - 1) * SCHOOLS_PER_PAGE;
  
  const filter = {};
  if (search) filter.name = { $regex: search, $options: "i" };
  if (city) filter.city = city;
  if (state) filter.state = state;
  
  let sortOptions = { _id: -1 };
  if (sortBy === 'a_z') sortOptions = { name: 1 };
  if (sortBy === 'rating_desc') sortOptions = { rating: -1 };

  const session = await getServerSession(authOptions);
  
  const userFavoritesPromise = session?.user?.id 
    ? User.findById(session.user.id).select('favorites').lean() 
    : Promise.resolve(null);
  
  const allSchoolsForFiltering = await School.find({}, 'city state').lean();
  
  const states = [...new Set(allSchoolsForFiltering.map(s => s.state))].sort();
  
  const stateCityMap = allSchoolsForFiltering.reduce((acc, school) => {
    if (!acc[school.state]) {
      acc[school.state] = new Set();
    }
    acc[school.state].add(school.city);
    return acc;
  }, {});

  for (const state in stateCityMap) {
    stateCityMap[state] = [...stateCityMap[state]].sort();
  }

  const [initialSchools, totalSchools, user] = await Promise.all([
    School.find(filter).sort(sortOptions).skip(skip).limit(SCHOOLS_PER_PAGE).lean(),
    School.countDocuments(filter),
    userFavoritesPromise
  ]);

  return { 
    session,
    initialData: {
        schools: JSON.parse(JSON.stringify(initialSchools)),
        currentPage: page,
        totalPages: Math.ceil(totalSchools / SCHOOLS_PER_PAGE)
    },
    states, 
    stateCityMap,
    userFavorites: (user && user.favorites) ? user.favorites.map(f => f.toString()) : []
  };
}

export default async function ShowSchoolsPage({ searchParams }) {
  const { session, initialData, states, stateCityMap, userFavorites } = await getPageData(searchParams);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold">Our Schools</h1>
          
          {/* --- THIS IS THE FIX --- */}
          {session?.user?.role === 'admin' && (
            <Link 
              href="/addSchool" 
              className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md mt-4 sm:mt-0 whitespace-nowrap"
            >
              + Add Your School
            </Link>
          )}
          {/* --- END OF FIX --- */}

        </div>
        <FilterableSchoolList 
          initialData={initialData} 
          states={states}
          stateCityMap={stateCityMap}
          session={session}
          userFavorites={userFavorites}
          searchParams={searchParams}
        />
      </main>
      <Footer />
    </div>
  );
}