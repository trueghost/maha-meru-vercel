const { NextResponse } = require('next/server');

export async function GET(req, res) {
  try {
    const tagLine1 = `M - POWER NATURE,`;
    const tagLine2 = 'BLOSSOM LIFE';
    const tagColor = '#193048';
    const tagLines = { tagLine1, tagLine2, tagColor };
    return new NextResponse(JSON.stringify(tagLines), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: error.toString() }), {
      status: 500,
    });
  }
}
