import Header from '@/components/Header';
import Footer from '@/components/Footer';
import School from '@/models/School';
import dbConnect from '@/lib/db';
import StarRating from '@/components/StarRating';
import ReviewSection from '@/components/ReviewSection';

async function getSchoolData(id) {
  await dbConnect();
  try {
    const school = await School.findById(id).lean();
    if (!school) return null;
    return JSON.parse(JSON.stringify(school));
  } catch (error) {
    console.error("Failed to fetch school data:", error);
    return null;
  }
}

export default async function SchoolDetailPage({ params }) {
  const school = await getSchoolData(params.id);

  if (!school) {
    return <div>School not found or an error occurred.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img src={school.image} alt={school.name} className="w-full h-auto rounded-lg object-cover" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-800">{school.name}</h1>
              <p className="text-gray-600 mt-2">{school.address}, {school.city}, {school.state}</p>
              <div className="flex items-center mt-4">
                <StarRating rating={school.rating} />
                <span className="text-gray-700 font-bold ml-3 text-xl">{school.rating.toFixed(1)}</span>
                <span className="text-gray-500 ml-2">(based on user reviews)</span>
              </div>
              <div className="mt-6 border-t pt-4 space-y-2">
                <p><strong>Contact:</strong> {school.contact}</p>
                <p><strong>Email:</strong> <a href={`mailto:${school.email_id}`} className="text-blue-600 hover:underline">{school.email_id}</a></p>
              </div>
            </div>
          </div>
        </div>
        <ReviewSection schoolId={school._id} />
      </main>
      <Footer />
    </div>
  );
}