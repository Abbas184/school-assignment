import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

export const metadata = {
  title: "SchoolFinder",
  description: "Discover and manage school information",
};

// The RootLayout remains a clean Server Component.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* The AuthProvider now wraps ONLY the children, 
            not the core <html> and <body> tags. */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}