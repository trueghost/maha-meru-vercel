import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAllBannerItems, addBannerItem } from '../../../lib/banner';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/banner');

export const GET = async (req) => {
  try {
    const items = await getAllBannerItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch banner items' }, { status: 500 });
  }
};

export const POST = async (req) => {
  const formData = await req.formData();

  const title = formData.get('title');
  const description = formData.get('description');
  const image = formData.get('image');

  // Validate inputs
  if (!title || !description || !image) {
    return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
  }

  // Ensure upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Generate a timestamped filename
  const timestamp = Date.now();
  const ext = path.extname(image.name); // Extract the original file extension
  const baseName = path.basename(image.name, ext); // Extract the filename without the extension
  const timestampedName = `${baseName}_${timestamp}${ext}`; // Create the new filename
  const imagePath = path.join(UPLOAD_DIR, timestampedName);

  // Save the image file
  const buffer = Buffer.from(await image.arrayBuffer());
  try {
    fs.writeFileSync(imagePath, buffer);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save the image' }, { status: 500 });
  }

  // Prepare the item to save in the database
  const bannerItem = {
    title,
    description,
    image: `/uploads/banner/${timestampedName}`, // Save the relative path with the timestamped filename
  };

  // Save banner item details using addBannerItem
  try {
    await addBannerItem(bannerItem);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Banner item added successfully!',
    data: bannerItem,
  });
};
