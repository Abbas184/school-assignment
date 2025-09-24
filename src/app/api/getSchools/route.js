import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import School from '@/models/School';

export async function GET(req) {
  try {
    await dbConnect();

    // Get the search query from the URL (e.g., /api/getSchools?search=central)
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('search');

    // Create a filter object. It's empty by default, meaning "find all".
    const filter = {};

    // If a search query exists, add a condition to the filter.
    if (query) {
      // This will find schools where the 'name' field contains the query text.
      // The '$options: "i"' makes the search case-insensitive.
      filter.name = { $regex: query, $options: "i" };
    }

    // Use the filter object in the find() method.
    const schools = await School.find(filter).sort({ _id: -1 });

    return NextResponse.json(schools);

  } catch (error) {
    console.error('!!! SERVER ERROR in /api/getSchools:', error);
    return NextResponse.json(
      { message: 'Failed to fetch schools due to a server error.', error: error.message },
      { status: 500 }
    );
  }
}