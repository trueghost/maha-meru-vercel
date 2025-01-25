import { NextRequest, NextResponse } from 'next/server';
import { getAllProductFormItems, addProductFormItem } from '../../../lib/productFormHandle';

// GET handler to fetch all form items
export const GET = async (req) => {
  try {
    // console.log('GET request received to fetch form items');  // Log when GET request is received

    // Fetch all form items from the database
    const items = await getAllProductFormItems();
    
    // console.log(`Fetched ${items.length} form items from the database`);  // Log the number of fetched items

    // Return success response with data
    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching form items:', error);  // Log the error
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch form items',
    }, { status: 500 });
  }
};

// POST handler to save form data
export const POST = async (req) => {
  try {
    // console.log('POST request received to add a form item');  // Log when POST request is received

    // Parse the JSON body of the request
    const formData = await req.json();  // Use .json() instead of .formData()

    // Log the parsed JSON data
    // console.log('Received form data:', formData);

    // Extract individual fields from form data
    const { name, email } = formData;

    // Log the extracted fields
    // console.log(`Name: ${name}, Email: ${email}, Phone Number: ${number}, Interests: ${interests}, Description: ${description}`);

    // Validate required fields
    if (!name || !email) {
      console.warn('Validation failed: Name and Email are required'); // Log a warning if validation fails
      return NextResponse.json({
        success: false,
        message: 'Name and Email are required fields',
      }, { status: 400 });
    }

    // Prepare the data to be saved in the form_handle table
    const formItem = {
      name,
      email,
    };

    // Log the form item that will be saved
    // console.log('Saving form item to database:', formItem);

    // Save form data to the database (replace with actual database logic)
    await addProductFormItem(formItem);

    // Log success after saving the item
    // console.log('Form item added successfully to the database');

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Form item added successfully!',
      data: formItem,
    });
  } catch (error) {
    console.error('Error adding form item:', error);  // Log the error
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};
