import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import School from '@/models/School';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req) {
  await dbConnect();
  console.log('Database connection successful.');

  try {
    const formData = await req.formData();
    const imageFile = formData.get('image');

    if (!imageFile) {
      return NextResponse.json({ message: 'Image file is required.' }, { status: 400 });
    }

    // Convert the image file to a buffer
    const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
    
    // Define the directory and create it if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'schoolImages');
    await fs.mkdir(uploadDir, { recursive: true });

    // Create a unique filename
    const fileName = `${Date.now()}_${imageFile.name.replace(/\s/g, '_')}`;
    const newPath = path.join(uploadDir, fileName);

    // Write the file to the filesystem
    await fs.writeFile(newPath, fileBuffer);
    console.log('Image file saved to:', newPath);

    const imageUrl = `/schoolImages/${fileName}`;

    const newSchool = new School({
      name: formData.get('name'),
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      contact: formData.get('contact'),
      email_id: formData.get('email_id'),
      image: imageUrl,
    });
    
    await newSchool.save();
    console.log('School data saved to database successfully.');

    return NextResponse.json({ message: 'School added successfully!' }, { status: 201 });

  } catch (error) {
    console.error('!!! SERVER ERROR in /api/addSchool:', error);
    return NextResponse.json(
      { message: 'Failed to add school due to a server error.', error: error.message },
      { status: 500 }
    );
  }
}