import { NextResponse } from 'next/server';
import { getSchools } from '@/lib/data';

export async function GET() {
  try {
    const schools = await getSchools();
    return NextResponse.json(schools);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch schools due to a server error.', error: error.message },
      { status: 500 }
    );
  }
}