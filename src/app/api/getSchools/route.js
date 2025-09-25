import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import School from '@/models/School';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('search');
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const sortBy = searchParams.get('sortBy');

    // --- THIS IS THE FIX: Build the complete filter object ---
    const filter = {};
    if (query) {
      // Case-insensitive search on the 'name' field
      filter.name = { $regex: query, $options: "i" };
    }
    if (city) {
      filter.city = city;
    }
    if (state) {
      filter.state = state;
    }
    // --- END OF FIX ---

    // This is the correct, complete sorting logic
    let sortOptions = {}; 
    switch(sortBy) {
      case 'a_z':
        sortOptions = { name: 1 };
        break;
      case 'rating_desc':
        sortOptions = { rating: -1 };
        break;
      default:
        sortOptions = { _id: -1 };
        break;
    }
    
    const schools = await School.find(filter).sort(sortOptions);

    return NextResponse.json(schools);

  } catch (error) {
    console.error('!!! SERVER ERROR in /api/getSchools:', error);
    return NextResponse.json(
      { message: 'Failed to fetch schools.', error: error.message },
      { status: 500 }
    );
  }
}