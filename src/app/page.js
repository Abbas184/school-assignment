import { redirect } from 'next/navigation';

export default function HomePage() {
  // This is a special Server Component that does only one thing:
  // it immediately redirects the user to the /showSchools page
  // whenever they visit the main root URL.
  redirect('/showSchools');

  // We return null because the user is sent away before anything can be rendered.
  return null;
}