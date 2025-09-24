import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password, mobile } = await req.json();

    // --- SERVER-SIDE VALIDATION ---
    if (!name || !email || !password || !mobile) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists." }, { status: 400 });
    }
    // --- END OF VALIDATION ---

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobile, // <-- Add the mobile number here
    });

    // Make the very first registered user an admin
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      newUser.role = 'admin';
      console.log('First user created as admin.');
    }

    await newUser.save();
    return NextResponse.json({ message: "User registered successfully." }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ message: "An error occurred during registration.", error: error.message }, { status: 500 });
  }
}