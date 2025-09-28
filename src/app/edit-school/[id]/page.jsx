"use client";
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header'; // <-- Restored
import Footer from '@/components/Footer'; // <-- Restored
import { toast } from 'react-hot-toast';

export default function EditSchoolPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schoolName, setSchoolName] = useState('Loading...');

  useEffect(() => {
    if (id) {
      fetch(`/api/schools/${id}`).then(res => res.json()).then(data => {
        if (data) { reset(data); setSchoolName(data.name); }
      });
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Updating...');
    try {
      const response = await fetch(`/api/schools/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (response.ok) {
        toast.success('School updated!', { id: toastId });
        router.push('/showSchools');
      } else {
        const result = await response.json();
        toast.error(`Error: ${result.message || 'Failed to update.'}`, { id: toastId });
      }
    } catch (error) {
      toast.error('An unexpected error occurred.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center"><p>Access Denied.</p></main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
            Edit: <span className="text-blue-600">{schoolName}</span>
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <input id="googleMapsLink" type="url" {...register('googleMapsLink', { required: 'Link is required' })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
              {errors.googleMapsLink && <p className="text-red-500 text-xs mt-1">{errors.googleMapsLink.message}</p>}
            </div>
            <p className="text-xs text-gray-500">Note: Image cannot be changed from the edit form.</p>
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}