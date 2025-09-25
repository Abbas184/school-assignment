import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// GET the current logged-in user's profile
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  try {
    const user = await User.findById(session.user.id).select('-password'); // Exclude password
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

// PUT (update) the current logged-in user's profile
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  try {
    const { name, mobile } = await req.json();

    if (!name || !mobile) {
        return NextResponse.json({ message: "Name and mobile are required." }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { name, mobile },
      { new: true }
    ).select('-password');

    return NextResponse.json({ message: "Profile updated successfully.", user: updatedUser });
  } catch (error) {
    return NextResponse.json({ message: "Server error updating profile." }, { status: 500 });
  }
}