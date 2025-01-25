const { NextResponse } = require("next/server");

export const GET = async (req) => {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get("text");
    const targetLanguage = searchParams.get("targetLanguage");

    try {
        const response = await fetch(`https://ftapi.pythonanywhere.com/translate?sl=en&dl=${targetLanguage}&text=${encodeURIComponent(text)}`);

        if (!response.ok) {
            throw new Error('Failed to fetch translation from external API');
        }

        const data = await response.json();

        return NextResponse.json({ message: 'OK', translatedText: data['destination-text'] }, {
            status: 200
        });
    } catch (err) {
        // console.error("Error during GET request translation:", err.message);
        return NextResponse.json({ message: 'Error', error: err.message }, {
            status: 500
        });
    }
};

export const POST = async (req) => {
    const { text, targetLanguage } = await req.json();
    try {
        const response = await fetch(`https://ftapi.pythonanywhere.com/translate?sl=en&dl=${targetLanguage}&text=${encodeURIComponent(text)}`);

        if (!response.ok) {
            throw new Error('Failed to fetch translation from external API');
        }

        const data = await response.json();

        return NextResponse.json({ message: 'OK', translatedText: data['destination-text'] }, {
            status: 200
        });
    } catch (err) {
        // console.error("Error during POST request translation:", err.message);
        return NextResponse.json({ message: 'Error', error: err.message }, {
            status: 500
        });
    }
};
