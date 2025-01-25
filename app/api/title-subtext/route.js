const { getAllTitleAndSubtextEntries, addTitleAndSubtextEntry } = require("../../../lib/allTitleAndSubtext");
const { NextResponse } = require("next/server");

// GET all title and subtext entries
export const GET = async (req) => {
    try {
        const entries = await getAllTitleAndSubtextEntries();
        return NextResponse.json({ message: 'OK', entries }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err: err.message }, { status: 500 });
    }
};

// POST a new title and subtext entry
export const POST = async (req) => {
    const body = await req.text(); // Get raw text
    // console.log("title and subtext entry", body); // Debug log

    let entryData;
    try {
        entryData = JSON.parse(body); // Parse JSON
    } catch (err) {
        return NextResponse.json({ message: 'Invalid JSON format' }, { status: 400 });
    }

    try {
        // Validate required fields
        if (!entryData.title || !entryData.subtext || !entryData.page_name) {
            return NextResponse.json({ message: 'Title, Subtext, and Page Name are required' }, { status: 400 });
        }

        const newEntry = await addTitleAndSubtextEntry(entryData);
        return NextResponse.json({ message: 'Entry added successfully', entry: newEntry }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err: err.message }, { status: 500 });
    }
};
