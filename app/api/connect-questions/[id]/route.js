import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
    getConnectQuestionsItemById,
    updateConnectQuestionsItem,
    deleteConnectQuestionsItem
} from "../../../../lib/connectQuestions";

// Set the upload directory to your specified path
const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/connect-questions');

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getConnectQuestionsItemById(id);
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
        // Fetch the existing connect questions item
        const existingItem = await getConnectQuestionsItemById(id);

        let updatedImagePath = existingItem.image; // Default to existing image path

        // Check if a new image is uploaded
        const file = formData.get('image');
        if (file && file instanceof File) {
            const timestamp = Date.now(); // Get the current timestamp
            const ext = path.extname(file.name); // Get the file extension
            const baseName = path.basename(file.name, ext); // Get the base name of the file
            const timestampedName = `${baseName}_${timestamp}${ext}`; // Create a unique filename with timestamp

            // Save the new image with the timestamped name
            const buffer = Buffer.from(await file.arrayBuffer());
            const imagePath = path.join(UPLOAD_DIR, timestampedName);
            
            // Ensure the upload directory exists
            if (!fs.existsSync(UPLOAD_DIR)) {
                fs.mkdirSync(UPLOAD_DIR, { recursive: true });
            }

            // Save the image file
            fs.writeFileSync(imagePath, buffer);

            // Store both the original filename and the timestamped filename
            updatedImagePath = {
                original: file.name,
                timestamped: `/uploads/connect-questions/${timestampedName}`,
            };

            // Optionally delete the old image
            const oldImagePath = path.join(UPLOAD_DIR, existingItem.image.split('/').pop());
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        } else {
            // console.log('No new image uploaded, using existing image.');
        }

        // Update the connect questions item with the new image data
        await updateConnectQuestionsItem(id, {
            ...body,
            image: updatedImagePath, // Store both original and timestamped paths
        });

        return NextResponse.json({ success: true, message: 'Connect questions item updated successfully!' });
    } catch (error) {
        console.error('Error updating connect questions item:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        // Fetch the connect questions item
        const item = await getConnectQuestionsItemById(id);

        // Delete the item from the database
        await deleteConnectQuestionsItem(id);

        // Optionally delete the image file
        const imagePath = path.join(UPLOAD_DIR, item.image.timestamped.split('/').pop());
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        return NextResponse.json({ success: true, message: 'Connect questions item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};
