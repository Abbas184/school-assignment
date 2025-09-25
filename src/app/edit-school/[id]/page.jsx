"use client";

import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function EditSchoolPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [schoolName, setSchoolName] = useState('Loading...');

  // Fetch the existing school data when the page loads
  useEffect(() => {
    if (id) {
      fetch(`/api/schools/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            reset(data); // Pre-fill the form with fetched data
            setSchoolName(data.name);
          }
        });
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      // Convert rating to a number just in case it's a string from the form
      const updatedData = { ...data, rating: Number(data.rating) };

      const response = await fetch(`/api/schools/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert('School updated successfully!');
        router.push('/showSchools');
      } else {
        const result = await response.json();
        setErrorMessage(result.message || 'Failed to update school.');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return <p>Loading session...</p>;
  }
  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    return <p>Access Denied. You must be an admin to edit schools.</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Edit: <span className="text-blue-600">{schoolName}</span>
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <input id="contact" type="text" {...register('contact', { required: 'Contact is required' })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
              {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact.message}</p>}
            </div>
            <div>
              <label htmlFor="email_id" className="block text-sm font-medium text-gray-700">Email ID</label>
              <input id="email_id" type="email" {...register('email_id', { required: 'Email is required' })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
              {errors.email_id && <p className="text-red-500 text-xs mt-1">{errors.email_id.message}</p>}
            </div>
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
              <input id="rating" type="number" step="0.1" {...register('rating', { required: 'Rating is required', valueAsNumber: true, min: { value: 1, message: 'Must be at least 1' }, max: { value: 5, message: 'Must be no more than 5' } })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
              {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>}
            </div>
            <p className="text-xs text-gray-500">Note: Image cannot be changed from the edit form.</p>
            {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}