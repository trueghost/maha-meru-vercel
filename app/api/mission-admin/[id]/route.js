import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
    getMissionItemById,
    updateMissionItem,
    deleteMissionItem
} from "../../../../lib/mission";

// Set the upload directory to your specified path
const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/mission');

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getMissionItemById(id);
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
        // Fetch the existing mission item
        const existingItem = await getMissionItemById(id);
        let updatedImage1Path = existingItem.image1;
        let updatedImage2Path = existingItem.image2;
        let updatedImage3Path = existingItem.image3;
        let updatedImage4Path = existingItem.image4;
        let updatedImage5Path = existingItem.image5;
        let updatedSmallImage1Path = existingItem.smallImage1;
        let updatedSmallImage2Path = existingItem.smallImage2;
        let updatedSmallImage3Path = existingItem.smallImage3;
        let updatedSmallImage4Path = existingItem.smallImage4;

        // Generate a timestamp to add to filenames
        const timestamp = Date.now();

        // Check if new images are uploaded
        const imageFiles = [
            { field: 'image1', path: updatedImage1Path },
            { field: 'image2', path: updatedImage2Path },
            { field: 'image3', path: updatedImage3Path },
            { field: 'image4', path: updatedImage4Path },
            { field: 'image5', path: updatedImage5Path }
        ];

        const smallImageFiles = [
            { field: 'smallImage1', path: updatedSmallImage1Path },
            { field: 'smallImage2', path: updatedSmallImage2Path },
            { field: 'smallImage3', path: updatedSmallImage3Path },
            { field: 'smallImage4', path: updatedSmallImage4Path }
        ];

        // Function to handle image upload and path update
        const handleImageUpload = async (fieldName, existingPath) => {
            const file = formData.get(fieldName);
            if (file && file instanceof File) {
                const extension = path.extname(file.name);
                const fileName = `${path.basename(file.name, extension)}_${timestamp}${extension}`;
                const filePath = path.join(UPLOAD_DIR, fileName);
                const buffer = Buffer.from(await file.arrayBuffer());

                // Save the new image
                fs.writeFileSync(filePath, buffer);
                return `/uploads/mission/${fileName}`;
            }
            return existingPath;
        };

        // Process the main images
        for (const { field, path: existingPath } of imageFiles) {
            const newPath = await handleImageUpload(field, existingPath);
            if (newPath !== existingPath) {
                // Delete the old image if it exists
                const oldImagePath = path.join(UPLOAD_DIR, path.basename(existingPath));
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        // Process the small images
        for (const { field, path: existingPath } of smallImageFiles) {
            const newPath = await handleImageUpload(field, existingPath);
            if (newPath !== existingPath) {
                // Delete the old small image if it exists
                const oldImagePath = path.join(UPLOAD_DIR, path.basename(existingPath));
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        // Update the mission item
        await updateMissionItem(id, {
            ...body,
            image1: updatedImage1Path,
            image2: updatedImage2Path,
            image3: updatedImage3Path,
            image4: updatedImage4Path,
            image5: updatedImage5Path,
            smallImage1: updatedSmallImage1Path,
            smallImage2: updatedSmallImage2Path,
            smallImage3: updatedSmallImage3Path,
            smallImage4: updatedSmallImage4Path,
            imageTitle1: body.imageTitle1,
            imageTitle2: body.imageTitle2,
            imageTitle3: body.imageTitle3,
            imageTitle4: body.imageTitle4,
            imageTitle5: body.imageTitle5,
            pioneerTitle: body.pioneerTitle,
            pioneerSubtitle: body.pioneerSubtitle,
        });

        return NextResponse.json({ success: true, message: 'Mission item updated successfully!' });
    } catch (error) {
        console.error('Error updating mission item:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        // Fetch the mission item to get the image paths
        const item = await getMissionItemById(id);

        // Delete the item from the database
        await deleteMissionItem(id);

        // Remove the images if they exist
        const imagePaths = [
            item.image1, item.image2, item.image3, item.image4, item.image5,
            item.smallImage1, item.smallImage2, item.smallImage3, item.smallImage4
        ];

        for (const imagePath of imagePaths) {
            const filePath = path.join(UPLOAD_DIR, path.basename(imagePath));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        return NextResponse.json({ success: true, message: 'Mission item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};
