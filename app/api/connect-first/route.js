import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAllConnectFirstItems, addConnectFirstItem } from '../../../lib/connectFirst';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/connect-first');

export const GET = async (req) => {
  try {
    const items = await getAllConnectFirstItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch connect first items' }, { status: 500 });
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
    const ext = path.extname(image.name);
    const baseName = path.basename(image.name, ext);
    const timestampedName = `${baseName}_${timestamp}${ext}`;
    const imagePath = path.join(UPLOAD_DIR, timestampedName);
    const buffer = Buffer.from(await image.arrayBuffer());
  
    try {
      fs.writeFileSync(imagePath, buffer);
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Failed to save the image' }, { status: 500 });
    }
  
    // Prepare the item to save in the database with the updated image path
    const connectFirstItem = {
      description,
      image: `/uploads/connect-first/${timestampedName}`, // Save the relative path for the image with timestamp
    };
  
    // Save connect first item details using addConnectFirstItem
    try {
      await addConnectFirstItem(connectFirstItem);
    } catch (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  
    return NextResponse.json({
      success: true,
      message: 'Connect first item added successfully!',
      data: connectFirstItem,
    });
};
