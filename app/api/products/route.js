import { getAllProducts, addProduct } from "../../../lib/products";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Define the upload directory for product images
const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/products');

// GET all products
export const GET = async (req) => {
    try {
        const products = await getAllProducts();
        return NextResponse.json({ message: 'OK', products }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error', err: err.message }, { status: 500 });
    }
};

// POST a new product
export const POST = async (req) => {
    const body = await req.formData(); // Get FormData
    // console.log(body);

    let productData = {};

    // Extract fields from FormData
    productData.name = body.get('name');
    productData.price = body.get('price').toString();
    productData.description = body.get('description');
    productData.quantity = body.get('quantity');
    
    // Validate packages, benefits, usage, and storage
    const packages = body.getAll('packages');
    const benefits = body.getAll('benefits');
    const usage = body.getAll('usage');
    const storage = body.getAll('storage');
    const whyChoose = body.getAll('whyChoose');
    const application = body.getAll('application');
    const applicationTitleSection = body.getAll('applicationTitleSection');

    // Parse JSON data fields
    productData.packageOptions = packages.length > 0 ? packages : [];
    productData.benefits = benefits.length > 0 ? benefits : [];
    productData.usage = usage.length > 0 ? usage : [];
    productData.storage = storage.length > 0 ? storage : [];
    
    productData.whyChoose = whyChoose.length > 0 ? whyChoose.map(item => JSON.parse(item)) : [];
    productData.application = application.length > 0 ? application.map(item => JSON.parse(item)) : [];
    productData.applicationTitleSection = applicationTitleSection.length > 0 ? applicationTitleSection.map(item => JSON.parse(item)) : [];

    // Handle images (certifiedImages, product images, and application images)
    const certifiedImages = body.getAll('certifiedImages');
    const images = body.getAll('images');
    const applicationImages = body.getAll('applicationImage');  // Handling application images

    // Console log the image links
    // console.log("Certified Images: ", certifiedImages.map(image => image.name));
    // console.log("Product Images: ", images.map(image => image.name));
    // console.log("Application Images: ", applicationImages.map(image => image.name));

    // Ensure upload directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // Function to generate a unique image name
    const generateUniqueImageName = (originalName) => {
        const timestamp = new Date().toISOString().replace(/[:.-]/g, ""); // Remove non-alphanumeric characters
        const ext = path.extname(originalName);
        const baseName = path.basename(originalName, ext);
        return `${baseName}_${timestamp}${ext}`; // Append timestamp to the original filename
    };

    // Save certified images (if valid files)
    productData.certifiedImages = await Promise.all(
        certifiedImages.filter(image => image.size > 0).map(async (image) => {
            const imageName = generateUniqueImageName(image.name);
            const imagePath = path.join(UPLOAD_DIR, imageName);
            const buffer = Buffer.from(await image.arrayBuffer());
            fs.writeFileSync(imagePath, buffer);
            return `/uploads/products/${imageName}`; // Save the image path in the productData
        })
    );

    // Save product images (if valid files)
    productData.images = await Promise.all(
        images.filter(image => image.size > 0).map(async (image) => {
            const imageName = generateUniqueImageName(image.name);
            const imagePath = path.join(UPLOAD_DIR, imageName);
            const buffer = Buffer.from(await image.arrayBuffer());
            fs.writeFileSync(imagePath, buffer);
            return `/uploads/products/${imageName}`; // Save the image path in the productData
        })
    );

    // Handle application images (each application may have its own image)
    productData.application = await Promise.all(
        productData.application.map(async (app, index) => {
            if (applicationImages[index] && applicationImages[index].size > 0) {
                const imageName = generateUniqueImageName(applicationImages[index].name);
                const imagePath = path.join(UPLOAD_DIR, imageName);
                const buffer = Buffer.from(await applicationImages[index].arrayBuffer());
                fs.writeFileSync(imagePath, buffer);
                app.image = `/uploads/products/${imageName}`; // Store the image path for this application
            }
            return app;
        })
    );

    try {
        // Validate required fields
        if (!productData.name || !productData.price) {
            return NextResponse.json({ message: 'Product name and price are required' }, { status: 400 });
        }

        // Save the product to the database
        const newProduct = await addProduct(productData);
        return NextResponse.json({ message: 'Product added successfully', product: newProduct }, { status: 201 });
    } catch (err) {
        console.error("Error adding product:", err);
        return NextResponse.json({ message: 'Error', err: err.message }, { status: 500 });
    }
};