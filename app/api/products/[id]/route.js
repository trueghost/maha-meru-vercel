import { updateProduct, deleteProduct, getProductById } from "../../../../lib/products";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Define the upload directory for product images
const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/products');

// GET a product by ID
export const GET = async (req, { params }) => {
    const { id } = params; // Use the id from the URL

    try {
        const product = await getProductById(id);
        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching product', error: error.message }, { status: 500 });
    }
};

    // Function to generate a unique image name with timestamp
    const generateTimestampedFileName = (originalName) => {
        const ext = path.extname(originalName);
        const nameWithoutExt = path.basename(originalName, ext);
        const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        return `${nameWithoutExt}-${timestamp}${ext}`;
    };    

// PUT (update) a product
export const PUT = async (req, { params }) => {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    // Fetch the existing product to get its current data
    const existingProduct = await getProductById(id);
    if (!existingProduct) {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const body = await req.formData(); // Get FormData for the updated data
    let updatedData = {};

    // Extract fields to update
    updatedData.name = body.get('name');
    updatedData.price = body.get('price').toString();
    updatedData.description = body.get('description');
    updatedData.quantity = body.get('quantity');

    // Validate and extract other fields
    const packages = body.getAll('packageOptions');
    const benefits = body.getAll('benefits');
    const usage = body.getAll('usage');
    const storage = body.getAll('storage');
    const whyChoose = body.getAll('whyChoose');
    const applicationTitleSection = body.getAll('applicationTitleSection');

    updatedData.packageOptions = packages.length > 0 ? packages : [];
    updatedData.benefits = benefits.length > 0 ? benefits : [];
    updatedData.usage = usage.length > 0 ? usage : [];
    updatedData.storage = storage.length > 0 ? storage : [];
    updatedData.whyChoose = whyChoose.length > 0 ? whyChoose.map(item => JSON.parse(item)) : [];
    updatedData.applicationTitleSection = applicationTitleSection.length > 0 ? applicationTitleSection.map(item => JSON.parse(item)) : [];

    // Extract and process applications
    const applications = [];
    let appIndex = 0;
    while (body.has(`application[${appIndex}][title]`)) {
        const title = body.get(`application[${appIndex}][title]`);
        const description = body.get(`application[${appIndex}][description]`);
        const link = body.get(`application[${appIndex}][link]`);
        const image = body.get(`application[${appIndex}][image]`);

        // Use `let` for imagePath to allow reassignment
        let imagePath = null;
        if (image instanceof File) {
            const timestampedName = generateTimestampedFileName(image.name);
            const buffer = Buffer.from(await image.arrayBuffer());
            imagePath = path.join(UPLOAD_DIR, timestampedName);
            fs.writeFileSync(imagePath, buffer);
            imagePath = `/uploads/products/${timestampedName}`;
        } else {
            imagePath = image; // If it's a URL, use it as it is
        }

        applications.push({
            title,
            description,
            link,
            image: imagePath || image, // Store the correct image path
        });

        appIndex++;
    }

    updatedData.application = applications;

    // Handle image and certifiedImage processing
    const processImages = async (imageFiles, existingImages) => {
        // Filter out empty or invalid entries (e.g., '{}')
        const validImages = imageFiles.filter(image => image !== '{}' && image !== undefined && image !== null);
        
        // Handle file uploads for valid images
        const imagePaths = await Promise.all(
            validImages.map(async (image, index) => {
                if (image instanceof File) {
                    const timestampedName = generateTimestampedFileName(image.name);
                    const buffer = Buffer.from(await image.arrayBuffer());
                    const pathToSave = path.join(UPLOAD_DIR, timestampedName);
                    fs.writeFileSync(pathToSave, buffer);
                    return `/uploads/products/${timestampedName}`;
                } else {
                    return image; // If the image is a string URL, use it
                }
            })
        );

        // Return the filtered and processed image paths
        return imagePaths;
    };

    // Process `images`
    const existingImages = Array.isArray(existingProduct.images)
        ? existingProduct.images
        : existingProduct.images
        ? existingProduct.images.split(',').map(image => image.trim())
        : [];

    const imageFiles = body.getAll('images');
    updatedData.images = await processImages(imageFiles, existingImages);

    // Process `certifiedImages`
    const existingCertifiedImages = Array.isArray(existingProduct.certifiedImages)
        ? existingProduct.certifiedImages
        : existingProduct.certifiedImages
        ? existingProduct.certifiedImages.split(',').map(image => image.trim())
        : [];

    const certifiedImageFiles = body.getAll('certifiedImages');
    updatedData.certifiedImages = await processImages(certifiedImageFiles, existingCertifiedImages);

    // Handle other fields
    updatedData.packageOptions = packages.length > 0 ? packages : [];
    updatedData.benefits = benefits.length > 0 ? benefits : [];
    updatedData.usage = usage.length > 0 ? usage : [];
    updatedData.storage = storage.length > 0 ? storage : [];

    // console.log(updatedData)

    try {
        // Update product in the database
        const updatedProduct = await updateProduct(id, updatedData);
        return NextResponse.json({ message: 'Product updated successfully', product: updatedProduct }, { status: 200 });
    } catch (err) {
        console.error("Error updating product:", err);
        return NextResponse.json({ message: 'Error updating product', err: err.message }, { status: 500 });
    }
};

// DELETE a product
export const DELETE = async (req, { params }) => {
    const { id } = params; // Use the id from the URL

    try {
        if (!id) {
            return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
        }

        await deleteProduct(id);
        return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error deleting product', err: err.message }, { status: 500 });
    }
};
