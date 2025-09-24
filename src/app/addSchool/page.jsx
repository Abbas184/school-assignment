"use client";

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AddSchoolPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  // --- CHANGE 1: We add 'watch' to our useForm hook ---
  // 'watch' lets us see the value of an input without causing extra re-renders.
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // --- CHANGE 2: We "watch" the image input ---
  // This will hold the FileList object when a user selects an image.
  const imageFile = watch('image');
  // We can then get the name of the selected file to display to the user.
  const fileName = imageFile?.[0]?.name || "No file chosen";

  const onSubmit = async (data) => {
    // ... (The onSubmit function remains exactly the same)
    setIsSubmitting(true);
    setErrorMessage('');
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'image') {
        formData.append(key, data.image[0]);
      } else {
        formData.append(key, data[key]);
      }
    });
    try {
      const response = await fetch('/api/addSchool', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        alert('School added successfully!');
        router.push('/showSchools');
      } else {
        const result = await response.json();
        setErrorMessage(`Error: ${result.message || 'Something went wrong.'}`);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please check your connection.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Security checks remain the same ---
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }
  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
            <p className="mt-4 text-gray-600">You must be logged in as an admin to access this page.</p>
            <button onClick={() => router.push('/login')} className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
              Go to Login
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- The main form render ---
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Add School Information</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* ... (All other form fields remain the same) ... */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">School Name</label>
                <input id="name" {...register('name', { required: 'School name is required' })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input id="address" {...register('address', { required: 'Address is required' })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                    <input id="city" {...register('city', { required: 'City is required' })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                    <input id="state" {...register('state', { required: 'State is required' })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                </div>
            </div>
            <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input id="contact" type="text" {...register('contact', { required: 'Contact is required', pattern: { value: /^[0-9]+$/, message: "Please enter a valid number." } })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact.message}</p>}
            </div>
            <div>
                <label htmlFor="email_id" className="block text-sm font-medium text-gray-700">Email ID</label>
                <input id="email_id" type="email" {...register('email_id', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                {errors.email_id && <p className="text-red-500 text-xs mt-1">{errors.email_id.message}</p>}
            </div>

            {/* --- CHANGE 3: This is the new, improved file input section --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700">School Image</label>
              <div className="mt-1 flex items-center">
                {/* This is the visible "button" the user clicks */}
                <label htmlFor="image" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                  Upload File
                </label>
                {/* This is the actual file input, but it's hidden */}
                <input 
                  id="image" 
                  type="file" 
                  accept="image/*" 
                  {...register('image', { required: 'School image is required' })}
                  className="hidden" 
                />
                {/* This displays the name of the selected file for user feedback */}
                <span className="ml-3 text-gray-500">{fileName}</span>
              </div>
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
            </div>
            {/* --- END OF FILE INPUT SECTION --- */}
            
            {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}

            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
              {isSubmitting ? 'Submitting...' : 'Add School'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}