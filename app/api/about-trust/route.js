import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAllAboutTrustItems, addAboutTrustItem } from '../../../lib/aboutTrust';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/about-trust');

export const GET = async (req) => {
  try {
    const items = await getAllAboutTrustItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch about trust items' }, { status: 500 });
  }
};

export const POST = async (req) => {
    const formData = await req.formData();
  
    const description = formData.get('description');
    const image = formData.get('image');
  
    // Validate inputs
    if (!description || !image) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }
  
    // Ensure upload directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // Generate a unique filename with a timestamp
    const timestamp = Date.now();
    const extension = path.extname(image.name);
    const uniqueImageName = `${path.basename(image.name, extension)}_${timestamp}${extension}`;
    const imagePath = path.join(UPLOAD_DIR, uniqueImageName);

    const buffer = Buffer.from(await image.arrayBuffer());
  
    // Save the image file
    try {
      fs.writeFileSync(imagePath, buffer);
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Failed to save the image' }, { status: 500 });
    }
  
    // Prepare the item to save in the database
    const aboutTrustItem = {
      description,
      image: `/uploads/about-trust/${uniqueImageName}`, // Save the relative path for the image with the unique name
    };
  
    // Save about trust item details using addAboutTrustItem
    try {
      await addAboutTrustItem(aboutTrustItem);
    } catch (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  
    return NextResponse.json({
      success: true,
      message: 'About trust item added successfully!',
      data: aboutTrustItem,
    });
};
