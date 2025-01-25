"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Protect } from '../components/protect';
import toast, { Toaster } from 'react-hot-toast';
import SidebarAdmin from '../common-components/sidebarAdmin';
import NavbarAdmin from '../common-components/navbarAdmin';
import { useRouter } from 'next/navigation';

export default function FormHomeAdmin() {
    const router = useRouter();
    const [forms, setForms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await fetch('/api/form-admin');
                if (!response.ok) throw new Error('Failed to fetch forms');
                const data = await response.json();
                setForms(data.data);
            } catch (error) {
                console.error('Error fetching forms:', error);
                toast.error('Failed to load forms');
            } finally {
                setIsLoading(false);
            }
        };

        fetchForms();
    }, []);

    async function deleteForm(id) {
        try {
            const response = await fetch(`/api/form-admin/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete form');
            setForms((forms) => forms.filter((form) => form.id !== id));
            toast.success('Form deleted successfully');
        } catch (error) {
            console.error('Error deleting form:', error);
            toast.error('Failed to delete form');
        }
    }

    const handleFormClick = (formId) => {
        router.push(`/form-admin/edit/${formId}`);
    };

    return (
        <Protect>
            <div className="min-h-screen flex flex-col bg-gray-100">
                <NavbarAdmin isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <div className="flex flex-1">
                    {isSidebarOpen && <SidebarAdmin />}
                    <div className="flex-grow p-6">
                        <h1 className="text-3xl font-bold mb-4 text-black">Forms</h1>
                        <Link href="/form-admin/add">
                            <button className="btn btn-sm btn-success mb-2 inline-block bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">
                                Add Form
                            </button>
                        </Link>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="py-2 px-4 text-left">Mobile Number 1</th>
                                        <th className="py-2 px-4 text-left">Mobile Number 2</th>
                                        <th className="py-2 px-4 text-left">Mail</th>
                                        <th className="py-2 px-4 text-left">Location</th>
                                        <th className="py-2 px-4 text-left">Facebook URL</th>
                                        <th className="py-2 px-4 text-left">X URL</th>
                                        <th className="py-2 px-4 text-left">Instagram URL</th>
                                        <th className="py-2 px-4 text-left">LinkedIn URL</th>
                                        <th className="py-2 px-4 text-left">WhatsApp URL</th>
                                        {/* Placeholder columns */}
                                        <th className="py-2 px-4 text-left">Placeholder 1</th>
                                        <th className="py-2 px-4 text-left">Placeholder 2</th>
                                        <th className="py-2 px-4 text-left">Placeholder 3</th>
                                        <th className="py-2 px-4 text-left">Placeholder 4</th>
                                        <th className="py-2 px-4 text-left">Placeholder 5</th>
                                        <th className="py-2 px-4 text-left">Placeholder 6</th>
                                        <th className="py-2 px-4 text-left">Placeholder 7</th>
                                        <th className="py-2 px-4 text-left">Placeholder 8</th>
                                        <th className="py-2 px-4 text-left">Placeholder 9</th>
                                        <th className="py-2 px-4 text-left"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="20" className="py-4 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="w-8 h-8 border-4 border-t-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        forms.map((form) => (
                                            <tr key={form.id} className="border-t text-black">
                                                <td className="py-2 px-4">{form.mobile_number_1}</td>
                                                <td className="py-2 px-4">{form.mobile_number_2}</td>
                                                <td className="py-2 px-4">{form.mail}</td>
                                                <td className="py-2 px-4">{form.location}</td>
                                                <td className="py-2 px-4">
                                                    <a href={form.facebook_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                                        {form.facebook_url}
                                                    </a>
                                                </td>
                                                <td className="py-2 px-4">
                                                    <a href={form.x_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                                        {form.x_url}
                                                    </a>
                                                </td>
                                                <td className="py-2 px-4">
                                                    <a href={form.instagram_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                                        {form.instagram_url}
                                                    </a>
                                                </td>
                                                <td className="py-2 px-4">
                                                    <a href={form.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                                        {form.linkedin_url}
                                                    </a>
                                                </td>
                                                <td className="py-2 px-4">
                                                    <a href={form.whatsapp_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                                        {form.whatsapp_url}
                                                    </a>
                                                </td>
                                                {/* Placeholder values */}
                                                <td className="py-2 px-4">{form.placeholder_1}</td>
                                                <td className="py-2 px-4">{form.placeholder_2}</td>
                                                <td className="py-2 px-4">{form.placeholder_3}</td>
                                                <td className="py-2 px-4">{form.placeholder_4}</td>
                                                <td className="py-2 px-4">{form.placeholder_5}</td>
                                                <td className="py-2 px-4">{form.placeholder_6}</td>
                                                <td className="py-2 px-4">{form.placeholder_7}</td>
                                                <td className="py-2 px-4">{form.placeholder_8}</td>
                                                <td className="py-2 px-4">{form.placeholder_9}</td>
                                                <td className="py-2 px-4">
                                                    <button className="btn btn-sm btn-primary me-1 inline-block bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2" onClick={() => handleFormClick(form.id)}>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteForm(form.id)}
                                                        className="btn btn-sm btn-danger inline-block bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {!forms.length && !isLoading && (
                                        <tr>
                                            <td colSpan="20" className="py-4 text-center text-black">
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
