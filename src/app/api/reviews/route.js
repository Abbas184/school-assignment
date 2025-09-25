import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';
import School from '@/models/School';

// GET reviews for a specific school
export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get('schoolId');
    if (!schoolId) {
      return NextResponse.json({ message: "School ID is required." }, { status: 400 });
    }
    const reviews = await Review.find({ school: schoolId }).sort({ createdAt: -1 }).populate('user', 'name');
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ message: "Server error fetching reviews." }, { status: 500 });
  }
}

// POST a new review
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized: You must be logged in to post a review." }, { status: 401 });
  }

  await dbConnect();
  try {
    const { comment, rating, schoolId } = await req.json();
    const newReview = new Review({
      comment,
      rating: Number(rating),
      school: schoolId,
      user: session.user.id,
    });
    await newReview.save();

    // After saving, recalculate the school's average rating
    const reviews = await Review.find({ school: schoolId });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    await School.findByIdAndUpdate(schoolId, { rating: avgRating });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Server error creating review.", error: error.message }, { status: 500 });
  }
}