import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import School from '@/models/School';
import cloudinary from 'cloudinary';

// Configure Cloudinary with your environment variables from Vercel
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// This helper function takes the image buffer and uploads it to Cloudinary
async function uploadToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
}

export async function POST(req) {
  await dbConnect();

  try {
    const formData = await req.formData();
    const imageFile = formData.get('image');

    if (!imageFile) {
      return NextResponse.json({ message: 'Image file is required.' }, { status: 400 });
    }

    // Convert the image file to a buffer that can be uploaded
    const fileBuffer = Buffer.from(await imageFile.arrayBuffer());

    // Call our helper function to upload the buffer to Cloudinary
    const uploadResult = await uploadToCloudinary(fileBuffer);

    // The secure URL from Cloudinary is what we will save to our database
    const imageUrl = uploadResult.secure_url;
    
    const newSchool = new School({
      name: formData.get('name'),
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      contact: formData.get('contact'),
      email_id: formData.get('email_id'),
      image: imageUrl, // <-- We save the Cloudinary URL
    });
    
    await newSchool.save();

    return NextResponse.json({ message: 'School added successfully!' }, { status: 201 });

  } catch (error) {
    console.error('!!! SERVER ERROR in /api/addSchool:', error);
    return NextResponse.json(
      { message: 'Failed to add school due to a server error.', error: error.message },
      { status: 500 }
    );
  }
}