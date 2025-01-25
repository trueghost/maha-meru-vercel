"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function EditAquaItem({ params }) {
    const router = useRouter();
    const { id } = params; // Get the item ID from the URL
    const [isLoading, setIsLoading] = useState(true);
    const [itemData, setItemData] = useState(null);
    const [aquaTitlesItems, setAquaTitlesItems] = useState([]);
    const [isTitlesLoading, setIsTitlesLoading] = useState(true);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        plantImage: Yup.mixed().required('Plant image is required'),
        plantSmallImage: Yup.mixed().required('Small image is required'),
        section: Yup.string().required('Section is required'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState: { errors }, setValue } = useForm(formOptions);

    useEffect(() => {
        const fetchAquaTitlesItems = async () => {
            try {
                const response = await fetch('/api/aqua-titles');
                if (!response.ok) {
                    throw new Error('Failed to fetch aqua titles items');
                }
                const data = await response.json();
                setAquaTitlesItems(data.data); // Adjusted based on API response
            } catch (error) {
                console.error('Error fetching aqua titles items:', error);
                toast.error('Failed to load aqua titles items');
            } finally {
                setIsTitlesLoading(false);
            }
        };

        const fetchAquaItem = async () => {
            try {
                const response = await fetch(`/api/aqua-admin/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch aqua item');
                }
                const data = await response.json();
                setItemData(data.data);
                // Set default values for the form
                setValue('title', data.data.title);
                setValue('description', data.data.description);
                setValue('section', data.data.section);
                // Handle the image files if needed (depends on how you're handling them)
            } catch (error) {
                console.error('Error fetching aqua item:', error);
                toast.error('Failed to load aqua item');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAquaTitlesItems();
        fetchAquaItem();
    }, [id, setValue]);

    const onSubmit = async (formData) => {
        const aquaData = new FormData();
        aquaData.append('title', formData.title);
        aquaData.append('description', formData.description);
        aquaData.append('section', formData.section);

        if (formData.plantImage) {
            aquaData.append('plantImage', formData.plantImage[0]); // Only get the first file
        }
        if (formData.plantSmallImage) {
            aquaData.append('plantSmallImage', formData.plantSmallImage[0]); // Only get the first file
        }

        try {
            const response = await fetch(`/api/aqua-admin/${id}`, {
                method: 'PUT',
                body: aquaData,
            });

            if (!response.ok) {
                throw new Error('Failed to update aqua item');
            }

            toast.success('Aqua item updated successfully!');
            router.push('/aqua-admin');
        } catch (error) {
            console.error('Error updating aqua item:', error);
            toast.error(`Failed to update aqua item: ${error.message}`);
        }
    };

    if (isLoading || isTitlesLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loader"></div> {/* Add your loading spinner here */}
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Edit Aqua Item</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        {...register('title')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter item title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        {...register('description')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter aqua item description"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Section</label>
                    <select
                        {...register('section')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.section ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                    >
                        <option value="">Select a section</option>
                        {aquaTitlesItems.map((item) => (
                            <option key={item.id} value={item.title}>{item.title}</option>
                        ))}
                    </select>
                    {errors.section && <p className="text-red-500 text-sm mt-1">{errors.section.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Plant Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register('plantImage')}
                        className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    {errors.plantImage && <p className="text-red-500 text-sm mt-1">{errors.plantImage.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Small Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register('plantSmallImage')}
                        className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    {errors.plantSmallImage && <p className="text-red-500 text-sm mt-1">{errors.plantSmallImage.message}</p>}
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                    >
                        Update Aqua Item
                    </button>
                </div>
            </form>
            <Toaster />
        </div>
    );
}