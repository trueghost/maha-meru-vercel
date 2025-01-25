import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
    getConnectSecondItemById,
    updateConnectSecondItem,
    deleteConnectSecondItem
} from "../../../../lib/connectSecond";

// Set the upload directory to your specified path
const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/connect-second');

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getConnectSecondItemById(id);
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
        // Fetch the existing connect second item
        const existingItem = await getConnectSecondItemById(id);
        let updatedImagePath = existingItem.image; // Default to existing image path

        // Check if a new image is uploaded
        const file = formData.get('image');
        if (file && file instanceof File) {
            // Generate a timestamp to make the filename unique
            const timestamp = Date.now();
            const ext = path.extname(file.name); // Get the file extension
            const baseName = path.basename(file.name, ext); // Get the base name of the file
            const timestampedName = `${baseName}_${timestamp}${ext}`; // Create a unique filename with timestamp

            // Save the new image with the timestamped name
            const imagePath = path.join(UPLOAD_DIR, timestampedName);
            const buffer = Buffer.from(await file.arrayBuffer());

            // Save the image
            fs.writeFileSync(imagePath, buffer);
            updatedImagePath = `/uploads/connect-second/${timestampedName}`; // Update the image path

            // Optionally delete the old image
            const oldImagePath = path.join(UPLOAD_DIR, existingItem.image.split('/').pop());
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        } else {
            // console.log('No new image uploaded, using existing image.');
        }

        // Update the connect second item
        await updateConnectSecondItem(id, {
            ...body,
            image: updatedImagePath, // Use the updated or existing image path
            title: body.title // Include the title in the update
        });

        return NextResponse.json({ success: true, message: 'Connect second item updated successfully!' });
    } catch (error) {
        console.error('Error updating connect second item:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        // Fetch the connect second item to get the image path
        const item = await getConnectSecondItemById(id);

        // Delete the item from the database
        await deleteConnectSecondItem(id);

        // Remove the image file if it exists
        const imagePath = path.join(UPLOAD_DIR, item.image.split('/').pop());
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        return NextResponse.json({ success: true, message: 'Connect second item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};
