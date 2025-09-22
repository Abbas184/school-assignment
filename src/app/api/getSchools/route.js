import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import School from '@/models/School';

export async function GET() {
  try {
    await dbConnect();

    // Find all schools and sort them by newest first
    const schools = await School.find({}).sort({ _id: -1 });

    return NextResponse.json(schools);

  } catch (error) {
    console.error('!!! SERVER ERROR in /api/getSchools:', error);
    return NextResponse.json(
      { message: 'Failed to fetch schools due to a server error.', error: error.message },
      { status: 500 }
    );
  }
}