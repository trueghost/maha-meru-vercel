import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
    getConnectFirstItemById,
    updateConnectFirstItem,
    deleteConnectFirstItem
} from "../../../../lib/connectFirst";

// Set the upload directory to your specified path
const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/connect-first');

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getConnectFirstItemById(id);
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
        // Fetch the existing connect first item
        const existingItem = await getConnectFirstItemById(id);
        let updatedImagePath = existingItem.image; // Default to existing image path

        // Check if a new image is uploaded
        const file = formData.get('image');
        if (file && file instanceof File) {
            const buffer = Buffer.from(await file.arrayBuffer());

            // Create a unique filename with a timestamp
            const timestamp = Date.now(); // Get the current timestamp
            const ext = path.extname(file.name); // Get the file extension
            const baseName = path.basename(file.name, ext); // Get the file base name (without extension)
            const timestampedName = `${baseName}_${timestamp}${ext}`; // Add the timestamp to the file name

            const imagePath = path.join(UPLOAD_DIR, timestampedName);

            // Save the new image with the timestamped name
            fs.writeFileSync(imagePath, buffer);
            updatedImagePath = `/uploads/connect-first/${timestampedName}`; // Update the image path

            // Optionally delete the old image
            const oldImagePath = path.join(UPLOAD_DIR, existingItem.image.split('/').pop());
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        } else {
            // console.log('No new image uploaded, using existing image.');
        }

        // Update the connect first item with the new or existing image
        await updateConnectFirstItem(id, {
            ...body,
            image: updatedImagePath, // Use the updated or existing image path
        });

        return NextResponse.json({ success: true, message: 'Connect first item updated successfully!' });
    } catch (error) {
        console.error('Error updating connect first item:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        // Fetch the connect first item to get the image path
        const item = await getConnectFirstItemById(id);

        // Delete the item from the database
        await deleteConnectFirstItem(id);

        // Remove the image file if it exists
        const imagePath = path.join(UPLOAD_DIR, item.image.split('/').pop());
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        return NextResponse.json({ success: true, message: 'Connect first item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};
