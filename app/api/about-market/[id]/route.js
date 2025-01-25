import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
    getAboutMarketItemById,
    updateAboutMarketItem,
    deleteAboutMarketItem
} from "../../../../lib/aboutMarket";

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/about-market');

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getAboutMarketItemById(id);
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
        const existingItem = await getAboutMarketItemById(id);
        let updatedImagePath = existingItem.image;
        let updatedHoverImagePath = existingItem.hoverImage;

        const timestamp = Date.now(); // Generate a timestamp

        // Handle the main image update
        const file = formData.get('image');
        if (file && file instanceof File) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const extension = path.extname(file.name);
            const imageName = `${path.basename(file.name, extension)}_${timestamp}${extension}`;
            const imagePath = path.join(UPLOAD_DIR, imageName);

            fs.writeFileSync(imagePath, buffer);
            updatedImagePath = `/uploads/about-market/${imageName}`;

            const oldImagePath = path.join(UPLOAD_DIR, existingItem.image.split('/').pop());
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Handle the hover image update
        const hoverFile = formData.get('hoverImage');
        if (hoverFile && hoverFile instanceof File) {
            const hoverBuffer = Buffer.from(await hoverFile.arrayBuffer());
            const hoverExtension = path.extname(hoverFile.name);
            const hoverImageName = `${path.basename(hoverFile.name, hoverExtension)}_${timestamp}${hoverExtension}`;
            const hoverImagePath = path.join(UPLOAD_DIR, hoverImageName);

            fs.writeFileSync(hoverImagePath, hoverBuffer);
            updatedHoverImagePath = `/uploads/about-market/${hoverImageName}`;

            const oldHoverImagePath = path.join(UPLOAD_DIR, existingItem.hoverImage.split('/').pop());
            if (fs.existsSync(oldHoverImagePath)) {
                fs.unlinkSync(oldHoverImagePath);
            }
        }

        await updateAboutMarketItem(id, {
            ...body,
            image: updatedImagePath,
            hoverImage: updatedHoverImagePath,
        });

        return NextResponse.json({ success: true, message: 'About market item updated successfully!' });
    } catch (error) {
        console.error('Error updating about market item:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        const item = await getAboutMarketItemById(id);
        await deleteAboutMarketItem(id);

        const imagePath = path.join(UPLOAD_DIR, item.image.split('/').pop());
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        const hoverImagePath = path.join(UPLOAD_DIR, item.hoverImage.split('/').pop());
        if (fs.existsSync(hoverImagePath)) {
            fs.unlinkSync(hoverImagePath);
        }

        return NextResponse.json({ success: true, message: 'About market item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};
