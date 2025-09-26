"use client";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ currentPage, totalPages }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-4 mt-8">
      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1} className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50">Previous</button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50">Next</button>
    </div>
  );
}