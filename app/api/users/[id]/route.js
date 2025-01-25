import { getUserById, updateUser } from "../../../../lib/index";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        // Extract the user ID from the request URL
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        // console.log(id);

        if (!id) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const user = await getUserById(id);
        return NextResponse.json({ message: 'OK', user }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err: err.message }, { status: 500 });
    }
}

export const PUT = async (req, res) => {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        // console.log(id)

        if (!id) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        // Retrieve user data from the request body
        const formData = await req.json();

        // console.log(formData)
        
        // Update user data
        await updateUser(id, formData);

        return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err: err.message }, { status: 500 });
    }
};
