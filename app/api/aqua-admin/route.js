import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAllAquaItems, addAquaItem } from '../../../lib/aqua';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/aqua');

export const GET = async (req) => {
  try {
    const items = await getAllAquaItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch aqua items' }, { status: 500 });
  }
};

export const POST = async (req) => {
  const formData = await req.formData();

  const title = formData.get('title');
  const description = formData.get('description');
  const plantImage = formData.get('plantImage');
  const plantSmallImage = formData.get('plantSmallImage');
  const section = formData.get('section');

  // Validate inputs
  if (!title || !description || !plantImage || !plantSmallImage || !section) {
    return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
  }

  // Ensure upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Generate timestamp to append to filenames
  const timestamp = Date.now();

  // Save the plant image file with timestamp
  const plantImageExtension = path.extname(plantImage.name);
  const plantImageName = `${path.basename(plantImage.name, plantImageExtension)}_${timestamp}${plantImageExtension}`;
  const plantImagePath = path.join(UPLOAD_DIR, plantImageName);
  const plantImageBuffer = Buffer.from(await plantImage.arrayBuffer());

  // Save the small image file with timestamp
  const plantSmallImageExtension = path.extname(plantSmallImage.name);
  const plantSmallImageName = `${path.basename(plantSmallImage.name, plantSmallImageExtension)}_${timestamp}${plantSmallImageExtension}`;
  const plantSmallImagePath = path.join(UPLOAD_DIR, plantSmallImageName);
  const plantSmallImageBuffer = Buffer.from(await plantSmallImage.arrayBuffer());

  try {
    fs.writeFileSync(plantImagePath, plantImageBuffer);
    fs.writeFileSync(plantSmallImagePath, plantSmallImageBuffer);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save the images' }, { status: 500 });
  }

  // Prepare the item to save in the database
  const aquaItem = {
    title,
    description,
    plantImage: `/uploads/aqua/${plantImageName}`, // Save the relative path for the plant image
    plantSmallImage: `/uploads/aqua/${plantSmallImageName}`, // Save the relative path for the small image
    section,
  };

  // Save aqua item details using addAquaItem
  try {
    await addAquaItem(aquaItem);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Aqua item added successfully!',
    data: aquaItem,
  });
};
