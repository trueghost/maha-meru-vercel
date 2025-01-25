import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAllBlogItems, addBlogItem } from '../../../lib/blogs';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/blogs');

export const GET = async (req) => {
  try {
    const items = await getAllBlogItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch blog items' }, { status: 500 });
  }
};

export const POST = async (req) => {
  const formData = await req.formData();

  const title = formData.get('title');
  const category = formData.get('category');
  const description = formData.get('description');
  const image = formData.get('image');
  const date = formData.get('date');
  const link = formData.get('link');

  // Validate inputs
  if (!title || !category || !description || !image || !date || !link) {
    return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
  }

  // Ensure upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Generate a unique filename with a timestamp
  const timestamp = Date.now();
  const ext = path.extname(image.name); // Extract the file extension
  const baseName = path.basename(image.name, ext); // Get the filename without extension
  const timestampedName = `${baseName}_${timestamp}${ext}`; // Create the new filename
  const imagePath = path.join(UPLOAD_DIR, timestampedName);
  const buffer = Buffer.from(await image.arrayBuffer());

  // Save the image file
  try {
    fs.writeFileSync(imagePath, buffer);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save the image' }, { status: 500 });
  }

  // Prepare the item to save in the database
  const blogItem = {
    category,
    title,
    description,
    link,
    image_url: `/uploads/blogs/${timestampedName}`, // Use the timestamped image URL
    date,
  };

  // Save blog item details using addBlogItem
  try {
    await addBlogItem(blogItem);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Blog item added successfully!',
    data: blogItem,
  });
};
