import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import School from '@/models/School';

// GET a single school by ID (This function is already correct)
export async function GET(req, { params }) {
  await dbConnect();
  try {
    const school = await School.findById(params.id);
    if (!school) {
      return NextResponse.json({ message: "School not found." }, { status: 404 });
    }
    return NextResponse.json(school);
  } catch (error) {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

// PUT (update) a school by ID (THIS IS THE FIX)
export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }
  await dbConnect();
  try {
    const body = await req.json();
    
    // --- THIS IS THE CRITICAL FIX ---
    // We explicitly convert the rating from the form body to a Number
    // before sending it to the database for the update.
    const updateData = {
      ...body,
      rating: Number(body.rating) 
    };
    // --- END OF FIX ---

    const updatedSchool = await School.findByIdAndUpdate(params.id, updateData, { new: true });
    if (!updatedSchool) {
      return NextResponse.json({ message: "School not found." }, { status: 404 });
    }
    return NextResponse.json(updatedSchool);
  } catch (error) {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

// DELETE a school by ID (This function is already correct)
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }
  await dbConnect();
  try {
    const deletedSchool = await School.findByIdAndDelete(params.id);
    if (!deletedSchool) {
      return NextResponse.json({ message: "School not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "School deleted successfully." });
  } catch (error) {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}