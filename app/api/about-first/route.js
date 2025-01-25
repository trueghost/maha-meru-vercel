import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAllAboutFirstItems, addAboutFirstItem } from '../../../lib/aboutFirst';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/about-first');

export const GET = async (req) => {
  try {
    const items = await getAllAboutFirstItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch about first items' }, { status: 500 });
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

  // Generate a unique name for the image with a timestamp
  const timestamp = Date.now(); // or you can use `new Date().toISOString()` for more readability
  const extension = path.extname(image.name); // Get file extension
  const imageName = `${path.basename(image.name, extension)}_${timestamp}${extension}`;
  const imagePath = path.join(UPLOAD_DIR, imageName);
  const buffer = Buffer.from(await image.arrayBuffer());

  try {
    fs.writeFileSync(imagePath, buffer);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save the image' }, { status: 500 });
  }

  // Prepare the item to save in the database
  const aboutFirstItem = {
    description,
    image: `/uploads/about-first/${imageName}`, // Save the relative path for the image
  };

  // Save about first item details using addAboutFirstItem
  try {
    await addAboutFirstItem(aboutFirstItem);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'About first item added successfully!',
    data: aboutFirstItem,
  });
};
