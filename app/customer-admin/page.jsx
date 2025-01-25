"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Protect } from '../components/protect';
import toast, { Toaster } from 'react-hot-toast';
import SidebarAdmin from '../common-components/sidebarAdmin';
import NavbarAdmin from '../common-components/navbarAdmin';
import { useRouter } from 'next/navigation';

export default function CustomerStoriesAdmin() {
    const router = useRouter();
    const [customerStories, setCustomerStories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchCustomerStories = async () => {
            try {
                const response = await fetch('/api/customer-admin'); // Update the API endpoint as needed
                if (!response.ok) {
                    throw new Error('Failed to fetch customer stories');
                }
                const data = await response.json();
                setCustomerStories(data.data); // Adjusted based on API response
            } catch (error) {
                console.error('Error fetching customer stories:', error);
                toast.error('Failed to load customer stories');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCustomerStories();
    }, []);

    async function toggleHideStatus(id, currentHideStatus) {
        try {
            const response = await fetch(`/api/customer-admin/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ hide: !currentHideStatus }), // Toggle hide status
            });

            if (!response.ok) {
                throw new Error('Failed to update hide status');
            }

            setCustomerStories((prevStories) =>
                prevStories.map((story) =>
                    story.id === id ? { ...story, hide: !currentHideStatus } : story
                )
            );
            toast.success(`Story ${!currentHideStatus ? 'hidden' : 'visible'} successfully`);
        } catch (error) {
            console.error('Error updating hide status:', error);
            toast.error('Failed to update hide status');
        }
    }

    async function deleteCustomerStory(id) {
        try {
            const response = await fetch(`/api/customer-admin/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete customer story');
            }
            setCustomerStories((stories) => stories.filter((story) => story.id !== id));
            toast.success('Customer story deleted successfully');
        } catch (error) {
            console.error('Error deleting customer story:', error);
            toast.error('Failed to delete customer story');
        }
    }

    const handleCustomerStoryClick = (storyId) => {
        router.push(`/customer-admin/edit/${storyId}`);
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
                        <h1 className="text-3xl font-bold mb-4 text-black">Customer Stories</h1>
                        <Link href="/customer-admin/add">
                            <button className="btn btn-sm btn-success mb-2 inline-block bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">
                                Add Customer Story
                            </button>
                        </Link>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="py-2 px-4 text-left">Image</th>
                                        <th className="py-2 px-4 text-left">Review</th>
                                        <th className="py-2 px-4 text-left">Name</th>
                                        <th className="py-2 px-4 text-left">Role</th>
                                        <th className="py-2 px-4 text-left">Actions</th>
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
                                    ) : (
                                        customerStories.map((story) => (
                                            <tr key={story.id} className="border-t text-black">
                                                <td className="py-2 px-4">
                                                    <img src={`${story.image}`} alt={story.name} className="w-16 h-16 object-cover" />
                                                </td>
                                                <td className="py-2 px-4 truncate max-w-xs">{story.review}</td>
                                                <td className="py-2 px-4">{story.name}</td>
                                                <td className="py-2 px-4">{story.role}</td>
                                                <td className="py-2 px-4">
                                                    <button
                                                        onClick={() => toggleHideStatus(story.id, story.hide)}
                                                        className={`btn btn-sm inline-block py-1 px-2 rounded ${
                                                            story.hide
                                                                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                                                : 'bg-gray-500 hover:bg-gray-600 text-white'
                                                        }`}
                                                    >
                                                        {story.hide ? 'Unhide' : 'Hide'}
                                                    </button>
                                                    <button className="btn btn-sm btn-primary ml-4 inline-block bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2" onClick={() => handleCustomerStoryClick(story.id)}>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCustomerStory(story.id)}
                                                        className="btn btn-sm btn-danger inline-block bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 ml-2"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {!customerStories.length && !isLoading && (
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
