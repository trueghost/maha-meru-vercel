import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
    getConnectSocialItemById,
    updateConnectSocialItem,
    deleteConnectSocialItem
} from "../../../../lib/socials";

// Set the upload directory to your specified path
const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/socials');

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getConnectSocialItemById(id);
        if (!item) {
            return NextResponse.json({ success: false, message: 'Connect social item not found' }, { status: 404 });
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
        const existingItem = await getConnectSocialItemById(id);
        if (!existingItem) {
            return NextResponse.json({ success: false, message: 'Connect social item not found' }, { status: 404 });
        }

        let updatedImageUrl = existingItem.image_url;

        const file = formData.get('image');
        if (file && file instanceof File) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const timestamp = Date.now();
            const ext = path.extname(file.name);
            const baseName = path.basename(file.name, ext);
            const timestampedName = `${baseName}_${timestamp}${ext}`;
            const imagePath = path.join(UPLOAD_DIR, timestampedName);

            fs.writeFileSync(imagePath, buffer);
            updatedImageUrl = `/uploads/socials/${timestampedName}`;

            const oldImagePath = path.join(UPLOAD_DIR, existingItem.image_url.split('/').pop());
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        await updateConnectSocialItem(id, {
            ...body,
            image_url: updatedImageUrl,
            date: body.date
        });

        return NextResponse.json({ success: true, message: 'Connect social item updated successfully!' });
    } catch (error) {
        console.error('Error updating connect social item:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        const item = await getConnectSocialItemById(id);
        if (!item) {
            return NextResponse.json({ success: false, message: 'Connect social item not found' }, { status: 404 });
        }

        await deleteConnectSocialItem(id);

        const imagePath = path.join(UPLOAD_DIR, item.image_url.split('/').pop());
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        return NextResponse.json({ success: true, message: 'Connect social item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const PATCH = async (req, { params }) => {
    const { id } = params;
    const { hide } = await req.json();

    try {
        if (!id) {
            return NextResponse.json({ success: false, message: 'Connect social item ID is required' }, { status: 400 });
        }

        const socialItem = await getConnectSocialItemById(id);
        if (!socialItem) {
            return NextResponse.json({ success: false, message: 'Connect social item not found' }, { status: 404 });
        }

        const updatedItem = await updateConnectSocialItem(id, {
            ...socialItem,
            hide: Boolean(hide),
        });

        return NextResponse.json({
            success: true,
            message: `Connect social item ${hide ? 'hidden' : 'visible'} successfully!`,
            data: updatedItem,
        });
    } catch (error) {
        console.error('Error updating hide status:', error);
        return NextResponse.json({ success: false, message: 'Failed to update hide status', error: error.message });
    }
};
