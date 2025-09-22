import dbConnect from '@/lib/db';
import School from '@/models/School';

// This function can be used by any server-side component or API route.
export const getSchools = async () => {
  try {
    await dbConnect();
    const schools = await School.find({}).sort({ _id: -1 });
    // We need to convert the Mongoose documents to plain objects.
    return JSON.parse(JSON.stringify(schools));
  } catch (error) {
    console.error("Database Error:", error);
    // In case of an error, we return an empty array to prevent crashing.
    return [];
  }
};