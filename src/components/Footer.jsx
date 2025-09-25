"use client";

import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
import { useComparison } from './ComparisonContext';
import Link from 'next/link';

export default function Footer() {
  const { compareList } = useComparison();

  if (compareList.length > 0) {
    return (
      <footer className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-blue-600 p-4 text-center shadow-lg animate-slide-up">
          <Link href={`/compare?ids=${compareList.join(',')}`} className="font-bold text-lg text-white hover:underline">
            Compare {compareList.length} Schools
          </Link>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <p className="text-sm text-gray-400">&copy; 2025 SchoolFinder. All Rights Reserved.</p>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-white"><FaTwitter size={20} /></a>
          <a href="#" className="text-gray-400 hover:text-white"><FaFacebook size={20} /></a>
          <a href="#" className="text-gray-400 hover:text-white"><FaInstagram size={20} /></a>
        </div>
      </div>
    </footer>
  );
}