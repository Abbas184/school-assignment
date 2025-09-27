"use client";
import { useForm } from 'react-hook-form'; // <-- This was the missing part
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError('');
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (result.error) {
        setServerError(result.error);
      } else {
        router.push('/showSchools');
        router.refresh();
      }
    } catch (error) {
      setServerError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-800">Email</label>
              <input type="email" {...register('email', { required: 'Email is required' })} className="w-full px-3 py-2 border rounded-md" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Password</label>
              <input type="password" {...register('password', { required: 'Password is required' })} className="w-full px-3 py-2 border rounded-md" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            {serverError && <p className="text-red-500 text-sm text-center">{serverError}</p>}
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-center mt-4 text-sm text-gray-600">
            Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Register here</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}