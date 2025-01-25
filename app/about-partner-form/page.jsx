"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Protect } from '../components/protect';
import toast, { Toaster } from 'react-hot-toast';
import SidebarAdmin from '../common-components/sidebarAdmin';
import NavbarAdmin from '../common-components/navbarAdmin';
import { useRouter } from 'next/navigation';

export default function AboutPartnerFormAdmin() {
    const router = useRouter();
    const [aboutPartnerFormItems, setAboutPartnerFormItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchAboutPartnerFormItems = async () => {
            try {
                const response = await fetch('/api/about-partner-form');
                if (!response.ok) {
                    throw new Error('Failed to fetch items');
                }
                const data = await response.json();
                setAboutPartnerFormItems(data.data); // Adjusted based on API response
            } catch (error) {
                console.error('Error fetching items:', error);
                toast.error('Failed to load items');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAboutPartnerFormItems();
    }, []);

    async function deleteAboutPartnerFormItem(id) {
        try {
            const response = await fetch(`/api/about-partner-form/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete item');
            }
            setAboutPartnerFormItems(items => items.filter(item => item.id !== id));
            toast.success('Item deleted successfully');
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error('Failed to delete item');
        }
    }

    const handleEditItemClick = (itemId) => {
        router.push(`/about-partner-form/edit/${itemId}`);
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
                        <h1 className="text-3xl font-bold mb-4 text-black">Connect Partner Form</h1>
                        <Link href="/about-partner-form/add">
                            <button className="btn btn-sm btn-success mb-2 inline-block bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">
                                Add New Item
                            </button>
                        </Link>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="py-2 px-4 text-left">File</th>
                                        <th className="py-2 px-4 text-left"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="2" className="py-4 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="w-8 h-8 border-4 border-t-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        aboutPartnerFormItems.map(item => (
                                            <tr key={item.id} className="border-t text-black">
                                                <td className="py-2 px-4">
                                                    <img src={`${item.file}`} alt={`Item ${item.id}`} className="w-16 h-16 object-cover" />
                                                </td>
                                                <td className="py-2 px-4">
                                                    <button
                                                        className="btn btn-sm btn-primary inline-block bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2"
                                                        onClick={() => handleEditItemClick(item.id)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteAboutPartnerFormItem(item.id)}
                                                        className="btn btn-sm btn-danger inline-block bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {!aboutPartnerFormItems.length && !isLoading && (
                                        <tr>
                                            <td colSpan="2" className="py-4 text-center text-black">
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
