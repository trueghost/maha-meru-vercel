import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
    getTrendingProductById,
    updateTrendingProduct,
    deleteTrendingProduct
} from "../../../../lib/trendingProducts";

// Set the upload directory to your specified path
const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/trending-products');

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getTrendingProductById(id); // Updated to use trending products
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
        // Fetch the existing trending product
        const existingItem = await getTrendingProductById(id);
        let updatedImageUrl = existingItem.image; // Default to existing image URL

        // Check if a new image is uploaded
        const file = formData.get('image');
        if (file && file instanceof File) {
            // Generate a unique filename with the current date and time
            const timestamp = Date.now();
            const extname = path.extname(file.name);
            const baseName = path.basename(file.name, extname);
            const uniqueImageName = `${baseName}-${timestamp}${extname}`;

            const buffer = Buffer.from(await file.arrayBuffer());
            const imagePath = path.join(UPLOAD_DIR, uniqueImageName);

            // Save the new image with the unique filename
            fs.writeFileSync(imagePath, buffer);
            updatedImageUrl = `/uploads/trending-products/${uniqueImageName}`; // Update the image URL

            // Optionally delete the old image
            const oldImagePath = path.join(UPLOAD_DIR, existingItem.image.split('/').pop());
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        } else {
            // console.log('No new image uploaded, using existing image.');
        }

        // Update the trending product
        await updateTrendingProduct(id, {
            ...body,
            image: updatedImageUrl, // Use the updated or existing image URL
        });

        return NextResponse.json({ success: true, message: 'Trending product updated successfully!' });
    } catch (error) {
        console.error('Error updating trending product:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        // Fetch the trending product to get the image path
        const item = await getTrendingProductById(id);

        // Delete the product from the database
        await deleteTrendingProduct(id);

        // Remove the image file if it exists
        const imagePath = path.join(UPLOAD_DIR, item.image.split('/').pop());
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        return NextResponse.json({ success: true, message: 'Trending product deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};
