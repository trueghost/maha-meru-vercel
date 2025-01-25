import { NextRequest, NextResponse } from 'next/server';
import { getAllTabsItems, addTabsItem } from '../../../lib/tabsAdmin';

export const GET = async (req) => {
  try {
    const items = await getAllTabsItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch tabs admin items' }, { status: 500 });
  }
};

export const POST = async (req) => {
  const formData = await req.formData();
  
  const tabTitle = formData.get('tabTitle'); // Change column name to tabTitle
  const productIds = formData.get('productIds'); // Change column name to productIds
  
  // Validate inputs
  if (!tabTitle) {
    return NextResponse.json({ success: false, message: 'Tab title is required' }, { status: 400 });
  }

  if (!productIds || !Array.isArray(JSON.parse(productIds))) {
    return NextResponse.json({ success: false, message: 'Product IDs are required and must be an array' }, { status: 400 });
  }
  
  // Prepare the item to save in the database
  const tabsAdminItem = {
    tabTitle, // Use the correct column name
    productIds: JSON.parse(productIds), // Parse product IDs to an array
  };
  
  // Save tabs admin item details using addTabsAdminItem
  try {
    await addTabsItem(tabsAdminItem);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  
  return NextResponse.json({
    success: true,
    message: 'Tabs admin item added successfully!',
    data: tabsAdminItem,
  });
};