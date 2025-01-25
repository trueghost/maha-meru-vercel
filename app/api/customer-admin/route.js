import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAllCustomerStories, addCustomerStory } from '../../../lib/customerHome';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/customerStories');

export const GET = async (req) => {
  try {
    const items = await getAllCustomerStories(); // Fetch customer stories
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch customer stories' }, { status: 500 });
  }
};

export const POST = async (req) => {
  const formData = await req.formData();
  
  const name = formData.get('name');
  const role = formData.get('role');
  const review = formData.get('review');
  const image = formData.get('image'); // Ensure this is correct

  // Validate inputs
  if (!name || !role || !review || !image || image instanceof File === false) {
    return NextResponse.json({ success: false, message: 'All fields are required, and image must be a file' }, { status: 400 });
  }

  // Ensure upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Generate timestamp to ensure the filename is unique
  const timestamp = Date.now();
  const ext = path.extname(image.name); // Get file extension
  const baseName = path.basename(image.name, ext); // Get base name of the file
  const timestampedName = `${baseName}_${timestamp}${ext}`; // Append timestamp to the filename

  const imagePath = path.join(UPLOAD_DIR, timestampedName); // Path for the new image file
  const buffer = Buffer.from(await image.arrayBuffer());

  try {
    fs.writeFileSync(imagePath, buffer); // Save the new image with timestamped filename
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save the image' }, { status: 500 });
  }

  // Prepare the item to save in the database
  const customerStory = {
    name,
    role,
    review,
    image: `/uploads/customerStories/${timestampedName}`, // Save the relative URL for the image
    original_image_name: image.name, // Store the original image name as well
  };

  // Save customer story details using addCustomerStory
  try {
    await addCustomerStory(customerStory); // Save the customer story
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Customer story added successfully!',
    data: customerStory,
  });
};
