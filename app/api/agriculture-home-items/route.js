import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAllAgricultureItems, addAgricultureItem } from '../../../lib/agricultureHome';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/agriculture-items');

export const GET = async (req) => {
  try {
    const items = await getAllAgricultureItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch agriculture items' }, { status: 500 });
  }
};

export const POST = async (req) => {
  const formData = await req.formData();

  const title = formData.get('title');
  const category = formData.get('category');
  const description = formData.get('description');
  const image = formData.get('image');
  const link = formData.get('link');
  const isMobileImage = formData.has('isMobileImage');

  // Validate inputs
  if (!title || !category || !description || !image) {
    return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
  }

  // Ensure upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Generate a unique filename with a timestamp
  const timestamp = Date.now();
  const imageExtension = path.extname(image.name);
  const imageName = `${path.basename(image.name, imageExtension)}_${timestamp}${imageExtension}`;
  const imagePath = path.join(UPLOAD_DIR, imageName);
  const buffer = Buffer.from(await image.arrayBuffer());

  try {
    fs.writeFileSync(imagePath, buffer);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save the image' }, { status: 500 });
  }

  // Prepare the item to save in the database
  const agricultureItem = {
    category,
    title,
    description,
    image_url: `/uploads/agriculture-items/${imageName}`, // Save the relative URL for the image with timestamp
    link,
    is_mobile_image: isMobileImage,
  };

  // Save agriculture item details using addAgricultureItem
  try {
    await addAgricultureItem(agricultureItem);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Agriculture item added successfully!',
    data: agricultureItem,
  });
};
