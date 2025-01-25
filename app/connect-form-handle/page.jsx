"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Protect } from '../components/protect';
import toast, { Toaster } from 'react-hot-toast';
import SidebarAdmin from '../common-components/sidebarAdmin';
import NavbarAdmin from '../common-components/navbarAdmin';
import { useRouter } from 'next/navigation';

export default function ConnectFormHandleAdmin() {
    const router = useRouter();
    const [formHandles, setFormHandles] = useState([]);
    const [filteredFormHandles, setFilteredFormHandles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchFormHandles = async () => {
            try {
                const response = await fetch('/api/connect-form-handle');
                if (!response.ok) {
                    throw new Error('Failed to fetch form handles');
                }
                const data = await response.json();
                const reversedData = [...data.data].reverse(); // Reverse the order
                setFormHandles(reversedData);
                setFilteredFormHandles(reversedData);
            } catch (error) {
                console.error('Error fetching form handles:', error);
                toast.error('Failed to load form handles');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFormHandles();
    }, []);

    useEffect(() => {
        const filtered = formHandles.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredFormHandles(filtered);
    }, [searchQuery, formHandles]);

    async function deleteFormHandle(id) {
        try {
            const response = await fetch(`/api/connect-form-handle/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete form handle');
            }
            setFormHandles(items => items.filter(item => item.id !== id));
            setFilteredFormHandles(items => items.filter(item => item.id !== id));
            toast.success('Form handle deleted successfully');
        } catch (error) {
            console.error('Error deleting form handle:', error);
            toast.error('Failed to delete form handle');
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
                    {isSidebarOpen && <SidebarAdmin totalItems2={formHandles.length} />}
                    <div className="flex-grow p-6">
                        <h1 className="text-3xl font-bold mb-4 text-black">Connect Form Handle Admin</h1>

                        {/* Search Input */}
                        <div className="mb-4">
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded text-black"
                                placeholder="Search by Name or Email"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="py-2 px-4 text-left text-black">Name</th>
                                        <th className="py-2 px-4 text-left text-black">Email</th>
                                        <th className="py-2 px-4 text-left text-black"></th>
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
                                        filteredFormHandles.map(item => (
                                            <tr key={item.id} className="border-t text-black">
                                                <td className="py-2 px-4">{item.name}</td>
                                                <td className="py-2 px-4">{item.email}</td>
                                                <td className="py-2 px-4">
                                                    <button
                                                        onClick={() => deleteFormHandle(item.id)}
                                                        className="btn btn-sm btn-danger inline-block bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {!filteredFormHandles.length && !isLoading && (
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
