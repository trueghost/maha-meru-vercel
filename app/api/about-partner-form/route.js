import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAllAboutPartnerFormItems, addAboutPartnerFormItem } from '../../../lib/aboutPartnerForm';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/about-partner-form');

export const GET = async (req) => {
  try {
    const items = await getAllAboutPartnerFormItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch about partner form items' }, { status: 500 });
  }
};

export const POST = async (req) => {
  const formData = await req.formData();

  // Get the file from the form data
  const file = formData.get('file');

  // Validate the file input
  if (!file) {
    return NextResponse.json({ success: false, message: 'File is required' }, { status: 400 });
  }

  // Ensure upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Generate a unique filename with a timestamp
  const timestamp = Date.now();
  const extension = path.extname(file.name);
  const uniqueFileName = `${path.basename(file.name, extension)}_${timestamp}${extension}`;
  const filePath = path.join(UPLOAD_DIR, uniqueFileName);

  const buffer = Buffer.from(await file.arrayBuffer());

  // Save the file
  try {
    fs.writeFileSync(filePath, buffer);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save the file' }, { status: 500 });
  }

  // Prepare the item to save in the database
  const aboutPartnerFormItem = {
    file: `/uploads/about-partner-form/${uniqueFileName}`, // Save the relative path for the file with the unique name
  };

  // Save about partner form item details using addAboutPartnerFormItem
  try {
    await addAboutPartnerFormItem(aboutPartnerFormItem);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'About Partner Form item added successfully!',
    data: aboutPartnerFormItem,
  });
};
