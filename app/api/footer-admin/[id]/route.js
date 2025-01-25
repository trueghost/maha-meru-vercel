import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
    getFooterItemById,
    updateFooterItem,
    deleteFooterItem
} from "../../../../lib/footer";

// Set the upload directory to your specified path
const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/footer');

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getFooterItemById(id); // Updated function call
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
        // Fetch the existing footer item
        const existingItem = await getFooterItemById(id);
        let updatedImagePath = existingItem.image; // Default to existing image path

        // Check if a new image is uploaded
        const file = formData.get('image');
        if (file && file instanceof File) {
            const buffer = Buffer.from(await file.arrayBuffer());

            // Generate a timestamped filename
            const timestamp = Date.now();
            const ext = path.extname(file.name); // Extract the original file extension
            const baseName = path.basename(file.name, ext); // Get the filename without extension
            const timestampedName = `${baseName}_${timestamp}${ext}`; // Create new filename
            const imagePath = path.join(UPLOAD_DIR, timestampedName);

            // Save the new image with timestamped filename
            fs.writeFileSync(imagePath, buffer);
            updatedImagePath = `/uploads/footer/${timestampedName}`; // Update path with timestamped name

            // Optionally delete the old image
            const oldImagePath = path.join(UPLOAD_DIR, existingItem.image.split('/').pop());
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        } else {
            // console.log('No new image uploaded, using existing image.');
        }

        // Update the footer item
        await updateFooterItem(id, {
            ...body,
            image: updatedImagePath, // Use the updated or existing image path
        });

        return NextResponse.json({ success: true, message: 'Footer item updated successfully!' });
    } catch (error) {
        console.error('Error updating footer item:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        // Fetch the footer item to get the image path
        const item = await getFooterItemById(id);

        // Delete the item from the database
        await deleteFooterItem(id); // Updated function call

        // Remove the image file if it exists
        const imagePath = path.join(UPLOAD_DIR, item.image.split('/').pop());
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        return NextResponse.json({ success: true, message: 'Footer item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};
