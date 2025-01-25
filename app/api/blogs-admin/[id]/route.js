import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
    getBlogItemById,
    updateBlogItem,
    deleteBlogItem
} from "../../../../lib/blogs";

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/blogs');

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getBlogItemById(id);
        if (!item) {
            return NextResponse.json({ success: false, message: 'Blog item not found' }, { status: 404 });
        }
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
        const existingItem = await getBlogItemById(id);
        if (!existingItem) {
            return NextResponse.json({ success: false, message: 'Blog item not found' }, { status: 404 });
        }

        let updatedImageUrl = existingItem.image_url;

        // Check if a new image is uploaded
        const file = formData.get('image');
        if (file && file instanceof File) {
            const buffer = Buffer.from(await file.arrayBuffer());

            // Generate a unique filename with a timestamp
            const timestamp = Date.now();
            const ext = path.extname(file.name);
            const baseName = path.basename(file.name, ext);
            const timestampedName = `${baseName}_${timestamp}${ext}`;
            const imagePath = path.join(UPLOAD_DIR, timestampedName);

            // Save the new image
            fs.writeFileSync(imagePath, buffer);
            updatedImageUrl = `/uploads/blogs/${timestampedName}`;

            // Optionally delete the old image
            const oldImagePath = path.join(UPLOAD_DIR, existingItem.image_url.split('/').pop());
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        } else {
            // console.log('No new image uploaded, using existing image.');
        }

        // Update the blog item, including the date
        await updateBlogItem(id, {
            ...body,
            image_url: updatedImageUrl,
            date: body.date
        });

        return NextResponse.json({ success: true, message: 'Blog item updated successfully!' });
    } catch (error) {
        console.error('Error updating blog item:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const PATCH = async (req, { params }) => {
    const { id } = params;
    const { hide } = await req.json();

    try {
        if (!id) {
            return NextResponse.json({ success: false, message: 'Blog ID is required' }, { status: 400 });
        }

        // Fetch the current blog item
        const blogItem = await getBlogItemById(id);
        if (!blogItem) {
            return NextResponse.json({ success: false, message: 'Blog item not found' }, { status: 404 });
        }

        // Update the 'hide' field while preserving other values
        const updatedItem = await updateBlogItem(id, {
            ...blogItem, // Preserve existing values
            hide: Boolean(hide), // Update only the 'hide' field
        });

        return NextResponse.json({
            success: true,
            message: `Blog item ${hide ? 'hidden' : 'visible'} successfully!`,
            data: updatedItem,
        });
    } catch (error) {
        console.error('Error updating hide status:', error);
        return NextResponse.json({ success: false, message: 'Failed to update hide status', error: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        const item = await getBlogItemById(id);
        if (!item) {
            return NextResponse.json({ success: false, message: 'Blog item not found' }, { status: 404 });
        }

        await deleteBlogItem(id);

        // Remove the image file if it exists
        const imagePath = path.join(UPLOAD_DIR, item.image_url.split('/').pop());
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        return NextResponse.json({ success: true, message: 'Blog item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};
