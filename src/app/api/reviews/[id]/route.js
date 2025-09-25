import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';

// PUT (update) a specific review
export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  try {
    const review = await Review.findById(params.id);
    if (!review) {
      return NextResponse.json({ message: "Review not found." }, { status: 404 });
    }

    // --- SECURITY CHECK ---
    // Only the user who wrote the review can edit it. Admins cannot edit reviews.
    if (review.user.toString() !== session.user.id) {
      return NextResponse.json({ message: "Forbidden: You can only edit your own reviews." }, { status: 403 });
    }

    const { comment, rating } = await req.json();
    review.comment = comment;
    review.rating = Number(rating);
    await review.save();
    
    // Note: We should also recalculate the school's average rating here.
    // This is left as a potential improvement to avoid making this file too complex.

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json({ message: "Server error updating review." }, { status: 500 });
  }
}

// DELETE a specific review
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  try {
    const review = await Review.findById(params.id);
    if (!review) {
      return NextResponse.json({ message: "Review not found." }, { status: 404 });
    }

    // --- SECURITY CHECK ---
    // The user who wrote the review OR an admin can delete it.
    const isOwner = review.user.toString() === session.user.id;
    const isAdmin = session.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden: You do not have permission to delete this review." }, { status: 403 });
    }

    await Review.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Review deleted successfully." });
  } catch (error) {
    return NextResponse.json({ message: "Server error deleting review." }, { status: 500 });
  }
}