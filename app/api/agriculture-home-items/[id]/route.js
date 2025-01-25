import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
    getAgricultureItemById,
    updateAgricultureItem,
    deleteAgricultureItem
} from "../../../../lib/agricultureHome";

// Set the upload directory to your specified path
const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/agriculture-items');

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getAgricultureItemById(id);
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
        // Fetch the existing agriculture item
        const existingItem = await getAgricultureItemById(id);
        let updatedImageUrl = existingItem.image_url; // Default to existing image URL

        // Check if a new image is uploaded
        const file = formData.get('image');
        if (file && file instanceof File) {
            const buffer = Buffer.from(await file.arrayBuffer());

            // Generate a new image name with a timestamp
            const timestamp = Date.now();
            const imageExtension = path.extname(file.name);
            const imageName = `${path.basename(file.name, imageExtension)}_${timestamp}${imageExtension}`;
            const imagePath = path.join(UPLOAD_DIR, imageName);

            // Save the new image
            fs.writeFileSync(imagePath, buffer);
            updatedImageUrl = `/uploads/agriculture-items/${imageName}`; // Update the image URL with timestamped name

            // Optionally delete the old image
            const oldImagePath = path.join(UPLOAD_DIR, existingItem.image_url.split('/').pop());
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        } else {
            // console.log('No new image uploaded, using existing image.');
        }

        // Update the agriculture item
        await updateAgricultureItem(id, {
            ...body,
            image_url: updatedImageUrl, // Use the updated or existing image URL
            is_mobile_image: body.isMobileImage === 'true', // Ensure it's a boolean
        });

        return NextResponse.json({ success: true, message: 'Agriculture item updated successfully!' });
    } catch (error) {
        console.error('Error updating agriculture item:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        // Fetch the agriculture item to get the image path
        const item = await getAgricultureItemById(id);

        // Delete the item from the database
        await deleteAgricultureItem(id);

        // Remove the image file if it exists
        const imagePath = path.join(UPLOAD_DIR, item.image_url.split('/').pop());
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        return NextResponse.json({ success: true, message: 'Agriculture item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};
