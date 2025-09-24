"use client";

import { SessionProvider } from 'next-auth/react';

// This component's only job is to be the client-side boundary
// for the SessionProvider.
export default function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}