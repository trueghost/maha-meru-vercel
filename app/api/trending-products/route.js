import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAllTrendingProducts, addTrendingProduct } from '../../../lib/trendingProducts';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/trending-products');

export const GET = async (req) => {
  try {
    const items = await getAllTrendingProducts(); // Make sure the function is correct
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch trending products' }, { status: 500 });
  }
};

export const POST = async (req) => {
  const formData = await req.formData();
  
  const title = formData.get('title');
  const subtitle = formData.get('subtitle');
  const content = formData.get('content');
  const image = formData.get('image'); // Ensure this is correct
  const link = formData.get('link'); // New link field

  // Validate inputs
  if (!title || !subtitle || !content || !image || image instanceof File === false) {
    return NextResponse.json({ success: false, message: 'All fields are required, and image must be a file' }, { status: 400 });
  }

  // Ensure upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Generate a unique file name with the original image name and current timestamp
  const timestamp = Date.now(); // or new Date().toISOString()
  const extname = path.extname(image.name);
  const baseName = path.basename(image.name, extname);
  const uniqueImageName = `${baseName}-${timestamp}${extname}`;

  // Save the image file
  const imagePath = path.join(UPLOAD_DIR, uniqueImageName);
  const buffer = Buffer.from(await image.arrayBuffer());

  try {
    fs.writeFileSync(imagePath, buffer);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save the image' }, { status: 500 });
  }

  // Prepare the item to save in the database
  const trendingProduct = {
    title,
    subtitle,
    content,
    image: `/uploads/trending-products/${uniqueImageName}`, // Save the relative URL for the image
    link // Include the link
  };

  // Save trending product details using addTrendingProduct
  try {
    await addTrendingProduct(trendingProduct);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Trending product added successfully!',
    data: trendingProduct,
  });
};
