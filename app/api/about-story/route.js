import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAllAboutStoryItems, addAboutStoryItem } from '../../../lib/aboutStory';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/about-story');

export const GET = async (req) => {
  try {
    const items = await getAllAboutStoryItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch about story items' }, { status: 500 });
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

  // Generate a unique filename with the current timestamp
  const timestamp = Date.now();
  const extension = path.extname(image.name);
  const imageName = `${path.basename(image.name, extension)}_${timestamp}${extension}`;
  const imagePath = path.join(UPLOAD_DIR, imageName);
  const buffer = Buffer.from(await image.arrayBuffer());

  try {
    fs.writeFileSync(imagePath, buffer);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save the image' }, { status: 500 });
  }

  // Prepare the item to save in the database
  const aboutStoryItem = {
    description,
    image: `/uploads/about-story/${imageName}`, // Use the unique image name with timestamp
  };

  // Save about story item details using addAboutStoryItem
  try {
    await addAboutStoryItem(aboutStoryItem);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'About story item added successfully!',
    data: aboutStoryItem,
  });
};
