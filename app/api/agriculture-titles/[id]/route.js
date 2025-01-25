import { NextResponse } from 'next/server';
import {
    getAgricultureTitlesItemById,
    updateAgricultureTitlesItem,
    deleteAgricultureTitlesItem
} from "../../../../lib/agricultureTitles";

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getAgricultureTitlesItemById(id); // Updated function name
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
        // Update the agriculture title item
        await updateAgricultureTitlesItem(id, {
            ...body,
        });

        return NextResponse.json({ success: true, message: 'Agriculture title item updated successfully!' });
    } catch (error) {
        console.error('Error updating agriculture title item:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        // Fetch the agriculture title item
        const item = await getAgricultureTitlesItemById(id); // Updated function name

        // Delete the item from the database
        await deleteAgricultureTitlesItem(id);

        return NextResponse.json({ success: true, message: 'Agriculture title item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};