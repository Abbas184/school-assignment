"use client";
import { useForm } from 'react-hook-form'; // <-- This was the missing part
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        alert('Registration successful! Please log in.');
        router.push('/login');
      } else {
        const errorData = await res.json();
        setServerError(errorData.message || 'Something went wrong.');
      }
    } catch (err) {
      setServerError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Create an Account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800">Name</label>
              <input {...register('name', { required: 'Name is required' })} className="w-full px-3 py-2 border rounded-md" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Email</label>
              <input type="email" {...register('email', { required: 'Email is required' })} className="w-full px-3 py-2 border rounded-md" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Mobile Number</label>
              <input type="tel" {...register('mobile', { required: 'Mobile number is required' })} className="w-full px-3 py-2 border rounded-md" />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Password</label>
              <input type="password" {...register('password', { required: 'Password is required' })} className="w-full px-3 py-2 border rounded-md" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            {serverError && <p className="text-red-500 text-sm text-center">{serverError}</p>}
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p className="text-center mt-4 text-sm text-gray-600">
            Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login here</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}