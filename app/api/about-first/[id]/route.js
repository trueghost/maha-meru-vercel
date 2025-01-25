import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
    getAboutFirstItemById,
    updateAboutFirstItem,
    deleteAboutFirstItem
} from "../../../../lib/aboutFirst";

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/about-first');

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getAboutFirstItemById(id);
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
        const existingItem = await getAboutFirstItemById(id);
        let updatedImagePath = existingItem.image;

        const file = formData.get('image');
        if (file && file instanceof File) {
            const buffer = Buffer.from(await file.arrayBuffer());

            // Generate a unique filename with a timestamp
            const timestamp = Date.now();
            const extension = path.extname(file.name);
            const imageName = `${path.basename(file.name, extension)}_${timestamp}${extension}`;
            const imagePath = path.join(UPLOAD_DIR, imageName);

            // Save the new image
            fs.writeFileSync(imagePath, buffer);
            updatedImagePath = `/uploads/about-first/${imageName}`;

            // Delete the old image
            const oldImagePath = path.join(UPLOAD_DIR, existingItem.image.split('/').pop());
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        } else {
            // console.log('No new image uploaded, using existing image.');
        }

        await updateAboutFirstItem(id, {
            ...body,
            image: updatedImagePath,
        });

        return NextResponse.json({ success: true, message: 'About first item updated successfully!' });
    } catch (error) {
        console.error('Error updating about first item:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        const item = await getAboutFirstItemById(id);

        await deleteAboutFirstItem(id);

        const imagePath = path.join(UPLOAD_DIR, item.image.split('/').pop());
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        return NextResponse.json({ success: true, message: 'About first item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};
