import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import School from '@/models/School';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: "Unauthorized: Access is restricted to admins." }, { status: 403 });
  }

  await dbConnect();

  try {
    const formData = await req.formData();
    const imageFile = formData.get('image');

    if (!imageFile) {
      return NextResponse.json({ message: 'Image file is required.' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
    const uploadResult = await uploadToCloudinary(fileBuffer);
    const imageUrl = uploadResult.secure_url;

    const newSchool = new School({
      name: formData.get('name'),
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      contact: formData.get('contact'),
      email_id: formData.get('email_id'),
      image: imageUrl,
      // The rating is now explicitly converted to a Number before saving.
      rating: Number(formData.get('rating')),
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