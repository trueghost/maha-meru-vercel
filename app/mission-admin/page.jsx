"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Protect } from '../components/protect';
import toast, { Toaster } from 'react-hot-toast';
import SidebarAdmin from '../common-components/sidebarAdmin';
import NavbarAdmin from '../common-components/navbarAdmin';
import { useRouter } from 'next/navigation';

export default function MissionHomeAdmin() {
    const router = useRouter();
    const [missionItems, setMissionItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    useEffect(() => {
        const fetchMissionItems = async () => {
            try {
                const response = await fetch('/api/mission-admin');
                if (!response.ok) {
                    throw new Error('Failed to fetch mission items');
                }
                const data = await response.json();
                setMissionItems(data.data); // Adjusted based on API response
            } catch (error) {
                console.error('Error fetching mission items:', error);
                toast.error('Failed to load mission items');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMissionItems();
    }, []);

    async function deleteMissionItem(id) {
        try {
            const response = await fetch(`/api/mission-admin/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete mission item');
            }
            setMissionItems(items => items.filter(item => item.id !== id));
            toast.success('Mission item deleted successfully');
        } catch (error) {
            console.error('Error deleting mission item:', error);
            toast.error('Failed to delete mission item');
        }
    }

    const handleMissionItemClick = (itemId) => {
        router.push(`/mission-admin/edit/${itemId}`);
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
                        <h1 className="text-3xl font-bold mb-4 text-black">Mission</h1>
                        <Link href="/mission-admin/add">
                            <button className="btn btn-sm btn-success mb-2 inline-block bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">
                                Add Mission Item
                            </button>
                        </Link>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="py-2 px-4 text-left">Small Image 1</th>
                                        <th className="py-2 px-4 text-left">Small Image 2</th>
                                        <th className="py-2 px-4 text-left">Small Image 3</th>
                                        <th className="py-2 px-4 text-left">Small Image 4</th>
                                        <th className="py-2 px-4 text-left">Image 1</th>
                                        <th className="py-2 px-4 text-left">Image 2</th>
                                        <th className="py-2 px-4 text-left">Image 3</th>
                                        <th className="py-2 px-4 text-left">Image 4</th>
                                        <th className="py-2 px-4 text-left">Image 5</th>
                                        <th className="py-2 px-4 text-left">Image Title 1</th>
                                        <th className="py-2 px-4 text-left">Image Title 2</th>
                                        <th className="py-2 px-4 text-left">Image Title 3</th>
                                        <th className="py-2 px-4 text-left">Image Title 4</th>
                                        <th className="py-2 px-4 text-left">Image Title 5</th>
                                        <th className="py-2 px-4 text-left">Pioneer Title</th>
                                        <th className="py-2 px-4 text-left">Pioneer Subtitle</th>
                                        <th className="py-2 px-4 text-left"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="17" className="py-4 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="w-8 h-8 border-4 border-t-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        missionItems.map(item => (
                                            <tr key={item.id} className="border-t text-black">
                                                <td className="py-2 px-4"><img src={item.smallImage1} alt={`Small Image 1`} className="w-16 h-16 object-cover" /></td>
                                                <td className="py-2 px-4"><img src={item.smallImage2} alt={`Small Image 2`} className="w-16 h-16 object-cover" /></td>
                                                <td className="py-2 px-4"><img src={item.smallImage3} alt={`Small Image 3`} className="w-16 h-16 object-cover" /></td>
                                                <td className="py-2 px-4"><img src={item.smallImage4} alt={`Small Image 4`} className="w-16 h-16 object-cover" /></td>
                                                <td className="py-2 px-4"><img src={item.image1} alt={`Image 1`} className="w-16 h-16 object-cover" /></td>
                                                <td className="py-2 px-4"><img src={item.image2} alt={`Image 2`} className="w-16 h-16 object-cover" /></td>
                                                <td className="py-2 px-4"><img src={item.image3} alt={`Image 3`} className="w-16 h-16 object-cover" /></td>
                                                <td className="py-2 px-4"><img src={item.image4} alt={`Image 4`} className="w-16 h-16 object-cover" /></td>
                                                <td className="py-2 px-4"><img src={item.image5} alt={`Image 5`} className="w-16 h-16 object-cover" /></td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.imageTitle1}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.imageTitle2}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.imageTitle3}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.imageTitle4}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.imageTitle5}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.pioneerTitle}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{item.pioneerSubtitle}</td>
                                                <td className="py-2 px-4">
                                                    <button className="btn btn-sm btn-primary me-1 inline-block bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2" onClick={() => handleMissionItemClick(item.id)}>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteMissionItem(item.id)}
                                                        className="btn btn-sm btn-danger inline-block bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {!missionItems.length && !isLoading && (
                                        <tr>
                                            <td colSpan="17" className="py-4 text-center text-black">
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
