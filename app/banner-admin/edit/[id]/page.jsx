"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function EditBannerItem({ params }) {
    const router = useRouter();
    const { id } = params; // Get the item ID from the URL
    const [isLoading, setIsLoading] = useState(true);
    const [itemData, setItemData] = useState(null);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        image: Yup.mixed().required('Banner image is required'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState: { errors }, setValue } = useForm(formOptions);

    useEffect(() => {
        const fetchBannerItem = async () => {
            try {
                const response = await fetch(`/api/banner-admin/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch banner item');
                }
                const data = await response.json();
                setItemData(data.data);
                // Set default values for the form
                setValue('title', data.data.title);
                setValue('description', data.data.description);
                // You can set the image file if needed (depending on how you're handling it)
            } catch (error) {
                console.error('Error fetching banner item:', error);
                toast.error('Failed to load banner item');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBannerItem();
    }, [id, setValue]);

    const onSubmit = async (formData) => {
        const bannerData = new FormData();
        bannerData.append('title', formData.title);
        bannerData.append('description', formData.description);
        
        if (formData.image) {
            bannerData.append('image', formData.image[0]); // Only get the first file
        }

        try {
            const response = await fetch(`/api/banner-admin/${id}`, {
                method: 'PUT',
                body: bannerData,
            });

            if (!response.ok) {
                throw new Error('Failed to update banner item');
            }

            toast.success('Banner item updated successfully!');
            router.push('/banner-admin');
        } catch (error) {
            console.error('Error updating banner item:', error);
            toast.error(`Failed to update banner item: ${error.message}`);
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
            <h1 className="text-2xl font-bold mb-4 text-center">Edit Banner Item</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        {...register('title')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter banner title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        {...register('description')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter banner description"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Banner Image</label>
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
                        Update Banner Item
                    </button>
                </div>
            </form>
            <Toaster />
        </div>
    );
}
