"use client";
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  const onSubmit = async (data) => {
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input {...register('name', { required: 'Name is required' })} className="w-full px-3 py-2 border rounded-md" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })} className="w-full px-3 py-2 border rounded-md" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Mobile Number</label>
            <input type="tel" {...register('mobile', { required: 'Mobile number is required', pattern: { value: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number' } })} className="w-full px-3 py-2 border rounded-md" />
            {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} className="w-full px-3 py-2 border rounded-md" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Register</button>
        </form>
        <p className="text-center mt-4 text-sm">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}