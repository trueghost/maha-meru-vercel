import { NextRequest, NextResponse } from 'next/server';
import { getAllAgricultureTitlesItems, addAgricultureTitlesItem } from '../../../lib/agricultureTitles';

export const GET = async (req) => {
  try {
    const items = await getAllAgricultureTitlesItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch agriculture titles items' }, { status: 500 });
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
  const agricultureTitleItem = {
    title, // Only one column named title
  };
  
  // Save agriculture title item details using addAgricultureTitlesItem
  try {
    await addAgricultureTitlesItem(agricultureTitleItem);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  
  return NextResponse.json({
    success: true,
    message: 'Agriculture title item added successfully!',
    data: agricultureTitleItem,
  });
};
