import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAllConnectSecondItems, addConnectSecondItem } from '../../../lib/connectSecond';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/connect-second'); // Updated directory name

export const GET = async (req) => {
  try {
    const items = await getAllConnectSecondItems(); // Updated function call
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch connect second items' }, { status: 500 });
  }
};

export const POST = async (req) => {
    const formData = await req.formData();
  
    const title = formData.get('title'); // New title field
    const description = formData.get('description');
    const image = formData.get('image');
  
    // Validate inputs
    if (!title || !description || !image) { // Updated validation
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }
  
    // Generate timestamp and create a unique image name
    const timestamp = Date.now(); // Get the current timestamp
    const ext = path.extname(image.name); // Get the file extension
    const baseName = path.basename(image.name, ext); // Get the base name of the file
    const timestampedName = `${baseName}_${timestamp}${ext}`; // Create a unique filename with timestamp
  
    // Ensure upload directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
  
    // Save the image file with the timestamped name
    const imagePath = path.join(UPLOAD_DIR, timestampedName);
    const buffer = Buffer.from(await image.arrayBuffer());
  
    try {
      fs.writeFileSync(imagePath, buffer);
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Failed to save the image' }, { status: 500 });
    }
  
    // Prepare the item to save in the database, storing both original and timestamped names
    const connectSecondItem = {
      title, // Added title to the item
      description,
      image: {
        original: image.name, // Store original image name
        timestamped: `/uploads/connect-second/${timestampedName}`, // Store the timestamped image path
      },
    };
  
    // Save connect second item details using addConnectSecondItem
    try {
      await addConnectSecondItem(connectSecondItem); // Updated function call
    } catch (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  
    return NextResponse.json({
      success: true,
      message: 'Connect second item added successfully!',
      data: connectSecondItem,
    });
};
