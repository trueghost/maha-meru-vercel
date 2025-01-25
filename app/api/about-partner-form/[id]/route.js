import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
    getAboutPartnerFormItemById,
    updateAboutPartnerFormItem,
    deleteAboutPartnerFormItem
} from "../../../../lib/aboutPartnerForm";

// Set the upload directory to your specified path
const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/about-partner-form');

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getAboutPartnerFormItemById(id);
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
        // Fetch the existing about partner form item
        const existingItem = await getAboutPartnerFormItemById(id);
        let updatedFilePath = existingItem.file; // Default to existing file path

        // Check if a new file is uploaded
        const file = formData.get('file');
        if (file && file instanceof File) {
            const buffer = Buffer.from(await file.arrayBuffer());

            // Generate a unique filename with timestamp
            const timestamp = Date.now();
            const extension = path.extname(file.name);
            const uniqueFileName = `${path.basename(file.name, extension)}_${timestamp}${extension}`;
            const filePath = path.join(UPLOAD_DIR, uniqueFileName);

            // Save the new file
            fs.writeFileSync(filePath, buffer);
            updatedFilePath = `/uploads/about-partner-form/${uniqueFileName}`; // Update the file path with unique filename

            // Optionally delete the old file
            const oldFilePath = path.join(UPLOAD_DIR, existingItem.file.split('/').pop());
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        } else {
            // console.log('No new file uploaded, using existing file.');
        }

        // Update the about partner form item
        await updateAboutPartnerFormItem(id, {
            ...body,
            file: updatedFilePath, // Use the updated or existing file path
        });

        return NextResponse.json({ success: true, message: 'About partner form item updated successfully!' });
    } catch (error) {
        console.error('Error updating about partner form item:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        // Fetch the about partner form item to get the file path
        const item = await getAboutPartnerFormItemById(id);

        // Delete the item from the database
        await deleteAboutPartnerFormItem(id);

        // Remove the file if it exists
        const filePath = path.join(UPLOAD_DIR, item.file.split('/').pop());
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return NextResponse.json({ success: true, message: 'About partner form item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};