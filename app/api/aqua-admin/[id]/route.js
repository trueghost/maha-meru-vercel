import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
    getAquaItemById,
    updateAquaItem,
    deleteAquaItem
} from "../../../../lib/aqua";

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/aqua');

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getAquaItemById(id);
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
        // Fetch the existing aqua item
        const existingItem = await getAquaItemById(id);
        let updatedPlantImagePath = existingItem.plantImage;
        let updatedSmallImagePath = existingItem.plantSmallImage;

        // Helper function to generate timestamped filename
        const getTimestampedFileName = (originalName) => {
            const timestamp = Date.now();
            const ext = path.extname(originalName);
            const baseName = path.basename(originalName, ext);
            return `${baseName}_${timestamp}${ext}`;
        };

        // Check if a new plant image is uploaded
        const plantImageFile = formData.get('plantImage');
        if (plantImageFile && plantImageFile instanceof File) {
            const plantImageName = getTimestampedFileName(plantImageFile.name);
            const plantImagePath = path.join(UPLOAD_DIR, plantImageName);
            const buffer = Buffer.from(await plantImageFile.arrayBuffer());

            // Save the new plant image
            fs.writeFileSync(plantImagePath, buffer);
            updatedPlantImagePath = `/uploads/aqua/${plantImageName}`;

            // Delete the old plant image
            const oldPlantImagePath = path.join(UPLOAD_DIR, existingItem.plantImage.split('/').pop());
            if (fs.existsSync(oldPlantImagePath)) {
                fs.unlinkSync(oldPlantImagePath);
            }
        }

        // Check if a new small image is uploaded
        const smallImageFile = formData.get('plantSmallImage');
        if (smallImageFile && smallImageFile instanceof File) {
            const smallImageName = getTimestampedFileName(smallImageFile.name);
            const smallImagePath = path.join(UPLOAD_DIR, smallImageName);
            const buffer = Buffer.from(await smallImageFile.arrayBuffer());

            // Save the new small image
            fs.writeFileSync(smallImagePath, buffer);
            updatedSmallImagePath = `/uploads/aqua/${smallImageName}`;

            // Delete the old small image
            const oldSmallImagePath = path.join(UPLOAD_DIR, existingItem.plantSmallImage.split('/').pop());
            if (fs.existsSync(oldSmallImagePath)) {
                fs.unlinkSync(oldSmallImagePath);
            }
        }

        // Update the aqua item
        await updateAquaItem(id, {
            ...body,
            plantImage: updatedPlantImagePath,
            plantSmallImage: updatedSmallImagePath,
        });

        return NextResponse.json({ success: true, message: 'Aqua item updated successfully!' });
    } catch (error) {
        console.error('Error updating aqua item:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        // Fetch the aqua item to get the image paths
        const item = await getAquaItemById(id);

        // Delete the item from the database
        await deleteAquaItem(id);

        // Remove the plant image file if it exists
        const plantImagePath = path.join(UPLOAD_DIR, item.plantImage.split('/').pop());
        if (fs.existsSync(plantImagePath)) {
            fs.unlinkSync(plantImagePath);
        }

        // Remove the small image file if it exists
        const smallImagePath = path.join(UPLOAD_DIR, item.plantSmallImage.split('/').pop());
        if (fs.existsSync(smallImagePath)) {
            fs.unlinkSync(smallImagePath);
        }

        return NextResponse.json({ success: true, message: 'Aqua item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};
