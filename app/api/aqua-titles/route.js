import { NextRequest, NextResponse } from 'next/server';
import { getAllAquaTitlesItems, addAquaTitlesItem } from '../../../lib/aquaTitles';

export const GET = async (req) => {
  try {
    const items = await getAllAquaTitlesItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch aqua titles items' }, { status: 500 });
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
  const aquaTitleItem = {
    title, // Only one column named title
  };
  
  // Save aqua title item details using addAquaTitlesItem
  try {
    await addAquaTitlesItem(aquaTitleItem);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  
  return NextResponse.json({
    success: true,
    message: 'Aqua title item added successfully!',
    data: aquaTitleItem,
  });
};