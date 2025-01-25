import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
    getAnimalItemById,
    updateAnimalItem,
    deleteAnimalItem
} from "../../../../lib/animal";

// Set the upload directory to your specified path
const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/animal');

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getAnimalItemById(id);
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
        // Fetch the existing animal item
        const existingItem = await getAnimalItemById(id);
        let updatedAnimalImagePath = existingItem.animalImage;
        let updatedSmallImagePath = existingItem.animalSmallImage;

        const timestamp = Date.now();

        // Check if new animal image is uploaded
        const animalImageFile = formData.get('animalImage');
        if (animalImageFile && animalImageFile instanceof File) {
            const buffer = Buffer.from(await animalImageFile.arrayBuffer());
            const animalImageExtension = path.extname(animalImageFile.name);
            const animalImageName = `${path.basename(animalImageFile.name, animalImageExtension)}_${timestamp}${animalImageExtension}`;
            const animalImagePath = path.join(UPLOAD_DIR, animalImageName);

            // Save the new animal image
            fs.writeFileSync(animalImagePath, buffer);
            updatedAnimalImagePath = `/uploads/animal/${animalImageName}`;

            // Optionally delete the old animal image
            const oldAnimalImagePath = path.join(UPLOAD_DIR, existingItem.animalImage.split('/').pop());
            if (fs.existsSync(oldAnimalImagePath)) {
                fs.unlinkSync(oldAnimalImagePath);
            }
        }

        // Check if new small image is uploaded
        const smallImageFile = formData.get('animalSmallImage');
        if (smallImageFile && smallImageFile instanceof File) {
            const buffer = Buffer.from(await smallImageFile.arrayBuffer());
            const smallImageExtension = path.extname(smallImageFile.name);
            const smallImageName = `${path.basename(smallImageFile.name, smallImageExtension)}_${timestamp}${smallImageExtension}`;
            const smallImagePath = path.join(UPLOAD_DIR, smallImageName);

            // Save the new small image
            fs.writeFileSync(smallImagePath, buffer);
            updatedSmallImagePath = `/uploads/animal/${smallImageName}`;

            // Optionally delete the old small image
            const oldSmallImagePath = path.join(UPLOAD_DIR, existingItem.animalSmallImage.split('/').pop());
            if (fs.existsSync(oldSmallImagePath)) {
                fs.unlinkSync(oldSmallImagePath);
            }
        }

        // Update the animal item
        await updateAnimalItem(id, {
            ...body,
            animalImage: updatedAnimalImagePath,
            animalSmallImage: updatedSmallImagePath,
        });

        return NextResponse.json({ success: true, message: 'Animal item updated successfully!' });
    } catch (error) {
        console.error('Error updating animal item:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        // Fetch the animal item to get the image paths
        const item = await getAnimalItemById(id);

        // Delete the item from the database
        await deleteAnimalItem(id);

        // Remove the animal image file if it exists
        const animalImagePath = path.join(UPLOAD_DIR, item.animalImage.split('/').pop());
        if (fs.existsSync(animalImagePath)) {
            fs.unlinkSync(animalImagePath);
        }

        // Remove the small image file if it exists
        const smallImagePath = path.join(UPLOAD_DIR, item.animalSmallImage.split('/').pop());
        if (fs.existsSync(smallImagePath)) {
            fs.unlinkSync(smallImagePath);
        }

        return NextResponse.json({ success: true, message: 'Animal item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};
