"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Protect } from '../components/protect';
import toast, { Toaster } from 'react-hot-toast';
import SidebarAdmin from '../common-components/sidebarAdmin';
import NavbarAdmin from '../common-components/navbarAdmin';
import { useRouter } from 'next/navigation';

export default function ConnectSecondHomeAdmin() {
    const router = useRouter();
    const [connectSecondItems, setConnectSecondItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    useEffect(() => {
        const fetchConnectSecondItems = async () => {
            try {
                const response = await fetch('/api/connect-second'); // Updated endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch connect second items');
                }
                const data = await response.json();
                // console.log(data.data);
                setConnectSecondItems(data.data); // Adjusted based on API response
            } catch (error) {
                console.error('Error fetching connect second items:', error);
                toast.error('Failed to load connect second items');
            } finally {
                setIsLoading(false);
            }
        };

        fetchConnectSecondItems();
    }, []);

    async function deleteConnectSecondItem(id) {
        try {
            const response = await fetch(`/api/connect-second/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete connect second item');
            }
            setConnectSecondItems(items => items.filter(item => item.id !== id));
            toast.success('Connect second item deleted successfully');
        } catch (error) {
            console.error('Error deleting connect second item:', error);
            toast.error('Failed to delete connect second item');
        }
    }

    const handleConnectSecondItemClick = (itemId) => {
        router.push(`/connect-second/edit/${itemId}`); // Updated path
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
                        <h1 className="text-3xl font-bold mb-4 text-black">Connect Second</h1> {/* Updated heading */}
                        <Link href="/connect-second/add"> {/* Updated path */}
                            <button className="btn btn-sm btn-success mb-2 inline-block bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">
                                Add Connect Second Item {/* Updated button text */}
                            </button>
                        </Link>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="py-2 px-4 text-left">Image</th>
                                        <th className="py-2 px-4 text-left">Title</th> {/* New title column */}
                                        <th className="py-2 px-4 text-left">Description</th>
                                        <th className="py-2 px-4 text-left"></th>
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
                                        connectSecondItems.map(item => (
                                            <tr key={item.id} className="border-t text-black">
                                                <td className="py-2 px-4">
                                                    <img src={`${item.image}`} alt={`Connect Second ${item.id}`} className="w-16 h-16 object-cover" />
                                                </td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.title}</td> {/* Added title display */}
                                                <td className="py-2 px-4 truncate max-w-xs">{item.description}</td>
                                                <td className="py-2 px-4">
                                                    <button className="btn btn-sm btn-primary me-1 inline-block bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2" onClick={() => handleConnectSecondItemClick(item.id)}>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteConnectSecondItem(item.id)}
                                                        className="btn btn-sm btn-danger inline-block bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {!connectSecondItems.length && !isLoading && (
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
