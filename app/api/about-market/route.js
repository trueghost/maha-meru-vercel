import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAllAboutMarketItems, addAboutMarketItem } from '../../../lib/aboutMarket';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/about-market');

export const GET = async (req) => {
  try {
    const items = await getAllAboutMarketItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch about market items' }, { status: 500 });
  }
};

export const POST = async (req) => {
  const formData = await req.formData();

  const title = formData.get('title');
  const image = formData.get('image');
  const hoverImage = formData.get('hoverImage');

  // Validate inputs
  if (!title || !image || !hoverImage) {
    return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
  }

  // Ensure upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Generate a timestamp to make filenames unique
  const timestamp = Date.now();

  // Save the main image file with a timestamp in the name
  const imageExtension = path.extname(image.name);
  const imageName = `${path.basename(image.name, imageExtension)}_${timestamp}${imageExtension}`;
  const imagePath = path.join(UPLOAD_DIR, imageName);
  const buffer = Buffer.from(await image.arrayBuffer());

  try {
    fs.writeFileSync(imagePath, buffer);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save the image' }, { status: 500 });
  }

  // Save the hover image file with a timestamp in the name
  const hoverImageExtension = path.extname(hoverImage.name);
  const hoverImageName = `${path.basename(hoverImage.name, hoverImageExtension)}_${timestamp}${hoverImageExtension}`;
  const hoverImagePath = path.join(UPLOAD_DIR, hoverImageName);
  const hoverBuffer = Buffer.from(await hoverImage.arrayBuffer());

  try {
    fs.writeFileSync(hoverImagePath, hoverBuffer);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save the hover image' }, { status: 500 });
  }

  // Prepare the item to save in the database
  const aboutMarketItem = {
    title,
    image: `/uploads/about-market/${imageName}`, // Use the timestamped main image path
    hoverImage: `/uploads/about-market/${hoverImageName}`, // Use the timestamped hover image path
  };

  // Save the item details in the database
  try {
    await addAboutMarketItem(aboutMarketItem);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'About market item added successfully!',
    data: aboutMarketItem,
  });
};
