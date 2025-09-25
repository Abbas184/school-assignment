"use client";

import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const { register: registerDetails, handleSubmit: handleSubmitDetails, reset, formState: { errors: detailsErrors } } = useForm();
  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors }, watch, reset: resetPassword } = useForm();

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => {
          if (data) {
            reset({ name: data.name, email: data.email, mobile: data.mobile });
          }
        });
    }
  }, [status, reset]);

  const onUpdateDetails = async (data) => {
    const toastId = toast.loading('Updating profile...');
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, mobile: data.mobile }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success('Profile updated successfully!', { id: toastId });
        // --- THIS IS THE CRITICAL FIX ---
        // We now send a simple object with only the data that needs to
        // be updated in the session token.
        await update({ name: result.user.name });
        // --- END OF FIX ---
      } else {
        toast.error(result.message || 'Failed to update profile.', { id: toastId });
      }
    } catch (error) {
      toast.error('An unexpected error occurred.', { id: toastId });
    }
  };

  const onUpdatePassword = async (data) => {
    const toastId = toast.loading('Changing password...');
    try {
      const res = await fetch('/api/profile/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success('Password changed successfully!', { id: toastId });
        resetPassword();
      } else {
        toast.error(result.message || 'Failed to change password.', { id: toastId });
      }
    } catch (error) {
      toast.error('An unexpected error occurred.', { id: toastId });
    }
  };

  if (status === 'loading') return <p>Loading session...</p>;
  if (status === 'unauthenticated') return <p>Access Denied. Please log in.</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Update Your Details</h2>
            <form onSubmit={handleSubmitDetails(onUpdateDetails)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input {...registerDetails('name', { required: 'Name is required' })} className="w-full p-2 border rounded-md" />
                {detailsErrors.name && <p className="text-red-500 text-xs mt-1">{detailsErrors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input type="email" {...registerDetails('email')} disabled className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium">Mobile Number</label>
                <input type="tel" {...registerDetails('mobile', { required: 'Mobile number is required' })} className="w-full p-2 border rounded-md" />
                {detailsErrors.mobile && <p className="text-red-500 text-xs mt-1">{detailsErrors.mobile.message}</p>}
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Save Changes</button>
            </form>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={handleSubmitPassword(onUpdatePassword)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Current Password</label>
                <input type="password" {...registerPassword('currentPassword', { required: 'Current password is required' })} className="w-full p-2 border rounded-md" />
                {passwordErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">New Password</label>
                <input type="password" {...registerPassword('newPassword', { required: 'New password is required' })} className="w-full p-2 border rounded-md" />
                {passwordErrors.newPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Confirm New Password</label>
                <input type="password" {...registerPassword('confirmPassword', { validate: value => value === watch('newPassword') || 'Passwords do not match' })} className="w-full p-2 border rounded-md" />
                {passwordErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword.message}</p>}
              </div>
              <button type="submit" className="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-800">Change Password</button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}