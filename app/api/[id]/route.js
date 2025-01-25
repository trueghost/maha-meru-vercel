const { deletePosts, getById, updatePosts } = require("../../../lib/data");
const { NextResponse } = require("next/server");

export const GET = async (req) => {
    try {
        const id = req.url.split("api/")[1];
        const post = getById(id);
        if (!post) {
            return NextResponse.json({ message: 'ERROR' }, {
                status: 404
            });
        }
        return NextResponse.json({ message: 'OK', post }, {
            status: 200
        });
    } catch (err) {
        return NextResponse.json({ message: 'ERROR', err }, {
            status: 500
        });
    }
};

export const PUT = async (req) => {
    try {
        const { title, desc } = await req.json();
        const id = req.url.split("api/")[1];
        updatePosts(id, title, desc);
        return NextResponse.json({ message: "OK" }, {
            status: 200
        });
    } catch (err) {
        return NextResponse.json({ message: 'ERROR', err }, {
            status: 500
        });
    }
};

export const DELETE = async (req) => {
    try {
        const id = req.url.split("api/")[1];
        deletePosts(id);
        return NextResponse.json({ message: "OK" }, {
            status: 200
        });
    } catch (err) {
        return NextResponse.json({ message: 'ERROR', err }, {
            status: 500
        });
    }
};