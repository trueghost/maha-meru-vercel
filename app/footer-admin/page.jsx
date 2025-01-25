"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Protect } from '../components/protect';
import toast, { Toaster } from 'react-hot-toast';
import SidebarAdmin from '../common-components/sidebarAdmin';
import NavbarAdmin from '../common-components/navbarAdmin';
import { useRouter } from 'next/navigation';

export default function FooterAdmin() {
    const router = useRouter();
    const [footerItems, setFooterItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    useEffect(() => {
        const fetchFooterItems = async () => {
            try {
                const response = await fetch('/api/footer-admin');
                if (!response.ok) {
                    throw new Error('Failed to fetch footer items');
                }
                const data = await response.json();
                // console.log(data.data);
                setFooterItems(data.data); // Adjusted based on API response
            } catch (error) {
                console.error('Error fetching footer items:', error);
                toast.error('Failed to load footer items');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFooterItems();
    }, []);

    async function deleteFooterItem(id) {
        try {
            const response = await fetch(`/api/footer-admin/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete footer item');
            }
            setFooterItems(items => items.filter(item => item.id !== id));
            toast.success('Footer item deleted successfully');
        } catch (error) {
            console.error('Error deleting footer item:', error);
            toast.error('Failed to delete footer item');
        }
    }

    const handleFooterItemClick = (itemId) => {
        router.push(`/footer-admin/edit/${itemId}`);
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
                        <h1 className="text-3xl font-bold mb-4 text-black">Footer Admin</h1>
                        <Link href="/footer-admin/add">
                            <button className="btn btn-sm btn-success mb-2 inline-block bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">
                                Add Footer Item
                            </button>
                        </Link>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="py-2 px-4 text-left">Image</th>
                                        <th className="py-2 px-4 text-left">Image Title</th>
                                        <th className="py-2 px-4 text-left">Explore Title</th>
                                        <th className="py-2 px-4 text-left">Contact Title</th>
                                        <th className="py-2 px-4 text-left">Location</th>
                                        <th className="py-2 px-4 text-left">Number</th>
                                        <th className="py-2 px-4 text-left">Mail</th>
                                        <th className="py-2 px-4 text-left">Facebook Link</th>
                                        <th className="py-2 px-4 text-left">WhatsApp Link</th>
                                        <th className="py-2 px-4 text-left">Twitter Link</th>
                                        <th className="py-2 px-4 text-left">Instagram Link</th>
                                        <th className="py-2 px-4 text-left"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="12" className="py-4 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="w-8 h-8 border-4 border-t-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        footerItems.map(item => (
                                            <tr key={item.id} className="border-t text-black">
                                                <td className="py-2 px-4">
                                                    <img src={`${item.image}`} alt={`Footer ${item.id}`} className="w-16 h-16 object-cover" />
                                                </td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.image_title}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.explore_title}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.contact_title}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.location}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.number}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.mail}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.facebook_link}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.whatsapp_link}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.twitter_link}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.insta_link}</td>
                                                <td className="py-2 px-4">
                                                    <button className="btn btn-sm btn-primary me-1 inline-block bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2" onClick={() => handleFooterItemClick(item.id)}>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteFooterItem(item.id)}
                                                        className="btn btn-sm btn-danger inline-block bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {!footerItems.length && !isLoading && (
                                        <tr>
                                            <td colSpan="12" className="py-4 text-center text-black">
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
