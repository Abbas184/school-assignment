import Header from '@/components/Header';
import Footer from '@/components/Footer';
import School from '@/models/School';
import dbConnect from '@/lib/db';
import StarRating from '@/components/StarRating';
import ReviewSection from '@/components/ReviewSection';
import Image from 'next/image';

// --- THIS IS THE CRITICAL, UN-COLLAPSED DATA FETCHING FUNCTION ---
async function getSchoolData(id) {
  try {
    await dbConnect();
    // Find the school by its ID and get a plain JavaScript object
    const school = await School.findById(id).lean();
    if (!school) {
      return null; // Return null if no school is found
    }
    // Convert the Mongoose document to a plain object that can be passed to client components
    return JSON.parse(JSON.stringify(school));
  } catch (error) {
    console.error("Error fetching school data:", error);
    return null; // Return null in case of a database error
  }
}
// --- END OF FUNCTION ---

export default async function SchoolDetailPage({ params }) {
  const school = await getSchoolData(params.id);

  // If the school is not found, display a clear message
  if (!school) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">404 - School Not Found</h1>
                    <p className="text-gray-600 mt-2">We couldn't find the school you were looking for.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  // If the school is found, render the full page with all details
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative w-full h-96">
              <Image 
                src={school.image} 
                alt={school.name} 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-lg object-cover" 
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-extrabold text-gray-900">{school.name}</h1>
              <p className="text-gray-700 mt-2">{school.address}, {school.city}, {school.state}</p>
              <div className="flex items-center mt-4">
                <StarRating rating={school.rating} />
                <span className="text-gray-800 font-bold ml-3 text-xl">{school.rating.toFixed(1)}</span>
                <span className="text-gray-600 ml-2">(based on user reviews)</span>
              </div>
              <div className="mt-6 border-t pt-4 space-y-2 text-gray-800">
                <p><strong>Contact:</strong> {school.contact}</p>
                <p><strong>Email:</strong> <a href={`mailto:${school.email_id}`} className="text-blue-600 hover:underline">{school.email_id}</a></p>
              </div>
            </div>
          </div>
        </div>
        {/* The ReviewSection is a separate component that handles its own data */}
        <ReviewSection schoolId={school._id} />
      </main>
      <Footer />
    </div>
  );
}