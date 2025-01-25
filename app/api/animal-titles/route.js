import { NextRequest, NextResponse } from 'next/server';
import { getAllAnimalTitlesItems, addAnimalTitlesItem } from '../../../lib/animalTitles';

export const GET = async (req) => {
  try {
    const items = await getAllAnimalTitlesItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch animal titles items' }, { status: 500 });
  }
};

export const POST = async (req) => {
  const formData = await req.formData();
  
  const title = formData.get('title'); // Only one column named title
  
  // Validate inputs
  if (!title) {
    return NextResponse.json({ success: false, message: 'Title is required' }, { status: 400 });
  }
  
  // Prepare the item to save in the database
  const animalTitleItem = {
    title, // Only one column named title
  };
  
  // Save animal title item details using addAnimalTitlesItem
  try {
    await addAnimalTitlesItem(animalTitleItem);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  
  return NextResponse.json({
    success: true,
    message: 'Animal title item added successfully!',
    data: animalTitleItem,
  });
};