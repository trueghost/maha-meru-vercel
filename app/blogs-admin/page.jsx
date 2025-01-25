"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Protect } from '../components/protect';
import toast, { Toaster } from 'react-hot-toast';
import SidebarAdmin from '../common-components/sidebarAdmin';
import NavbarAdmin from '../common-components/navbarAdmin';
import { useRouter } from 'next/navigation';

export default function BlogHomeAdmin() {
    const router = useRouter();
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch('/api/blogs-admin');
                if (!response.ok) {
                    throw new Error('Failed to fetch blogs');
                }
                const data = await response.json();
                // console.log(data.data)
                setBlogs(data.data); // Adjusted based on API response
            } catch (error) {
                console.error('Error fetching blogs:', error);
                toast.error('Failed to load blogs');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    async function deleteBlog(id) {
        try {
            const response = await fetch(`/api/blogs-admin/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete blog');
            }
            setBlogs((blogs) => blogs.filter((blog) => blog.id !== id));
            toast.success('Blog deleted successfully');
        } catch (error) {
            console.error('Error deleting blog:', error);
            toast.error('Failed to delete blog');
        }
    }

    const handleBlogClick = (blogId) => {
        router.push(`/blogs-admin/edit/${blogId}`);
    };

    async function toggleHideStatus(id, currentHideStatus) {
        try {
            const response = await fetch(`/api/blogs-admin/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ hide: !currentHideStatus }),  // Toggle hide status
            });

            if (!response.ok) {
                throw new Error('Failed to update hide status');
            }

            setBlogs((prevBlogs) =>
                prevBlogs.map((blog) =>
                    blog.id === id ? { ...blog, hide: !currentHideStatus } : blog
                )
            );
            toast.success(`Blog ${!currentHideStatus ? 'hidden' : 'visible'} successfully`);
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
                        <h1 className="text-3xl font-bold mb-4 text-black">Blogs</h1>
                        <Link href="/blogs-admin/add">
                            <button className="btn btn-sm btn-success mb-2 inline-block bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">
                                Add Blog
                            </button>
                        </Link>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="py-2 px-4 text-left">Image</th>
                                        <th className="py-2 px-4 text-left">Title</th>
                                        <th className="py-2 px-4 text-left">Category</th>
                                        <th className="py-2 px-4 text-left">Description</th>
                                        <th className="py-2 px-4 text-left">Date</th>
                                        <th className="py-2 px-4 text-left">Link</th>
                                        <th className="py-2 px-4 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="8" className="py-4 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="w-8 h-8 border-4 border-t-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        blogs.map((blog) => (
                                            <tr key={blog.id} className="border-t text-black">
                                                <td className="py-2 px-4">
                                                    <img src={`${blog.image_url}`} alt={blog.title} className="w-16 h-16 object-cover" />
                                                </td>
                                                <td className="py-2 px-4">{blog.title}</td>
                                                <td className="py-2 px-4">{blog.category}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">{blog.description}</td>
                                                <td className="py-2 px-4">{new Date(blog.date).toLocaleDateString()}</td>
                                                <td className="py-2 px-4">
                                                    {blog.link ? (
                                                        <a href={blog.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                                            {blog.link}
                                                        </a>
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </td>
                                                <td className="py-2 px-4">
                                                    <button
                                                        onClick={() => toggleHideStatus(blog.id, blog.hide)}
                                                        className={`btn btn-sm ${blog.hide ? 'bg-gray-500' : 'bg-yellow-500'} text-white py-1 px-2 rounded hover:bg-yellow-600`}
                                                    >
                                                        {blog.hide ? 'Unhide' : 'Hide'}
                                                    </button>
                                                    <button className="btn btn-sm btn-primary me-1 ml-2 inline-block bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2" onClick={() => handleBlogClick(blog.id)}>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteBlog(blog.id)}
                                                        className="btn btn-sm btn-danger inline-block bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {!blogs.length && !isLoading && (
                                        <tr>
                                            <td colSpan="8" className="py-4 text-center text-black">
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