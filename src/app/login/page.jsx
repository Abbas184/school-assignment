"use client";
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        setServerError(result.error); // This will display "Incorrect password." etc.
      } else {
        router.push('/showSchools'); // Or router.refresh() if you want to stay
      }
    } catch (error) {
      setServerError("An unexpected error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })} className="w-full px-3 py-2 border rounded-md" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" {...register('password', { required: 'Password is required' })} className="w-full px-3 py-2 border rounded-md" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Login</button>
        </form>
        <p className="text-center mt-4 text-sm">
          Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}