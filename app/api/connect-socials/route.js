import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAllConnectSocialItems, addConnectSocialItem } from '../../../lib/socials';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/socials');

export const GET = async (req) => {
  try {
    const items = await getAllConnectSocialItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch connect socials items' }, { status: 500 });
  }
};

export const POST = async (req) => {
  const formData = await req.formData();

  const title = formData.get('title');
  const category = formData.get('category');
  const description = formData.get('description');
  const image = formData.get('image');
  const date = formData.get('date'); // Extract the date from formData
  const link = formData.get('link'); // Extract the link from formData

  // Validate inputs
  if (!title || !category || !description || !image || !date || !link) {
    return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
  }

  // Ensure upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Generate timestamp to make the image filename unique
  const timestamp = Date.now();
  const ext = path.extname(image.name); // Get the file extension
  const baseName = path.basename(image.name, ext); // Get the base name of the file
  const timestampedName = `${baseName}_${timestamp}${ext}`; // Append timestamp to the filename

  // Save the image file with the timestamped name
  const imagePath = path.join(UPLOAD_DIR, timestampedName);
  const buffer = Buffer.from(await image.arrayBuffer());

  try {
    fs.writeFileSync(imagePath, buffer);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save the image' }, { status: 500 });
  }

  // Prepare the item to save in the database
  const connectSocialItem = {
    category,
    title,
    description,
    link, // Include the link in the saved connect social item
    image_url: `/uploads/socials/${timestampedName}`, // Store the URL with the timestamped filename
    original_image_name: image.name, // Store the original image name
    date, // Add the date received from the front end
  };

  // Save connect social item details using addConnectSocialItem
  try {
    await addConnectSocialItem(connectSocialItem);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Connect social item added successfully!',
    data: connectSocialItem,
  });
};
