"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Protect } from '../components/protect';
import toast, { Toaster } from 'react-hot-toast';
import SidebarAdmin from '../common-components/sidebarAdmin';
import NavbarAdmin from '../common-components/navbarAdmin';
import { useRouter } from 'next/navigation';

export default function TrendingProductsAdmin() {
    const router = useRouter();
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    useEffect(() => {
        const fetchTrendingProducts = async () => {
            try {
                const response = await fetch('/api/trending-products'); // Update the API endpoint as needed
                if (!response.ok) {
                    throw new Error('Failed to fetch trending products');
                }
                const data = await response.json();
                setTrendingProducts(data.data); // Adjusted based on API response
            } catch (error) {
                console.error('Error fetching trending products:', error);
                toast.error('Failed to load trending products');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrendingProducts();
    }, []);

    async function deleteTrendingProduct(id) {
        try {
            const response = await fetch(`/api/trending-products/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete trending product');
            }
            setTrendingProducts(products => products.filter(product => product.id !== id));
            toast.success('Trending product deleted successfully');
        } catch (error) {
            console.error('Error deleting trending product:', error);
            toast.error('Failed to delete trending product');
        }
    }

    const handleTrendingProductClick = (productId) => {
        router.push(`/trending-products/edit/${productId}`);
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
                        <h1 className="text-3xl font-bold mb-4 text-black">Trending Applications</h1>
                        <Link href="/trending-products/add">
                            <button className="btn btn-sm btn-success mb-2 inline-block bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">
                                Add Trending Application
                            </button>
                        </Link>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="py-2 px-4 text-left">Image</th>
                                        <th className="py-2 px-4 text-left">Title</th>
                                        <th className="py-2 px-4 text-left">Subtitle</th>
                                        <th className="py-2 px-4 text-left">Content</th>
                                        <th className="py-2 px-4 text-left">Link</th>
                                        <th className="py-2 px-4 text-left"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="6" className="py-4 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="w-8 h-8 border-4 border-t-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        trendingProducts.map(product => (
                                            <tr key={product.id} className="border-t text-black">
                                                <td className="py-2 px-4">
                                                    <img src={`${product.image}`} alt={product.title} className="w-16 h-16 object-cover" />
                                                </td>
                                                <td className="py-2 px-4">{product.title}</td>
                                                <td className="py-2 px-4">{product.subtitle}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{product.content}</td>
                                                <td className="py-2 px-4">{product.link}</td>
                                                <td className="py-2 px-4">
                                                    <button className="btn btn-sm btn-primary me-1 inline-block bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2" onClick={() => handleTrendingProductClick(product.id)}>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteTrendingProduct(product.id)}
                                                        className="btn btn-sm btn-danger inline-block bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {!trendingProducts.length && !isLoading && (
                                        <tr>
                                            <td colSpan="6" className="py-4 text-center text-black">
                                                <div className="p-2">Nothing To Display</div>
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
