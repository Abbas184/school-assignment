"use client";
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'react-hot-toast';

export default function AddSchoolPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageFile = watch('image');
  const fileName = imageFile?.[0]?.name || "No file chosen";

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Adding school...');
    const formData = new FormData();

    // --- THIS IS THE FIX ---
    // We now correctly append ALL fields from the form data to the FormData object.
    formData.append('name', data.name);
    formData.append('address', data.address);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('contact', data.contact);
    formData.append('email_id', data.email_id);
    formData.append('rating', data.rating);
    formData.append('googleMapsLink', data.googleMapsLink); // <-- The missing line
    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]);
    }
    // --- END OF FIX ---

    try {
      const response = await fetch('/api/addSchool', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        toast.success('School added successfully!', { id: toastId });
        router.push('/showSchools');
      } else {
        toast.error(`Error: ${result.message || 'Something went wrong.'}`, { id: toastId });
      }
    } catch (error) {
      toast.error('An unexpected error occurred.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading session...</p></div>;
  }
  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
            <p className="mt-4 text-gray-600">You must be an admin to access this page.</p>
            <button onClick={() => router.push('/login')} className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-md">Go to Login</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Add School Information</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* --- ALL LABELS ARE NOW DARK --- */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-800">School Name</label>
              <input id="name" {...register('name', { required: 'School name is required' })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-800">Address</label>
              <input id="address" {...register('address', { required: 'Address is required' })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-800">City</label>
                <input id="city" {...register('city', { required: 'City is required' })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-800">State</label>
                <input id="state" {...register('state', { required: 'State is required' })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-800">Contact Number</label>
              <input id="contact" type="text" {...register('contact', { required: 'Contact is required' })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
              {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact.message}</p>}
            </div>
            <div>
              <label htmlFor="email_id" className="block text-sm font-medium text-gray-800">Email ID</label>
              <input id="email_id" type="email" {...register('email_id', { required: 'Email is required' })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
              {errors.email_id && <p className="text-red-500 text-xs mt-1">{errors.email_id.message}</p>}
            </div>
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-800">Rating (1-5)</label>
              <input id="rating" type="number" step="0.1" {...register('rating', { required: 'Rating is required', valueAsNumber: true, min: 1, max: 5 })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
              {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>}
            </div>
            <div>
              <label htmlFor="googleMapsLink" className="block text-sm font-medium text-gray-800">Google Maps Link</label>
              <input id="googleMapsLink" type="url" placeholder="https://www.google.com/maps/..." {...register('googleMapsLink', { required: 'Google Maps link is required', pattern: { value: /^(https?:\/\/)?(www\.)?google\.com\/maps/, message: 'Please enter a valid Google Maps URL' } })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
              {errors.googleMapsLink && <p className="text-red-500 text-xs mt-1">{errors.googleMapsLink.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">School Image</label>
              <div className="mt-1 flex items-center">
                <label htmlFor="image" className="cursor-pointer bg-white py-2 px-3 border rounded-md text-sm text-gray-700 hover:bg-gray-50">Upload File</label>
                <input id="image" type="file" accept="image/*" {...register('image', { required: 'School image is required' })} className="hidden" />
                <span className="ml-3 text-gray-500">{fileName}</span>
              </div>
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
            </div>
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