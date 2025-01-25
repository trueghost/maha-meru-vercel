import { NextResponse } from 'next/server';
import {
    getAquaTitlesItemById,
    updateAquaTitlesItem,
    deleteAquaTitlesItem
} from "../../../../lib/aquaTitles";

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getAquaTitlesItemById(id); // Updated function name
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
        // Update the aqua title item
        await updateAquaTitlesItem(id, {
            ...body,
        });

        return NextResponse.json({ success: true, message: 'Aqua title item updated successfully!' });
    } catch (error) {
        console.error('Error updating aqua title item:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        // Fetch the aqua title item
        const item = await getAquaTitlesItemById(id); // Updated function name

        // Delete the item from the database
        await deleteAquaTitlesItem(id);

        return NextResponse.json({ success: true, message: 'Aqua title item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};