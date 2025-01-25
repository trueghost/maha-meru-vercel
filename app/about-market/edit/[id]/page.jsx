"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function EditAboutMarketItem({ params }) {
    const router = useRouter();
    const { id } = params; // Get the item ID from the URL
    const [isLoading, setIsLoading] = useState(true);
    const [itemData, setItemData] = useState(null);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        image: Yup.mixed().required('About market image is required'),
        hoverImage: Yup.mixed().required('Hover image is required'), // Added Hover Image validation
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState: { errors }, setValue } = useForm(formOptions);

    useEffect(() => {
        const fetchAboutMarketItem = async () => {
            try {
                const response = await fetch(`/api/about-market/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch about market item');
                }
                const data = await response.json();
                setItemData(data.data);
                // Set default values for the form
                setValue('title', data.data.title);
                // Set hover image value if necessary (you might want to handle this differently)
            } catch (error) {
                console.error('Error fetching about market item:', error);
                toast.error('Failed to load about market item');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAboutMarketItem();
    }, [id, setValue]);

    const onSubmit = async (formData) => {
        const aboutData = new FormData();
        aboutData.append('title', formData.title);

        if (formData.image && formData.image.length > 0) {
            aboutData.append('image', formData.image[0]); // Only get the first file
        }

        if (formData.hoverImage && formData.hoverImage.length > 0) {
            aboutData.append('hoverImage', formData.hoverImage[0]); // Append the hover image
        }

        try {
            const response = await fetch(`/api/about-market/${id}`, {
                method: 'PUT',
                body: aboutData,
            });

            if (!response.ok) {
                throw new Error('Failed to update about market item');
            }

            toast.success('About market item updated successfully!');
            router.push('/about-market');
        } catch (error) {
            console.error('Error updating about market item:', error);
            toast.error(`Failed to update about market item: ${error.message}`);
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
            <h1 className="text-2xl font-bold mb-4 text-center">Edit About Market Item</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        {...register('title')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter about market item title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">About Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register('image')}
                        className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Hover Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register('hoverImage')} // Register the hover image input
                        className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    {errors.hoverImage && <p className="text-red-500 text-sm mt-1">{errors.hoverImage.message}</p>}
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                    >
                        Update About Market Item
                    </button>
                </div>
            </form>
            <Toaster />
        </div>
    );
}
