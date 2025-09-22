import dbConnect from '@/lib/db';
import School from '@/models/School';

// This is the single source of truth for getting schools from the DB.
export const getSchools = async () => {
  try {
    await dbConnect();
    const schools = await School.find({}).sort({ _id: -1 });
    // This line is crucial to prevent Next.js errors with database objects.
    return JSON.parse(JSON.stringify(schools));
  } catch (error) {
    console.error("Database Error fetching schools:", error);
    throw new Error("Failed to fetch schools.");
  }
};