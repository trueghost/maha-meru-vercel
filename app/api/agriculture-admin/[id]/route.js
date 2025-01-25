import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
    getAgricultureItemById,
    updateAgricultureItem,
    deleteAgricultureItem
} from "../../../../lib/agriculture";

// Set the upload directory to your specified path
const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/agriculture');

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
        let updatedPlantImagePath = existingItem.plantImage;
        let updatedSmallImagePath = existingItem.plantSmallImage;

        // Generate a timestamp to add to filenames
        const timestamp = Date.now();

        // Check if new plant image is uploaded
        const plantImageFile = formData.get('plantImage');
        if (plantImageFile && plantImageFile instanceof File) {
            const plantImageExtension = path.extname(plantImageFile.name);
            const plantImageName = `${path.basename(plantImageFile.name, plantImageExtension)}_${timestamp}${plantImageExtension}`;
            const plantImagePath = path.join(UPLOAD_DIR, plantImageName);
            const buffer = Buffer.from(await plantImageFile.arrayBuffer());

            // Save the new plant image
            fs.writeFileSync(plantImagePath, buffer);
            updatedPlantImagePath = `/uploads/agriculture/${plantImageName}`;

            // Optionally delete the old plant image
            const oldPlantImagePath = path.join(UPLOAD_DIR, path.basename(existingItem.plantImage));
            if (fs.existsSync(oldPlantImagePath)) {
                fs.unlinkSync(oldPlantImagePath);
            }
        }

        // Check if new small image is uploaded
        const smallImageFile = formData.get('plantSmallImage');
        if (smallImageFile && smallImageFile instanceof File) {
            const smallImageExtension = path.extname(smallImageFile.name);
            const smallImageName = `${path.basename(smallImageFile.name, smallImageExtension)}_${timestamp}${smallImageExtension}`;
            const smallImagePath = path.join(UPLOAD_DIR, smallImageName);
            const buffer = Buffer.from(await smallImageFile.arrayBuffer());

            // Save the new small image
            fs.writeFileSync(smallImagePath, buffer);
            updatedSmallImagePath = `/uploads/agriculture/${smallImageName}`;

            // Optionally delete the old small image
            const oldSmallImagePath = path.join(UPLOAD_DIR, path.basename(existingItem.plantSmallImage));
            if (fs.existsSync(oldSmallImagePath)) {
                fs.unlinkSync(oldSmallImagePath);
            }
        }

        // Update the agriculture item
        await updateAgricultureItem(id, {
            ...body,
            plantImage: updatedPlantImagePath,
            plantSmallImage: updatedSmallImagePath,
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
        // Fetch the agriculture item to get the image paths
        const item = await getAgricultureItemById(id);

        // Delete the item from the database
        await deleteAgricultureItem(id);

        // Remove the plant image file if it exists
        const plantImagePath = path.join(UPLOAD_DIR, path.basename(item.plantImage));
        if (fs.existsSync(plantImagePath)) {
            fs.unlinkSync(plantImagePath);
        }

        // Remove the small image file if it exists
        const smallImagePath = path.join(UPLOAD_DIR, path.basename(item.plantSmallImage));
        if (fs.existsSync(smallImagePath)) {
            fs.unlinkSync(smallImagePath);
        }

        return NextResponse.json({ success: true, message: 'Agriculture item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};
