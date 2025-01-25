import { NextRequest, NextResponse } from 'next/server';
import { getAllProductSupplyItems, addProductSupplyItem } from '../../../lib/productSupply';

export const GET = async (req) => {
  try {
    const items = await getAllProductSupplyItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch product supply items' }, { status: 500 });
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
  const productSupplyItem = {
    title, // Only one column named title
  };
  
  // Save product supply item details using addProductSupplyItem
  try {
    await addProductSupplyItem(productSupplyItem);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  
  return NextResponse.json({
    success: true,
    message: 'Product supply item added successfully!',
    data: productSupplyItem,
  });
};