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

  const [initialSchools, totalSchools, states, cities, user] = await Promise.all([
    School.find(filter).sort(sortOptions).skip(skip).limit(SCHOOLS_PER_PAGE).lean(),
    School.countDocuments(filter),
    School.distinct('state').then(s => s.sort()),
    School.distinct('city').then(c => c.sort()),
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
    cities,
    // --- THIS IS THE FIX ---
    // We now safely check if 'user' exists AND if 'user.favorites' exists
    // before we try to map over it. If either is missing, we return an empty array.
    userFavorites: (user && user.favorites) ? user.favorites.map(f => f.toString()) : []
    // --- END OF FIX ---
  };
}

export default async function ShowSchoolsPage({ searchParams }) {
  const { session, initialData, states, cities, userFavorites } = await getPageData(searchParams);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold">Our Schools</h1>
          {session?.user?.role === 'admin' && <Link href="/addSchool" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg">+ Add School</Link>}
        </div>
        <FilterableSchoolList 
          initialData={initialData} 
          cities={cities}
          states={states}
          session={session}
          userFavorites={userFavorites}
        />
      </main>
      <Footer />
    </div>
  );
}