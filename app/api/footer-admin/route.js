import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAllFooterItems, addFooterItem } from '../../../lib/footer';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/footer');

export const GET = async (req) => {
  try {
    const items = await getAllFooterItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch footer items' }, { status: 500 });
  }
};

export const POST = async (req) => {
  const formData = await req.formData();

  const image = formData.get('image');
  const imageTitle = formData.get('imageTitle');
  const exploreTitle = formData.get('exploreTitle');
  const contactTitle = formData.get('contactTitle');
  const location = formData.get('location');
  const number = formData.get('number');
  const mail = formData.get('mail');
  const facebookLink = formData.get('facebookLink');
  const whatsappLink = formData.get('whatsappLink');
  const twitterLink = formData.get('twitterLink');
  const instaLink = formData.get('instaLink');

  // Validate inputs
  if (!image || !imageTitle || !exploreTitle || !contactTitle || !location || !number || !mail || !facebookLink || !whatsappLink || !twitterLink || !instaLink) {
    return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
  }

  // Ensure upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Generate a timestamped filename
  const timestamp = Date.now();
  const ext = path.extname(image.name); // Extract the original file extension
  const baseName = path.basename(image.name, ext); // Extract the filename without the extension
  const timestampedName = `${baseName}_${timestamp}${ext}`; // Create the new filename
  const imagePath = path.join(UPLOAD_DIR, timestampedName);

  // Save the image file
  const buffer = Buffer.from(await image.arrayBuffer());
  try {
    fs.writeFileSync(imagePath, buffer);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save the image' }, { status: 500 });
  }

 // Prepare the footer item to save in the database, matching the names in addFooterItem
 const footerItem = {
    image: `/uploads/footer/${timestampedName}`, // Save the relative path with the timestamped filename
    image_title: imageTitle, // Updated name
    explore_title: exploreTitle, // Updated name
    contact_title: contactTitle, // Updated name
    location, // Same name
    number, // Same name
    mail, // Same name
    facebook_link: facebookLink, // Updated name
    whatsapp_link: whatsappLink, // Updated name
    twitter_link: twitterLink, // Updated name
    insta_link: instaLink, // Updated name
  };

  // Save footer item details using addFooterItem
  try {
    await addFooterItem(footerItem);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Footer item added successfully!',
    data: footerItem,
  });
};
