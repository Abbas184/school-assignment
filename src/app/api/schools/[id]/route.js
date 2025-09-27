import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import School from '@/models/School';
import Review from '@/models/Review'; // <-- Import Review model for cascading delete

// GET a single school by ID (This function is already correct)
export async function GET(req, { params }) {
  await dbConnect();
  try {
    const school = await School.findById(params.id).lean();
    if (!school) {
      return NextResponse.json({ message: "School not found." }, { status: 404 });
    }
    return NextResponse.json(JSON.parse(JSON.stringify(school)));
  } catch (error) {
    console.error("API GET /api/schools/[id] Error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

// PUT (update) a school by ID (Corrected and Robust)
export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }
  await dbConnect();
  try {
    const body = await req.json();
    const updateData = { ...body, rating: Number(body.rating) };

    const updatedSchool = await School.findByIdAndUpdate(params.id, updateData, { new: true });
    
    if (!updatedSchool) {
      return NextResponse.json({ message: "School not found." }, { status: 404 });
    }
    return NextResponse.json(updatedSchool);
  } catch (error) {
    console.error("API PUT /api/schools/[id] Error:", error);
    return NextResponse.json({ message: "Server error while updating school." }, { status: 500 });
  }
}

// DELETE a school by ID (Corrected and Robust)
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }
  await dbConnect();
  try {
    const schoolId = params.id;
    
    // --- THIS IS THE FIX ---
    // We find the school first to ensure it exists.
    const schoolToDelete = await School.findById(schoolId);
    if (!schoolToDelete) {
      return NextResponse.json({ message: "School not found." }, { status: 404 });
    }

    // Professional Step: Also delete all reviews associated with this school
    await Review.deleteMany({ school: schoolId });

    // Now, delete the school itself
    await School.findByIdAndDelete(schoolId);

    // ALWAYS return a response on success
    return NextResponse.json({ message: "School and associated reviews deleted successfully." });
    // --- END OF FIX ---

  } catch (error) {
    console.error("API DELETE /api/schools/[id] Error:", error);
    // ALWAYS return a response on error
    return NextResponse.json({ message: "Server error while deleting school." }, { status: 500 });
  }
}