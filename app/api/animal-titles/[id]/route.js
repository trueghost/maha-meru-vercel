import { NextResponse } from 'next/server';
import {
    getAnimalTitlesItemById,
    updateAnimalTitlesItem,
    deleteAnimalTitlesItem
} from "../../../../lib/animalTitles";

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getAnimalTitlesItemById(id); // Updated function name
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
        // Update the animal title item
        await updateAnimalTitlesItem(id, {
            ...body,
        });

        return NextResponse.json({ success: true, message: 'Animal title item updated successfully!' });
    } catch (error) {
        console.error('Error updating animal title item:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        // Fetch the animal title item
        const item = await getAnimalTitlesItemById(id); // Updated function name

        // Delete the item from the database
        await deleteAnimalTitlesItem(id);

        return NextResponse.json({ success: true, message: 'Animal title item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};