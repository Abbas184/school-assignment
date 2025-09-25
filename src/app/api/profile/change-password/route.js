import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
// --- THIS IS THE FIX: Corrected import path ---
import { authOptions } from '../../../api/auth/[...nextauth]/route'; 
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ message: "Invalid input. New password must be at least 6 characters." }, { status: 400 });
    }

    const user = await User.findById(session.user.id);
    
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );
    
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Incorrect current password." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: "Password changed successfully." });
  } catch (error) {
    return NextResponse.json({ message: "Server error changing password." }, { status: 500 });
  }
}