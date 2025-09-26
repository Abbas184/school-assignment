import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import School from '@/models/School';

const SCHOOLS_PER_PAGE = 8;

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const skip = (page - 1) * SCHOOLS_PER_PAGE;
  
  const filter = {};
  if (searchParams.get('search')) filter.name = { $regex: searchParams.get('search'), $options: "i" };
  if (searchParams.get('city')) filter.city = searchParams.get('city');
  if (searchParams.get('state')) filter.state = searchParams.get('state');

  let sortOptions = { _id: -1 };
  if (searchParams.get('sortBy') === 'a_z') sortOptions = { name: 1 };
  if (searchParams.get('sortBy') === 'rating_desc') sortOptions = { rating: -1 };

  const [schools, totalSchools] = await Promise.all([
    School.find(filter).sort(sortOptions).skip(skip).limit(SCHOOLS_PER_PAGE).lean(),
    School.countDocuments(filter)
  ]);
  const totalPages = Math.ceil(totalSchools / SCHOOLS_PER_PAGE);

  return NextResponse.json({ schools, currentPage: page, totalPages });
}