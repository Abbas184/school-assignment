import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CompareView from '@/components/CompareView'; // Import our new component

// This is now a simple Server Component
export default function ComparePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        {/* --- THIS IS THE FIX --- */}
        {/* We wrap the component that uses useSearchParams in a Suspense boundary. */}
        <Suspense fallback={<p>Loading comparison...</p>}>
          <CompareView />
        </Suspense>
        {/* --- END OF FIX --- */}
      </main>
      <Footer />
    </div>
  );
}