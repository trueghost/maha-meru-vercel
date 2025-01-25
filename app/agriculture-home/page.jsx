"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Protect } from '../components/protect';
import toast, { Toaster } from 'react-hot-toast';
import SidebarAdmin from '../common-components/sidebarAdmin';
import NavbarAdmin from '../common-components/navbarAdmin';
import { useRouter } from 'next/navigation';

export default function AgricultureHomeAdmin() {
    const router = useRouter();
    const [agriculturalProducts, setAgriculturalProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    useEffect(() => {
        const fetchAgriculturalProducts = async () => {
            try {
                const response = await fetch('/api/agriculture-home-items');
                if (!response.ok) {
                    throw new Error('Failed to fetch agricultural products');
                }
                const data = await response.json();
                setAgriculturalProducts(data.data);
            } catch (error) {
                console.error('Error fetching agricultural products:', error);
                toast.error('Failed to load agricultural products');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgriculturalProducts();
    }, []);

    async function deleteAgriculturalProduct(id) {
        try {
            const response = await fetch(`/api/agriculture-home-items/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete agricultural product');
            }
            setAgriculturalProducts(products => products.filter(product => product.id !== id));
            toast.success('Agricultural product deleted successfully');
        } catch (error) {
            console.error('Error deleting agricultural product:', error);
            toast.error('Failed to delete agricultural product');
        }
    }

    const handleAgriculturalProductClick = (productId) => {
        router.push(`/agriculture-home/edit/${productId}`);
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
                        <h1 className="text-3xl font-bold mb-4 text-black">Agriculture</h1>
                        <Link href="/agriculture-home/add">
                            <button className="btn btn-sm btn-success mb-2 inline-block bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">
                                Add Agriculture Items
                            </button>
                        </Link>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="py-2 px-4 text-left">Image</th>
                                        <th className="py-2 px-4 text-left">Title</th>
                                        <th className="py-2 px-4 text-left">Category</th>
                                        <th className="py-2 px-4 text-left">Description</th>
                                        <th className="py-2 px-4 text-left">Link</th>
                                        <th className="py-2 px-4 text-left">Mobile Image</th>
                                        <th className="py-2 px-4 text-left"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="7" className="py-4 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="w-8 h-8 border-4 border-t-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        agriculturalProducts.map(product => (
                                            <tr key={product.id} className="border-t text-black">
                                                <td className="py-2 px-4">
                                                    <img src={`${product.image_url}`} alt={product.title} className="w-16 h-16 object-cover" />
                                                </td>
                                                <td className="py-2 px-4">{product.title}</td>
                                                <td className="py-2 px-4">{product.category}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{product.description}</td>
                                                <td className="py-2 px-4">
                                                    <a href={product.link} target="_blank" className="text-blue-500 underline">
                                                        {product.link ? product.link : "No Link"}
                                                    </a>
                                                </td>
                                                <td className="py-2 px-4">{product.is_mobile_image ? 'Yes' : 'No'}</td>
                                                <td className="py-2 px-4">
                                                    <button className="btn btn-sm btn-primary me-1 inline-block bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2" onClick={() => handleAgriculturalProductClick(product.id)}>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteAgriculturalProduct(product.id)}
                                                        className="btn btn-sm btn-danger inline-block bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {!agriculturalProducts.length && !isLoading && (
                                        <tr>
                                            <td colSpan="7" className="py-4 text-center">
                                                No agricultural products found
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