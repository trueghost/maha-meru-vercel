"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Protect } from '../components/protect';
import toast, { Toaster } from 'react-hot-toast';
import SidebarAdmin from '../common-components/sidebarAdmin';
import NavbarAdmin from '../common-components/navbarAdmin';
import { useRouter } from 'next/navigation';

export default function AboutMarketHomeAdmin() {
    const router = useRouter();
    const [aboutMarketItems, setAboutMarketItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchAboutMarketItems = async () => {
            try {
                const response = await fetch('/api/about-market');
                if (!response.ok) {
                    throw new Error('Failed to fetch about market items');
                }
                const data = await response.json();
                // console.log(data.data);
                setAboutMarketItems(data.data);
            } catch (error) {
                console.error('Error fetching about market items:', error);
                toast.error('Failed to load about market items');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAboutMarketItems();
    }, []);

    async function deleteAboutMarketItem(id) {
        try {
            const response = await fetch(`/api/about-market/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete about market item');
            }
            setAboutMarketItems(items => items.filter(item => item.id !== id));
            toast.success('About market item deleted successfully');
        } catch (error) {
            console.error('Error deleting about market item:', error);
            toast.error('Failed to delete about market item');
        }
    }

    const handleAboutMarketItemClick = (itemId) => {
        router.push(`/about-market/edit/${itemId}`);
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
                        <h1 className="text-3xl font-bold mb-4 text-black">About Market</h1>
                        <Link href="/about-market/add">
                            <button className="btn btn-sm btn-success mb-2 inline-block bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">
                                Add About Market Item
                            </button>
                        </Link>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="py-2 px-4 text-left">Image</th>
                                        <th className="py-2 px-4 text-left">Title</th>
                                        <th className="py-2 px-4 text-left">Hover Image</th> {/* Updated column header */}
                                        <th className="py-2 px-4"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="4" className="py-4 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="w-8 h-8 border-4 border-t-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        aboutMarketItems.map(item => (
                                            <tr key={item.id} className="border-t text-black">
                                                <td className="py-2 px-4">
                                                    <img src={`${item.image}`} alt={`About Market ${item.id}`} className="w-16 h-16 object-cover" />
                                                </td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.title}</td>
                                                <td className="py-2 px-4">
                                                    <img src={`${item.hoverImage}`} alt={`Hover for About Market ${item.id}`} className="w-16 h-16 object-cover" />
                                                </td> {/* Updated column to display hoverImage */}
                                                <td className="py-2 px-4">
                                                    <button
                                                        className="btn btn-sm btn-primary me-1 inline-block bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2"
                                                        onClick={() => handleAboutMarketItemClick(item.id)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteAboutMarketItem(item.id)}
                                                        className="btn btn-sm btn-danger inline-block bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {!aboutMarketItems.length && !isLoading && (
                                        <tr>
                                            <td colSpan="4" className="py-4 text-center text-black">
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
