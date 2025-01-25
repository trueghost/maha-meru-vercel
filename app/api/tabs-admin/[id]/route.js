import { NextResponse } from 'next/server';
import {
    getTabsItemById,
    updateTabsItem,
    deleteTabsItem
} from "../../../../lib/tabsAdmin";

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getTabsItemById(id); // Updated function name
        return NextResponse.json({ success: true, data: item });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const PUT = async (req, { params }) => {
    const { id } = params;
    const formData = await req.formData();
    const body = Object.fromEntries(formData);

    try {
        // Update the tabs admin item
        await updateTabsItem(id, {
            tabTitle: body.tabTitle, // Ensure correct mapping of tabTitle
            productIds: JSON.parse(body.productIds), // Assuming productIds is a JSON string
        });

        return NextResponse.json({ success: true, message: 'Tabs admin item updated successfully!' });
    } catch (error) {
        console.error('Error updating tabs admin item:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        // Fetch the tabs admin item
        const item = await getTabsItemById(id); // Updated function name

        // Delete the item from the database
        await deleteTabsItem(id);

        return NextResponse.json({ success: true, message: 'Tabs admin item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};
