"use client";

import { SessionProvider } from 'next-auth/react';
import { ComparisonProvider } from './ComparisonContext';
import { Toaster } from 'react-hot-toast';

export default function AuthProvider({ children }) {
  return (
    <SessionProvider>
      <ComparisonProvider>
        {/* --- THIS IS THE FIX --- */}
        {/* Change position from "bottom-center" to "top-center" */}
        <Toaster position="top-center" />
        {/* --- END OF FIX --- */}
        {children}
      </ComparisonProvider>
    </SessionProvider>
  );
}