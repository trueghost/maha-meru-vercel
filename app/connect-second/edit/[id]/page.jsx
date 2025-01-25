"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function EditConnectSecondItem({ params }) {
    const router = useRouter();
    const { id } = params; // Get the item ID from the URL
    const [isLoading, setIsLoading] = useState(true);
    const [itemData, setItemData] = useState(null);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),  // New title validation
        description: Yup.string().required('Description is required'),
        image: Yup.mixed().required('Connect image is required'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState: { errors }, setValue } = useForm(formOptions);

    useEffect(() => {
        const fetchConnectSecondItem = async () => {
            try {
                const response = await fetch(`/api/connect-second/${id}`);  // Updated API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch connect second item');
                }
                const data = await response.json();
                setItemData(data.data);
                // Set default values for the form
                setValue('title', data.data.title);  // Set default title
                setValue('description', data.data.description);
                // You can set the image file if needed (depending on how you're handling it)
            } catch (error) {
                console.error('Error fetching connect second item:', error);
                toast.error('Failed to load connect second item');
            } finally {
                setIsLoading(false);
            }
        };

        fetchConnectSecondItem();
    }, [id, setValue]);

    const onSubmit = async (formData) => {
        const connectData = new FormData();
        connectData.append('title', formData.title);  // Include title in FormData
        connectData.append('description', formData.description);
        
        if (formData.image) {
            connectData.append('image', formData.image[0]); // Only get the first file
        }

        try {
            const response = await fetch(`/api/connect-second/${id}`, {  // Updated API endpoint
                method: 'PUT',
                body: connectData,
            });

            if (!response.ok) {
                throw new Error('Failed to update connect second item');
            }

            toast.success('Connect item updated successfully!');
            router.push('/connect-second');  // Updated redirect
        } catch (error) {
            console.error('Error updating connect second item:', error);
            toast.error(`Failed to update connect item: ${error.message}`);
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
            <h1 className="text-2xl font-bold mb-4 text-center">Edit Connect Second Item</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label> {/* New Title field */}
                    <input
                        {...register('title')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter connect second item title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        {...register('description')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter connect second item description"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Connect Image</label>
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
                        Update Connect Second Item
                    </button>
                </div>
            </form>
            <Toaster />
        </div>
    );
}
