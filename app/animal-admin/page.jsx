"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Protect } from '../components/protect';
import toast, { Toaster } from 'react-hot-toast';
import SidebarAdmin from '../common-components/sidebarAdmin';
import NavbarAdmin from '../common-components/navbarAdmin';
import { useRouter } from 'next/navigation';

export default function AnimalHomeAdmin() {
    const router = useRouter();
    const [animalItems, setAnimalItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    useEffect(() => {
        const fetchAnimalItems = async () => {
            try {
                const response = await fetch('/api/animal-admin');
                if (!response.ok) {
                    throw new Error('Failed to fetch animal items');
                }
                const data = await response.json();
                // console.log(data.data);
                setAnimalItems(data.data); // Adjusted based on API response
            } catch (error) {
                console.error('Error fetching animal items:', error);
                toast.error('Failed to load animal items');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnimalItems();
    }, []);

    async function deleteAnimalItem(id) {
        try {
            const response = await fetch(`/api/animal-admin/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete animal item');
            }
            setAnimalItems(items => items.filter(item => item.id !== id));
            toast.success('Animal item deleted successfully');
        } catch (error) {
            console.error('Error deleting animal item:', error);
            toast.error('Failed to delete animal item');
        }
    }

    const handleAnimalItemClick = (itemId) => {
        router.push(`/animal-admin/edit/${itemId}`);
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
                        <h1 className="text-3xl font-bold mb-4 text-black">Animals</h1>
                        <Link href="/animal-admin/add">
                            <button className="btn btn-sm btn-success mb-2 inline-block bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">
                                Add Animal Item
                            </button>
                        </Link>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="py-2 px-4 text-left">Image</th>
                                        <th className="py-2 px-4 text-left">Small Image</th>
                                        <th className="py-2 px-4 text-left">Description</th>
                                        <th className="py-2 px-4 text-left">Title</th>
                                        <th className="py-2 px-4 text-left">Section</th>
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
                                        animalItems.map(item => (
                                            <tr key={item.id} className="border-t text-black">
                                                <td className="py-2 px-4">
                                                    <img src={`${item.animalImage}`} alt={`Animal ${item.id}`} className="w-16 h-16 object-cover" />
                                                </td>
                                                <td className="py-2 px-4">
                                                    <img src={`${item.animalSmallImage}`} alt={`Small Image ${item.id}`} className="w-16 h-16 object-cover" />
                                                </td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.description}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.title}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.section}</td>
                                                <td className="py-2 px-4">
                                                    <button className="btn btn-sm btn-primary me-1 inline-block bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2" onClick={() => handleAnimalItemClick(item.id)}>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteAnimalItem(item.id)}
                                                        className="btn btn-sm btn-danger inline-block bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {!animalItems.length && !isLoading && (
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
