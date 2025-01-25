import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
    getAboutTrustItemById,
    updateAboutTrustItem,
    deleteAboutTrustItem
} from "../../../../lib/aboutTrust";

// Set the upload directory to your specified path
const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/about-trust');

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getAboutTrustItemById(id);
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
        // Fetch the existing about trust item
        const existingItem = await getAboutTrustItemById(id);
        let updatedImagePath = existingItem.image; // Default to existing image path

        // Check if a new image is uploaded
        const file = formData.get('image');
        if (file && file instanceof File) {
            const buffer = Buffer.from(await file.arrayBuffer());

            // Generate a unique filename with timestamp
            const timestamp = Date.now();
            const extension = path.extname(file.name);
            const uniqueImageName = `${path.basename(file.name, extension)}_${timestamp}${extension}`;
            const imagePath = path.join(UPLOAD_DIR, uniqueImageName);

            // Save the new image
            fs.writeFileSync(imagePath, buffer);
            updatedImagePath = `/uploads/about-trust/${uniqueImageName}`; // Update the image path with unique filename

            // Optionally delete the old image
            const oldImagePath = path.join(UPLOAD_DIR, existingItem.image.split('/').pop());
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        } else {
            // console.log('No new image uploaded, using existing image.');
        }

        // Update the about trust item
        await updateAboutTrustItem(id, {
            ...body,
            image: updatedImagePath, // Use the updated or existing image path
        });

        return NextResponse.json({ success: true, message: 'About trust item updated successfully!' });
    } catch (error) {
        console.error('Error updating about trust item:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const PATCH = async (req, { params }) => {
    const { id } = params;
    const { hide } = await req.json();

    try {
        if (!id) {
            return NextResponse.json({ success: false, message: 'About Trust ID is required' }, { status: 400 });
        }

        // Fetch the current about trust item
        const aboutTrustItem = await getAboutTrustItemById(id);
        if (!aboutTrustItem) {
            return NextResponse.json({ success: false, message: 'About Trust item not found' }, { status: 404 });
        }

        // Update the 'hide' field while preserving other values
        const updatedItem = await updateAboutTrustItem(id, {
            ...aboutTrustItem, // Preserve existing values
            hide: Boolean(hide), // Update only the 'hide' field
        });

        return NextResponse.json({
            success: true,
            message: `About Trust item ${hide ? 'hidden' : 'visible'} successfully!`,
            data: updatedItem,
        });
    } catch (error) {
        console.error('Error updating hide status:', error);
        return NextResponse.json({ success: false, message: 'Failed to update hide status', error: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        // Fetch the about trust item to get the image path
        const item = await getAboutTrustItemById(id);

        // Delete the item from the database
        await deleteAboutTrustItem(id);

        // Remove the image file if it exists
        const imagePath = path.join(UPLOAD_DIR, item.image.split('/').pop());
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        return NextResponse.json({ success: true, message: 'About trust item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};
