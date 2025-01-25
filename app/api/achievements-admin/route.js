import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAllAchievements, addAchievement } from '../../../lib/achievementsHome';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/achievements');

export const GET = async (req) => {
  try {
    const items = await getAllAchievements(); // Corrected function name to get achievements
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch achievements' }, { status: 500 });
  }
};

export const POST = async (req) => {
  const formData = await req.formData();

  const image = formData.get('image');

  // Validate inputs
  if (!image) {
    return NextResponse.json({ success: false, message: 'Image is required' }, { status: 400 });
  }

  // Ensure upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Generate a unique image filename using the current timestamp
  const timestamp = Date.now();
  const extension = path.extname(image.name);
  const uniqueImageName = `${path.basename(image.name, extension)}_${timestamp}${extension}`;
  const imagePath = path.join(UPLOAD_DIR, uniqueImageName);
  const buffer = Buffer.from(await image.arrayBuffer());

  try {
    // Save the image with the unique filename
    fs.writeFileSync(imagePath, buffer);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save the image' }, { status: 500 });
  }

  // Prepare the achievement item to save in the database
  const achievementItem = {
    image: `/uploads/achievements/${uniqueImageName}`, // Save the relative URL for the image
  };

  // Save achievement item details using addAchievement
  try {
    await addAchievement(achievementItem);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Achievement added successfully!',
    data: achievementItem,
  });
};
