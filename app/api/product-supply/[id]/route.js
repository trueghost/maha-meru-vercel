import { NextResponse } from 'next/server';
import {
    getProductSupplyItemById,
    updateProductSupplyItem,
    deleteProductSupplyItem
} from "../../../../lib/productSupply";

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const item = await getProductSupplyItemById(id); // Updated function name
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
        // Update the product supply item
        await updateProductSupplyItem(id, {
            ...body,
        });

        return NextResponse.json({ success: true, message: 'Product supply item updated successfully!' });
    } catch (error) {
        console.error('Error updating product supply item:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
};

export const DELETE = async (req, { params }) => {
    const { id } = params;

    try {
        // Fetch the product supply item
        const item = await getProductSupplyItemById(id); // Updated function name

        // Delete the item from the database
        await deleteProductSupplyItem(id);

        return NextResponse.json({ success: true, message: 'Product supply item deleted successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
};
