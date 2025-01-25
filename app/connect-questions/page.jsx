"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Protect } from '../components/protect';
import toast, { Toaster } from 'react-hot-toast';
import SidebarAdmin from '../common-components/sidebarAdmin';
import NavbarAdmin from '../common-components/navbarAdmin';
import { useRouter } from 'next/navigation';

export default function ConnectQuestionsHomeAdmin() {
    const router = useRouter();
    const [connectQuestionsItems, setConnectQuestionsItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    useEffect(() => {
        const fetchConnectQuestionsItems = async () => {
            try {
                const response = await fetch('/api/connect-questions');
                if (!response.ok) {
                    throw new Error('Failed to fetch connect questions items');
                }
                const data = await response.json();
                // console.log(data.data);
                setConnectQuestionsItems(data.data); // Adjusted based on API response
            } catch (error) {
                console.error('Error fetching connect questions items:', error);
                toast.error('Failed to load connect questions items');
            } finally {
                setIsLoading(false);
            }
        };

        fetchConnectQuestionsItems();
    }, []);

    async function deleteConnectQuestionsItem(id) {
        try {
            const response = await fetch(`/api/connect-questions/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete connect questions item');
            }
            setConnectQuestionsItems(items => items.filter(item => item.id !== id));
            toast.success('Connect questions item deleted successfully');
        } catch (error) {
            console.error('Error deleting connect questions item:', error);
            toast.error('Failed to delete connect questions item');
        }
    }

    const handleConnectQuestionsItemClick = (itemId) => {
        router.push(`/connect-questions/edit/${itemId}`);
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
                        <h1 className="text-3xl font-bold mb-4 text-black">Connect Questions</h1>
                        <Link href="/connect-questions/add">
                            <button className="btn btn-sm btn-success mb-2 inline-block bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">
                                Add Connect Questions Item
                            </button>
                        </Link>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="py-2 px-4 text-left">Title</th>
                                        <th className="py-2 px-4 text-left">Description</th>
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
                                        connectQuestionsItems.map(item => (
                                            <tr key={item.id} className="border-t text-black">
                                                <td className="py-2 px-4 truncate max-w-xs">{item.title}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.description}</td>
                                                <td className="py-2 px-4">
                                                    <button className="btn btn-sm btn-primary me-1 inline-block bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2" onClick={() => handleConnectQuestionsItemClick(item.id)}>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteConnectQuestionsItem(item.id)}
                                                        className="btn btn-sm btn-danger inline-block bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {!connectQuestionsItems.length && !isLoading && (
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
