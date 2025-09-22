import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-2xl text-center bg-white p-12 rounded-2xl shadow-xl">
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
          School Admin Portal
        </h1>

        <p className="text-lg text-gray-600 mb-12">
          Please choose an option to continue.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          
          <Link 
            href="/addSchool" 
            className="w-full sm:w-auto bg-blue-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300 shadow-md"
          >
            Add a New School
          </Link>
          
          <Link 
            href="/showSchools" 
            className="w-full sm:w-auto bg-gray-700 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-gray-800 transition-transform transform hover:scale-105 duration-300 shadow-md"
          >
            View All Schools
          </Link>

        </div>
      </div>
    </main>
  );
}