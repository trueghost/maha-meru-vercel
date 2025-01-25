"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Protect } from '../components/protect';
import toast, { Toaster } from 'react-hot-toast';
import SidebarAdmin from '../common-components/sidebarAdmin';
import NavbarAdmin from '../common-components/navbarAdmin';
import { useRouter } from 'next/navigation';

export default function AboutTrustHomeAdmin() {
    const router = useRouter();
    const [aboutTrustItems, setAboutTrustItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    useEffect(() => {
        const fetchAboutTrustItems = async () => {
            try {
                const response = await fetch('/api/about-trust');
                if (!response.ok) {
                    throw new Error('Failed to fetch about trust items');
                }
                const data = await response.json();
                // console.log(data.data);
                setAboutTrustItems(data.data); // Adjusted based on API response
            } catch (error) {
                console.error('Error fetching about trust items:', error);
                toast.error('Failed to load about trust items');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAboutTrustItems();
    }, []);

    async function deleteAboutTrustItem(id) {
        try {
            const response = await fetch(`/api/about-trust/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete about trust item');
            }
            setAboutTrustItems(items => items.filter(item => item.id !== id));
            toast.success('About trust item deleted successfully');
        } catch (error) {
            console.error('Error deleting about trust item:', error);
            toast.error('Failed to delete about trust item');
        }
    }

    const handleAboutTrustItemClick = (itemId) => {
        router.push(`/about-trust/edit/${itemId}`);
    };

    async function toggleHideStatus(id, currentHideStatus) {
        try {
            const response = await fetch(`/api/about-trust/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ hide: !currentHideStatus }), // Toggle hide status
            });

            if (!response.ok) {
                throw new Error('Failed to update hide status');
            }

            setAboutTrustItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id ? { ...item, hide: !currentHideStatus } : item
                )
            );
            toast.success(`About Trust item ${!currentHideStatus ? 'hidden' : 'visible'} successfully!`);
        } catch (error) {
            console.error('Error updating hide status:', error);
            toast.error('Failed to update hide status');
        }
    }

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
                        <h1 className="text-3xl font-bold mb-4 text-black">About Trust</h1>
                        <Link href="/about-trust/add">
                            <button className="btn btn-sm btn-success mb-2 inline-block bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">
                                Add About Trust Item
                            </button>
                        </Link>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="py-2 px-4 text-left">Image</th>
                                        <th className="py-2 px-4 text-left">Name</th>
                                        <th className="py-2 px-4 text-left"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="3" className="py-4 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="w-8 h-8 border-4 border-t-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        aboutTrustItems.map(item => (
                                            <tr key={item.id} className="border-t text-black">
                                                <td className="py-2 px-4">
                                                    <img src={`${item.image}`} alt={`About Trust ${item.id}`} className="w-16 h-16 object-cover" />
                                                </td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.description}</td>
                                                <td className="py-2 px-4">
                                                    <button
                                                        onClick={() => toggleHideStatus(item.id, item.hide)}
                                                        className={`btn btn-sm inline-block py-1 px-2 rounded ${
                                                            item.hide ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
                                                        } text-white`}
                                                    >
                                                        {item.hide ? 'Unhide' : 'Hide'}
                                                    </button>
                                                    <button className="btn btn-sm btn-primary me-1 ml-4 inline-block bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2" onClick={() => handleAboutTrustItemClick(item.id)}>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteAboutTrustItem(item.id)}
                                                        className="btn btn-sm btn-danger inline-block bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 ml-2"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {!aboutTrustItems.length && !isLoading && (
                                        <tr>
                                            <td colSpan="3" className="py-4 text-center text-black">
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