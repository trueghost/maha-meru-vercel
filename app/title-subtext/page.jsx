"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Protect } from '../components/protect';
import toast, { Toaster } from 'react-hot-toast';
import SidebarAdmin from '../common-components/sidebarAdmin';
import NavbarAdmin from '../common-components/navbarAdmin';
import { useRouter } from 'next/navigation';

export default function AllTitlesAndSubtexts() {
    const router = useRouter();
    const [allTitleAndSubtext, setAllTitleAndSubtext] = useState([]); // Initialize as an empty array
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchAllTitleAndSubtext = async () => {
            try {
                const response = await fetch('/api/title-subtext');
                if (!response.ok) {
                    throw new Error('Failed to fetch titles and subtexts');
                }
                const data = await response.json();
                // console.log(data.entries); // Log the entries to see the data structure
                setAllTitleAndSubtext(data.entries); // Adjusted based on API response
            } catch (error) {
                console.error('Error fetching titles and subtexts:', error);
                toast.error('Failed to load titles and subtexts');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllTitleAndSubtext();
    }, []);

    async function deleteTitleAndSubtext(id) {
        try {
            const response = await fetch(`/api/title-subtext/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete title and subtext');
            }
            setAllTitleAndSubtext(entries => entries.filter(entry => entry.id !== id));
            toast.success('Title and subtext deleted successfully');
        } catch (error) {
            console.error('Error deleting title and subtext:', error);
            toast.error('Failed to delete title and subtext');
        }
    }

    async function toggleHideStatus(id, currentHideStatus) {
        try {
            const response = await fetch(`/api/title-subtext/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ hide: !currentHideStatus }),  // Ensure the value sent is boolean
            });
    
            if (!response.ok) {
                throw new Error('Failed to update hide status');
            }
    
            setAllTitleAndSubtext((prevEntries) =>
                prevEntries.map((entry) =>
                    entry.id === id ? { ...entry, hide: !currentHideStatus } : entry
                )
            );
            toast.success(`Title and Subtext ${!currentHideStatus ? 'hidden' : 'visible'} successfully`);
        } catch (error) {
            console.error('Error updating hide status:', error);
            toast.error('Failed to update hide status');
        }
    }    

    const handleTitleAndSubtextClick = (entryId) => {
        router.push(`/title-subtext/edit/${entryId}`);
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
                        <h1 className="text-3xl font-bold mb-4 text-black">All Titles, Subtexts And Youtube Video Link</h1>
                        <Link href="/title-subtext/add">
                            <button className="btn btn-sm btn-success mb-2 inline-block bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">
                                Add Title and Subtext
                            </button>
                        </Link>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="py-2 px-4 text-left">Page Name</th>
                                        <th className="py-2 px-4 text-left">Title</th>
                                        <th className="py-2 px-4 text-left">Subtext</th>
                                        <th className="py-2 px-4 text-left">Actions</th>
                                        <th className="py-2 px-4 text-left"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="5" className="py-4 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="w-8 h-8 border-4 border-t-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : allTitleAndSubtext.length > 0 ? (
                                        allTitleAndSubtext.map(entry => (
                                            <tr key={entry.id} className="border-t text-black">
                                                <td className="py-2 px-4">{entry.page_name}</td>
                                                <td className="py-2 px-4">{entry.title}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{entry.subtext}</td>
                                                <td className="py-2 px-4">
                                                <button
                                                        className={`btn btn-sm mr-2 inline-block py-1 px-2 rounded ${
                                                            entry.hide
                                                                ? 'bg-gray-400 text-white hover:bg-gray-500'
                                                                : 'bg-green-500 text-white hover:bg-green-600'
                                                        }`}
                                                        onClick={() => toggleHideStatus(entry.id, entry.hide)}
                                                    >
                                                        {entry.hide ? 'Unhide' : 'Hide'}
                                                    </button>
                                                    <button className="btn btn-sm btn-primary me-1 inline-block bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2" onClick={() => handleTitleAndSubtextClick(entry.id)}>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteTitleAndSubtext(entry.id)}
                                                        className="btn btn-sm btn-danger inline-block bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-4 text-center text-black">
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