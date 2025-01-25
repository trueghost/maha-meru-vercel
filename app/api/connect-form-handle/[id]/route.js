import { NextRequest, NextResponse } from 'next/server';
import { getConnectFormItemById, deleteConnectFormItem } from '../../../../lib/connectFormHandle';  // Make sure this function is correctly implemented

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getConnectFormItemById(id);
        if (!item) {
            return NextResponse.json({ success: false, message: 'Form item not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: item });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};

// DELETE handler to delete a form item by id
export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        // Fetch the form item to confirm existence before deletion
        const item = await getConnectFormItemById(id);
        if (!item) {
            return NextResponse.json({ success: false, message: 'Form item not found' }, { status: 404 });
        }

        // Delete the item from the database
        await deleteConnectFormItem(id);

        return NextResponse.json({ success: true, message: 'Form item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};
