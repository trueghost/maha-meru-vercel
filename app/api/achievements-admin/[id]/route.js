import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
    getAchievementById,
    updateAchievement,
    deleteAchievement
} from "../../../../lib/achievementsHome";

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/achievements');

// Handle GET request to fetch a specific achievement
export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getAchievementById(id);
        return NextResponse.json({ success: true, data: item });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};

// Handle PUT request to update an achievement
export const PUT = async (req, { params }) => {
    const { id } = params;
    const formData = await req.formData();

    try {
        const existingItem = await getAchievementById(id);
        let updatedImageUrl = existingItem.image;

        const file = formData.get('image');
        if (file && file instanceof File) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const timestamp = Date.now();
            const extension = path.extname(file.name);
            const uniqueImageName = `${path.basename(file.name, extension)}_${timestamp}${extension}`;
            const imagePath = path.join(UPLOAD_DIR, uniqueImageName);

            // Save the new image with the timestamped filename
            fs.writeFileSync(imagePath, buffer);
            updatedImageUrl = `/uploads/achievements/${uniqueImageName}`;

            // Optionally delete the old image
            const oldImagePath = path.join(UPLOAD_DIR, existingItem.image.split('/').pop());
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        } else {
            // console.log('No new image uploaded, using existing image.');
        }

        await updateAchievement(id, {
            image: updatedImageUrl,
        });

        return NextResponse.json({ success: true, message: 'Achievement updated successfully!' });
    } catch (error) {
        console.error('Error updating achievement:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

// Handle DELETE request to delete an achievement
export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        const item = await getAchievementById(id);
        await deleteAchievement(id);

        const imagePath = path.join(UPLOAD_DIR, item.image.split('/').pop());
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        return NextResponse.json({ success: true, message: 'Achievement deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};

// Handle PATCH request to toggle hide status
export const PATCH = async (req, { params }) => {
    const { id } = params;
    const { hide } = await req.json(); // Extract 'hide' value from the request body

    try {
        // Retrieve the existing item
        const existingItem = await getAchievementById(id);

        if (!existingItem) {
            return NextResponse.json({ success: false, message: `Achievement with ID ${id} not found` });
        }

        // Determine the updated hide value based on the request body
        const updatedHide = hide; // Use the value directly from the request

        // Prepare the update data
        const updateData = {
            hide: updatedHide,
            image: existingItem.image, // Preserve the current image value
        };

        // Update the achievement
        await updateAchievement(id, updateData);

        // console.log(`Successfully updated achievement ID: ${id}, hide status: ${updatedHide}`);
        return NextResponse.json({
            success: true,
            message: `Achievement is now ${updatedHide === 1 ? 'hidden' : 'visible'}`
        });
    } catch (error) {
        // console.error(`Error updating hide status for achievement ID: ${id}`, error);
        return NextResponse.json({ success: false, message: error.message });
    }
};
