const { addPosts, getPosts } = require("../../lib/data");

const { NextResponse } = require("next/server");

export const GET = async (req, res) => {
    try {
        const posts = getPosts();
        return NextResponse.json({ message: 'OK', posts }, {
            status: 200
        });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err }, {
            status: 500
        });
    }
};

export const POST = async (req, res) => {
    const { title, desc } = await req.json();

    try {
        const post = { title, desc, date: new Date(), id: Date.now().toString() };
        addPosts(post);
        return NextResponse.json({ message: 'OK', post }, {
            status: 201
        });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err }, {
            status: 500
        });
    }
};