const { addUser } = require('../../../lib/index');
const { NextResponse } = require('next/server');

export async function POST(req, res) {
  try {
    const formData = await req.json();
    // console.log(formData); // Log the parsed form data to the console

    // Call the addUser function with the parsed form data
    await addUser(formData);

    // Respond with a success message
    return NextResponse.json(
      { message: 'OK' },
      {
        status: 200,
      }
    );
  } catch (error) {
    // If an error occurs, log it and respond with an error message
    // console.error('Registration failed:', error);
    return new NextResponse(JSON.stringify({ message: error.toString() }), {
      status: 500,
    });
  }
}
