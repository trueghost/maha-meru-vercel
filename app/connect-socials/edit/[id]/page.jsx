"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function EditConnectSocialsItem({ params }) {
    const router = useRouter();
    const { id } = params; // Get the item ID from the URL
    const [isLoading, setIsLoading] = useState(true);
    const [itemData, setItemData] = useState(null);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        category: Yup.string().required('Category is required'),
        description: Yup.string().required('Description is required'),
        date: Yup.date().required('Date is required'),
        link: Yup.string().required('Link is required'),
        image: Yup.mixed().optional(),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState: { errors }, setValue } = useForm(formOptions);

    useEffect(() => {
        const fetchConnectSocialsItem = async () => {
            try {
                const response = await fetch(`/api/connect-socials/${id}`);
                if (!response.ok) {
                    const errorData = await response.json(); // Get detailed error response if available
                    throw new Error(`Error ${response.status}: ${errorData.message || 'Failed to fetch connect socials item'}`);
                }
                const data = await response.json();
                // console.log(data); // Log the response to check its structure
                if (data && data.data) {
                    setItemData(data.data);
                    // Set default values for the form
                    setValue('title', data.data.title);
                    setValue('category', data.data.category);
                    setValue('description', data.data.description);
                    setValue('date', data.data.date.split('T')[0]); // Set the default date value
                    setValue('link', data.data.link); // Set the default link value
                } else {
                    toast.error('No data found for the connect socials item.');
                }
            } catch (error) {
                console.error('Error fetching connect socials item:', error);
                toast.error(`Failed to load connect socials item: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchConnectSocialsItem();
    }, [id, setValue]);    

    const onSubmit = async (formData) => {
        const connectSocialsData = new FormData();
        connectSocialsData.append('title', formData.title);
        connectSocialsData.append('category', formData.category);
        connectSocialsData.append('description', formData.description);
        connectSocialsData.append('date', formData.date);
        connectSocialsData.append('link', formData.link); // Append the link to the form data
        
        if (formData.image) {
            connectSocialsData.append('image', formData.image[0]); // Only get the first file
        }

        try {
            const response = await fetch(`/api/connect-socials/${id}`, {
                method: 'PUT',
                body: connectSocialsData,
            });

            if (!response.ok) {
                throw new Error('Failed to update connect socials item');
            }

            toast.success('Connect socials item updated successfully!');
            router.push('/connect-socials');
        } catch (error) {
            console.error('Error updating connect socials item:', error);
            toast.error(`Failed to update connect socials item: ${error.message}`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loader"></div> {/* Add your loading spinner here */}
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Edit Connect Socials Item</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        {...register('title')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter connect socials item title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                        type="text"
                        {...register('category')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter connect socials item category"
                    />
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        {...register('description')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter connect socials item description"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                        type="date"
                        {...register('date')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.date ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Link</label>
                    <input
                        type="url"
                        {...register('link')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.link ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter connect socials item link"
                    />
                    {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Connect Socials Image (optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register('image')}
                        className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                    >
                        Update Connect Socials Item
                    </button>
                </div>
            </form>
            <Toaster />
        </div>
    );
}
