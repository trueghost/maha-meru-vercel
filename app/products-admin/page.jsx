"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Protect } from '../components/protect';
import toast, { Toaster } from 'react-hot-toast';
import SidebarAdmin from '../common-components/sidebarAdmin';
import NavbarAdmin from '../common-components/navbarAdmin';
import { useRouter } from 'next/navigation';

export default function ProductsAdmin() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
    
                // Process each product
                const products = data.products.map((product) => {
                    // Process `images` if it's not already an array
                    let images = [];
                    if (product.images) {
                        if (typeof product.images === 'string') {
                            // If it's a string, split it by commas and trim any extra spaces
                            images = product.images.split(',').map(item => item.trim());
                        } else if (Array.isArray(product.images)) {
                            // If it's already an array, process each item inside the array
                            images = product.images.flatMap(image => 
                                typeof image === 'string' ? image.split(',').map(item => item.trim()) : [image]
                            );
                        }
                    }
    
                    // Process `certifiedImages` if it's not already an array
                    let certifiedImages = [];
                    if (product.certifiedImages) {
                        if (typeof product.certifiedImages === 'string') {
                            // If it's a string, split it by commas and trim any extra spaces
                            certifiedImages = product.certifiedImages.split(',').map(item => item.trim());
                        } else if (Array.isArray(product.certifiedImages)) {
                            // If it's already an array, process each item inside the array
                            certifiedImages = product.certifiedImages.flatMap(certifiedImage => 
                                typeof certifiedImage === 'string' ? certifiedImage.split(',').map(item => item.trim()) : [certifiedImage]
                            );
                        }
                    }
    
                    // Return the processed product with updated images and certifiedImages
                    return {
                        ...product,
                        images,
                        certifiedImages,
                    };
                });

                setProducts(products);
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Failed to load products');
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchProducts();
    }, []);      

    async function deleteProduct(id) {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            setProducts(products => products.filter(product => product.id !== id));
            toast.success('Product deleted successfully');
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        }
    }

    const handleProductClick = (productId) => {
        router.push(`/products-admin/edit/${productId}`);
    };

    return (
        <Protect>
            <div className="min-h-screen flex flex-col bg-gray-100">
                <NavbarAdmin
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
                <div className="flex flex-1">
                    {isSidebarOpen && <SidebarAdmin />}
                    <div className="flex-grow p-6">
                        <h1 className="text-3xl font-bold mb-4 text-black">Products</h1>
                        <Link href="/products-admin/add">
                            <button className="btn btn-sm btn-success mb-2 inline-block bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">
                                Add Product
                            </button>
                        </Link>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="py-2 px-4 text-left">Name</th>
                                        <th className="py-2 px-4 text-left">Images</th>
                                        <th className="py-2 px-4 text-left">Price</th>
                                        <th className="py-2 px-4 text-left">Quantity</th>
                                        <th className="py-2 px-4 text-left">Package Options</th>
                                        <th className="py-2 px-4 text-left">Benefits</th>
                                        <th className="py-2 px-4 text-left">Usage</th>
                                        <th className="py-2 px-4 text-left">Storage</th>
                                        <th className="py-2 px-4 text-left">Why Choose</th>
                                        <th className="py-2 px-4 text-left">Application</th>
                                        <th className="py-2 px-4 text-left">Certified Images</th>
                                        <th className="py-2 px-4 text-left">Description</th>
                                        <th className="py-2 px-4 text-left">Application Title Section</th>
                                        <th className="py-2 px-4 text-left"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="14" className="py-4 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="w-8 h-8 border-4 border-t-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map(product => (
                                            <tr key={product.id} className="border-t text-black">
                                                <td className="py-2 px-4">{product.name}</td>
                                                <td className="py-2 px-4">
                                                    {product.images && product.images.map((img, index) => (
                                                        <img key={index} src={img} alt={`Product ${index}`} className="w-16 h-16 object-cover mb-1" />
                                                    ))}
                                                </td>
                                                <td className="py-2 px-4">{product.price}</td>
                                                <td className="py-2 px-4">{product.quantity}</td>
                                                <td className="py-2 px-4">
                                                    <strong>Package Options:</strong> {product.packageOptions && product.packageOptions.join(', ')}
                                                </td>
                                                <td className="py-2 px-4">
                                                    <strong>Benefits:</strong> {product.benefits && product.benefits.join(', ')}
                                                </td>
                                                <td className="py-2 px-4">
                                                    <strong>Usage:</strong> {product.usage && product.usage.join(', ')}
                                                </td>
                                                <td className="py-2 px-4">
                                                    <strong>Storage:</strong> {product.storage && product.storage.join(', ')}
                                                </td>
                                                <td className="py-2 px-4">
                                                    {product.whyChoose && product.whyChoose.map((item, index) => (
                                                        <div key={index}>
                                                            <strong>Title:</strong> {item.title} <br />
                                                            <strong>Description:</strong> {item.description}
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="py-2 px-4">
                                                    {product.application && product.application.map((app, index) => (
                                                        <div key={index}>
                                                            <strong>Title:</strong> {app.title} <br />
                                                            <strong>Description:</strong> {app.description} <br />
                                                            <img src={app.image} alt={`App ${index}`} className="w-16 h-16 object-cover mb-1" />
                                                            <br />
                                                            <strong>Link:</strong> <a href={app.link} target="_blank" rel="noopener noreferrer">{app.link}</a>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="py-2 px-4">
                                                    {product.certifiedImages && product.certifiedImages.map((img, index) => (
                                                        <img key={index} src={img} alt={`Certified ${index}`} className="w-16 h-16 object-cover mb-1" />
                                                    ))}
                                                </td>
                                                <td className="py-2 px-4">
                                                    <strong>Description:</strong> {product.description}
                                                </td>
                                                <td className="py-2 px-4">
                                                    {product.applicationTitleSection && product.applicationTitleSection.map((section, index) => (
                                                        <div key={index}><strong>Generated Text:</strong> {section.generatedText}</div>
                                                    ))}
                                                </td>
                                                <td className="py-2 px-4">
                                                    <button className="btn btn-sm btn-primary me-1 inline-block bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2" onClick={() => handleProductClick(product.id)}>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProduct(product.id)}
                                                        className="btn btn-sm btn-danger inline-block bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {!products.length && !isLoading && (
                                        <tr>
                                            <td colSpan="14" className="py-4 text-center text-black">
                                                <div className="p-2">No Products To Display</div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </Protect>
    );
}
