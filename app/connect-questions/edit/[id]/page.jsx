"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function EditConnectQuestionsItem({ params }) {
    const router = useRouter();
    const { id } = params; // Get the item ID from the URL
    const [isLoading, setIsLoading] = useState(true);
    const [itemData, setItemData] = useState(null);

    const validationSchema = Yup.object().shape({
        description: Yup.string().required('Description is required'),
        title: Yup.string().required('Title is required'), // New title field validation
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState: { errors }, setValue } = useForm(formOptions);

    useEffect(() => {
        const fetchConnectQuestionsItem = async () => {
            try {
                const response = await fetch(`/api/connect-questions/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch connect questions item');
                }
                const data = await response.json();
                setItemData(data.data);
                // Set default values for the form
                setValue('description', data.data.description);
                setValue('title', data.data.title); // Set the title field
            } catch (error) {
                console.error('Error fetching connect questions item:', error);
                toast.error('Failed to load connect questions item');
            } finally {
                setIsLoading(false);
            }
        };

        fetchConnectQuestionsItem();
    }, [id, setValue]);

    const onSubmit = async (formData) => {
        const connectData = new FormData();
        connectData.append('description', formData.description);
        connectData.append('title', formData.title); // Add title to formData

        try {
            const response = await fetch(`/api/connect-questions/${id}`, {
                method: 'PUT',
                body: connectData,
            });

            if (!response.ok) {
                throw new Error('Failed to update connect questions item');
            }

            toast.success('Connect item updated successfully!');
            router.push('/connect-questions');
        } catch (error) {
            console.error('Error updating connect questions item:', error);
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
            <h1 className="text-2xl font-bold mb-4 text-center">Edit Connect Questions Item</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        {...register('title')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter connect question title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        {...register('description')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter connect question description"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                    >
                        Update Connect Questions Item
                    </button>
                </div>
            </form>
            <Toaster />
        </div>
    );
}
