import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAllFormItems, addFormItem } from '../../../lib/form';

export const GET = async (req) => {
  try {
    const items = await getAllFormItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch form items' }, { status: 500 });
  }
};

export const POST = async (req) => {
  const formData = await req.formData();
  const formDataObject = Object.fromEntries(formData.entries());

  const mobile_number_1 = formData.get('mobileNumber1');
  const mobile_number_2 = formData.get('mobileNumber2');
  const mail = formData.get('email');
  const location = formData.get('location');
  const facebook_url = formData.get('facebookUrl');
  const x_url = formData.get('xUrl');
  const instagram_url = formData.get('instagramUrl');
  const linkedin_url = formData.get('linkedinUrl');
  const whatsapp_url = formData.get('whatsappUrl');

  // Capture placeholders
  const placeholder_1 = formData.get('placeholder1');
  const placeholder_2 = formData.get('placeholder2');
  const placeholder_3 = formData.get('placeholder3');
  const placeholder_4 = formData.get('placeholder4');
  const placeholder_5 = formData.get('placeholder5');
  const placeholder_6 = formData.get('placeholder6');
  const placeholder_7 = formData.get('placeholder7');
  const placeholder_8 = formData.get('placeholder8');
  const placeholder_9 = formData.get('placeholder9');

  // Validate required fields
  if (!mobile_number_1?.trim() || !mail?.trim() || !location?.trim()) {
    return NextResponse.json({ success: false, message: 'Mobile Number 1, Email, and Location are required fields' }, { status: 400 });
  }

  // Prepare the item to save in the database, including placeholders
  const formItem = {
    mobile_number_1,
    mobile_number_2,
    mail,
    location,
    facebook_url,
    x_url,
    instagram_url,
    linkedin_url,
    whatsapp_url,
    placeholder_1,
    placeholder_2,
    placeholder_3,
    placeholder_4,
    placeholder_5,
    placeholder_6,
    placeholder_7,
    placeholder_8,
    placeholder_9,
  };

  // Save form item details using addFormItem
  try {
    await addFormItem(formItem);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Form item added successfully!',
    data: formItem,
  });
};
