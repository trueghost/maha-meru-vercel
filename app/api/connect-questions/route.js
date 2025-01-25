import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAllConnectQuestionsItems, addConnectQuestionsItem } from '../../../lib/connectQuestions';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/connect-questions');

export const GET = async (req) => {
  try {
    const items = await getAllConnectQuestionsItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch connect questions items' }, { status: 500 });
  }
};

export const POST = async (req) => {
    const formData = await req.formData();

    const title = formData.get('title'); // New title field
    const description = formData.get('description');
    const image = formData.get('image'); // Image file field

    // Validate inputs
    if (!title || !description) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }

    // Ensure upload directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    let imagePath = null;
    
    // Handle image file upload
    if (image && image instanceof File) {
      const timestamp = Date.now(); // Get the current timestamp
      const ext = path.extname(image.name); // Get the file extension
      const baseName = path.basename(image.name, ext); // Get the base name of the file
      const timestampedName = `${baseName}_${timestamp}${ext}`; // Create a unique filename

      // Save the image to the upload directory
      const imageFilePath = path.join(UPLOAD_DIR, timestampedName);
      const buffer = Buffer.from(await image.arrayBuffer());
      
      try {
        fs.writeFileSync(imageFilePath, buffer);
        imagePath = `/uploads/connect-questions/${timestampedName}`; // Store relative path
      } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to save the image' }, { status: 500 });
      }
    }

    // Prepare the item to save in the database, including the image if available
    const connectQuestionsItem = {
      title,
      description,
      image: imagePath, // Save the relative path for the image, or null if no image
    };

    // Save connect questions item details using addConnectQuestionsItem
    try {
      await addConnectQuestionsItem(connectQuestionsItem);
    } catch (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Connect questions item added successfully!',
      data: connectQuestionsItem,
    });
};
