const { loginUser } = require('../../../lib/index');
const { NextResponse } = require('next/server');

export async function POST(req, res) {
  try {
    const { username, password } = await req.json();
    const user = await loginUser(username, password);
    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: error.toString() }), {
      status: 500,
    });
  }
}
