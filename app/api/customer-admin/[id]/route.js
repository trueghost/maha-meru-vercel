import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
    getCustomerStoryById,
    updateCustomerStory,
    deleteCustomerStory
} from "../../../../lib/customerHome";

// Set the upload directory to your specified path
const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/customerStories');

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getCustomerStoryById(id); // Fetch customer story by ID
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
        // Fetch the existing customer story
        const existingItem = await getCustomerStoryById(id);
        let updatedImageUrl = existingItem.image; // Default to existing image URL

        // Check if a new image is uploaded
        const file = formData.get('image');
        if (file && file instanceof File) {
            // Generate timestamped image name
            const timestamp = Date.now();
            const ext = path.extname(file.name); // Get file extension
            const baseName = path.basename(file.name, ext); // Get base name of the file
            const timestampedName = `${baseName}_${timestamp}${ext}`; // Append timestamp to filename

            const buffer = Buffer.from(await file.arrayBuffer());
            const imagePath = path.join(UPLOAD_DIR, timestampedName); // Path for the new image file

            // Save the new image
            fs.writeFileSync(imagePath, buffer);
            updatedImageUrl = `/uploads/customerStories/${timestampedName}`; // Update the image URL

            // Optionally delete the old image
            const oldImagePath = path.join(UPLOAD_DIR, existingItem.image.split('/').pop());
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath); // Delete the old image
            }
        } else {
            // console.log('No new image uploaded, using existing image.');
        }

        // Update the customer story with the new data
        await updateCustomerStory(id, {
            ...body,
            image: updatedImageUrl, // Use the updated or existing image URL
            original_image_name: file ? file.name : existingItem.original_image_name, // Store the original image name
        });

        return NextResponse.json({ success: true, message: 'Customer story updated successfully!' });
    } catch (error) {
        console.error('Error updating customer story:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        // Fetch the customer story to get the image path
        const item = await getCustomerStoryById(id);

        // Delete the story from the database
        await deleteCustomerStory(id);

        // Remove the image file if it exists
        const imagePath = path.join(UPLOAD_DIR, item.image.split('/').pop());
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        return NextResponse.json({ success: true, message: 'Customer story deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const PATCH = async (req, { params }) => {
    const { id } = params;
    const { hide } = await req.json();

    try {
        if (!id) {
            return NextResponse.json({ success: false, message: 'Customer story ID is required' }, { status: 400 });
        }

        // Fetch the current customer story item
        const customerStory = await getCustomerStoryById(id);
        if (!customerStory) {
            return NextResponse.json({ success: false, message: 'Customer story not found' }, { status: 404 });
        }

        // Update the 'hide' field while preserving other values
        const updatedStory = await updateCustomerStory(id, {
            ...customerStory, // Preserve existing values
            hide: Boolean(hide), // Update only the 'hide' field
        });

        return NextResponse.json({
            success: true,
            message: `Customer story ${hide ? 'hidden' : 'made visible'} successfully!`,
            data: updatedStory,
        });
    } catch (error) {
        console.error('Error updating hide status:', error);
        return NextResponse.json({ success: false, message: 'Failed to update hide status', error: error.message });
    }
};