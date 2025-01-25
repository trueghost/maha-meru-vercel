const { getAllUsers, deleteUser} = require("../../../lib/index");
const { NextResponse } = require("next/server");

export const GET = async (req, res) => {
    try {
        const users = await getAllUsers();
        return NextResponse.json({ message: 'OK', users }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err: err.message }, { status: 500 });
    }
};

export const DELETE = async (req, res) => {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        await deleteUser(id);
        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err: err.message }, { status: 500 });
    }
};