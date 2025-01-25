import { NextResponse } from 'next/server';
import {
    getFormItemById,
    updateFormItem,
    deleteFormItem
} from "../../../../lib/form";

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getFormItemById(id);
        if (!item) {
            return NextResponse.json({ success: false, message: 'Form item not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: item });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const PUT = async (req, { params }) => {
    const { id } = params;

    try {
        // Ensure the request is a PUT request
        if (req.method !== 'PUT') {
            return NextResponse.json({ success: false, message: 'Method not allowed' }, { status: 405 });
        }

        // Parse JSON body instead of FormData
        const body = await req.json(); // Correctly parse the JSON body

        // Fetch the existing form item by ID
        const existingItem = await getFormItemById(id);
        if (!existingItem) {
            return NextResponse.json({ success: false, message: 'Form item not found' }, { status: 404 });
        }

        // Update the form item using snake_case field names to match your database structure
        await updateFormItem(id, {
            mobile_number_1: body.mobile_number_1 || existingItem.mobile_number_1,
            mobile_number_2: body.mobile_number_2 || existingItem.mobile_number_2,
            mail: body.mail || existingItem.mail,
            location: body.location || existingItem.location,
            facebook_url: body.facebook_url || existingItem.facebook_url,
            x_url: body.x_url || existingItem.x_url,
            instagram_url: body.instagram_url || existingItem.instagram_url,
            linkedin_url: body.linkedin_url || existingItem.linkedin_url,
            whatsapp_url: body.whatsapp_url || existingItem.whatsapp_url,
            // Include the placeholders
            placeholder_1: body.placeholder_1 || existingItem.placeholder_1,
            placeholder_2: body.placeholder_2 || existingItem.placeholder_2,
            placeholder_3: body.placeholder_3 || existingItem.placeholder_3,
            placeholder_4: body.placeholder_4 || existingItem.placeholder_4,
            placeholder_5: body.placeholder_5 || existingItem.placeholder_5,
            placeholder_6: body.placeholder_6 || existingItem.placeholder_6,
            placeholder_7: body.placeholder_7 || existingItem.placeholder_7,
            placeholder_8: body.placeholder_8 || existingItem.placeholder_8,
            placeholder_9: body.placeholder_9 || existingItem.placeholder_9,
        });

        return NextResponse.json({ success: true, message: 'Form item updated successfully!' });
    } catch (error) {
        console.error('Error updating form item:', error);
        return NextResponse.json({ success: false, message: 'Internal server error', error: error.message }, { status: 500 });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        // Fetch the form item to confirm existence before deletion
        const item = await getFormItemById(id);
        if (!item) {
            return NextResponse.json({ success: false, message: 'Form item not found' }, { status: 404 });
        }

        // Delete the item from the database
        await deleteFormItem(id);

        return NextResponse.json({ success: true, message: 'Form item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};