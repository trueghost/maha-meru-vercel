import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
    getAboutStoryItemById,
    updateAboutStoryItem,
    deleteAboutStoryItem
} from "../../../../lib/aboutStory";

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/about-story');

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getAboutStoryItemById(id);
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
        // Fetch the existing about story item
        const existingItem = await getAboutStoryItemById(id);
        let updatedImagePath = existingItem.image; // Default to existing image path

        // Check if a new image is uploaded
        const file = formData.get('image');
        if (file && file instanceof File) {
            const buffer = Buffer.from(await file.arrayBuffer());

            // Generate a unique filename with a timestamp
            const timestamp = Date.now();
            const extension = path.extname(file.name);
            const uniqueImageName = `${path.basename(file.name, extension)}_${timestamp}${extension}`;
            const imagePath = path.join(UPLOAD_DIR, uniqueImageName);

            // Save the new image
            fs.writeFileSync(imagePath, buffer);
            updatedImagePath = `/uploads/about-story/${uniqueImageName}`; // Update the image path

            // Optionally delete the old image
            const oldImagePath = path.join(UPLOAD_DIR, existingItem.image.split('/').pop());
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        } else {
            // console.log('No new image uploaded, using existing image.');
        }

        // Update the about story item
        await updateAboutStoryItem(id, {
            ...body,
            image: updatedImagePath, // Use the updated or existing image path
        });

        return NextResponse.json({ success: true, message: 'About story item updated successfully!' });
    } catch (error) {
        console.error('Error updating about story item:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        // Fetch the about story item to get the image path
        const item = await getAboutStoryItemById(id);

        // Delete the item from the database
        await deleteAboutStoryItem(id);

        // Remove the image file if it exists
        const imagePath = path.join(UPLOAD_DIR, item.image.split('/').pop());
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        return NextResponse.json({ success: true, message: 'About story item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};
