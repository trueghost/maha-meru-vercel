import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAllAnimalItems, addAnimalItem } from '../../../lib/animal';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/animal');

export const GET = async (req) => {
  try {
    const items = await getAllAnimalItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch animal items' }, { status: 500 });
  }
};

export const POST = async (req) => {
    const formData = await req.formData();
  
    const title = formData.get('title');
    const description = formData.get('description');
    const animalImage = formData.get('animalImage');
    const animalSmallImage = formData.get('animalSmallImage');
    const section = formData.get('section');
  
    // Validate inputs
    if (!title || !description || !animalImage || !animalSmallImage || !section) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }
  
    // Ensure upload directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
  
    // Generate unique filenames with a timestamp
    const timestamp = Date.now();
    const animalImageExtension = path.extname(animalImage.name);
    const animalImageName = `${path.basename(animalImage.name, animalImageExtension)}_${timestamp}${animalImageExtension}`;
    const animalSmallImageExtension = path.extname(animalSmallImage.name);
    const animalSmallImageName = `${path.basename(animalSmallImage.name, animalSmallImageExtension)}_${timestamp}${animalSmallImageExtension}`;

    const animalImagePath = path.join(UPLOAD_DIR, animalImageName);
    const animalSmallImagePath = path.join(UPLOAD_DIR, animalSmallImageName);

    try {
      // Save the animal image file
      const animalImageBuffer = Buffer.from(await animalImage.arrayBuffer());
      fs.writeFileSync(animalImagePath, animalImageBuffer);

      // Save the small image file
      const animalSmallImageBuffer = Buffer.from(await animalSmallImage.arrayBuffer());
      fs.writeFileSync(animalSmallImagePath, animalSmallImageBuffer);
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Failed to save the images' }, { status: 500 });
    }
  
    // Prepare the item to save in the database
    const animalItem = {
      title,
      description,
      animalImage: `/uploads/animal/${animalImageName}`, // Use the new filename with timestamp
      animalSmallImage: `/uploads/animal/${animalSmallImageName}`, // Use the new filename with timestamp
      section,
    };
  
    // Save animal item details using addAnimalItem
    try {
      await addAnimalItem(animalItem);
    } catch (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  
    return NextResponse.json({
      success: true,
      message: 'Animal item added successfully!',
      data: animalItem,
    });
};
