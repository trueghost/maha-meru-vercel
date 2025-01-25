import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
    getBannerItemById,
    updateBannerItem,
    deleteBannerItem
} from "../../../../lib/banner";

// Set the upload directory to your specified path
const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/banner');

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getBannerItemById(id); // Updated function call
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
        // Fetch the existing banner item
        const existingItem = await getBannerItemById(id);
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
            updatedImagePath = `/uploads/banner/${timestampedName}`; // Update path with timestamped name

            // Optionally delete the old image
            const oldImagePath = path.join(UPLOAD_DIR, existingItem.image.split('/').pop());
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        } else {
            // console.log('No new image uploaded, using existing image.');
        }

        // Update the banner item
        await updateBannerItem(id, {
            ...body,
            image: updatedImagePath, // Use the updated or existing image path
        });

        return NextResponse.json({ success: true, message: 'Banner item updated successfully!' });
    } catch (error) {
        console.error('Error updating banner item:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        // Fetch the banner item to get the image path
        const item = await getBannerItemById(id);

        // Delete the item from the database
        await deleteBannerItem(id); // Updated function call

        // Remove the image file if it exists
        const imagePath = path.join(UPLOAD_DIR, item.image.split('/').pop());
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        return NextResponse.json({ success: true, message: 'Banner item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};
