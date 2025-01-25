const { updateTitleAndSubtextEntry, getTitleAndSubtextEntryById, deleteTitleAndSubtextEntry } = require("../../../../lib/allTitleAndSubtext");
const { NextResponse } = require("next/server");

// GET a title and subtext entry by ID
export const GET = async (req, { params }) => {
    const { id } = params;

    try {
        const entry = await getTitleAndSubtextEntryById(id);
        if (!entry) {
            return NextResponse.json({ message: 'Entry not found' }, { status: 404 });
        }
        return NextResponse.json(entry, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching entry' }, { status: 500 });
    }
};

// PUT (update) a title and subtext entry
export const PUT = async (req, { params }) => {
    const { id } = params;

    try {
        const entryData = await req.json();

        if (!id) {
            return NextResponse.json({ message: 'Entry ID is required' }, { status: 400 });
        }

        // Ensure that 'hide' is not null. If it is missing, set it to 0 (or any default value).
        if (entryData.hide === undefined || entryData.hide === null) {
            entryData.hide = 0; // Set default value for 'hide'
        }

        const updatedEntry = await updateTitleAndSubtextEntry(id, entryData);

        if (!updatedEntry) {
            return NextResponse.json({ message: 'Failed to update entry' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Entry updated successfully', entry: updatedEntry }, { status: 200 });
    } catch (err) {
        // console.error('Error updating entry:', err);
        return NextResponse.json({ message: 'Error updating entry', error: err.message }, { status: 500 });
    }
};

// DELETE a title and subtext entry
export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        if (!id) {
            return NextResponse.json({ message: 'Entry ID is required' }, { status: 400 });
        }

        await deleteTitleAndSubtextEntry(id);
        return NextResponse.json({ message: 'Entry deleted successfully' }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err: err.message }, { status: 500 });
    }
};

// PATCH to toggle hide status for a title and subtext entry
export const PATCH = async (req, { params }) => {
    const { id } = params;
    const { hide } = await req.json(); // Extract the 'hide' value from the request body

    try {
        if (!id) {
            return NextResponse.json({ message: 'Entry ID is required' }, { status: 400 });
        }

        // Fetch the current entry details
        const entry = await getTitleAndSubtextEntryById(id);
        if (!entry) {
            return NextResponse.json({ message: 'Entry not found' }, { status: 404 });
        }

        // Extract values that should not be null (keep them unchanged)
        const { page_name, title, subtext } = entry;

        // Ensure 'hide' is a boolean before updating
        const updatedEntry = {
            page_name,   // Keep the existing page_name
            title,       // Keep the existing title
            subtext,     // Keep the existing subtext
            hide: Boolean(hide) // Update the 'hide' field
        };

        // Call update function with the updated entry
        const result = await updateTitleAndSubtextEntry(id, updatedEntry);

        return NextResponse.json({
            message: `Entry ${hide ? 'hidden' : 'visible'} successfully`,
            entry: result
        }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Error', err: err.message }, { status: 500 });
    }
};
