"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function EditAgricultureTitleItem({ params }) {
    const router = useRouter();
    const { id } = params; // Get the item ID from the URL
    const [isLoading, setIsLoading] = useState(true);
    const [itemData, setItemData] = useState(null);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState: { errors }, setValue } = useForm(formOptions);

    useEffect(() => {
        const fetchAgricultureTitleItem = async () => {
            try {
                const response = await fetch(`/api/agriculture-titles/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch agriculture title item');
                }
                const data = await response.json();
                setItemData(data.data);
                // Set default value for the form
                setValue('title', data.data.title);
            } catch (error) {
                console.error('Error fetching agriculture title item:', error);
                toast.error('Failed to load agriculture title item');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgricultureTitleItem();
    }, [id, setValue]);

    const onSubmit = async (formData) => {
        const agricultureData = new FormData();
        agricultureData.append('title', formData.title);

        try {
            const response = await fetch(`/api/agriculture-titles/${id}`, {
                method: 'PUT',
                body: agricultureData,
            });

            if (!response.ok) {
                throw new Error('Failed to update agriculture title item');
            }

            toast.success('Agriculture title updated successfully!');
            router.push('/agriculture-titles');
        } catch (error) {
            console.error('Error updating agriculture title item:', error);
            toast.error(`Failed to update agriculture title item: ${error.message}`);
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
            <h1 className="text-2xl font-bold mb-4 text-center">Edit Agriculture Title Item</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        {...register('title')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter agriculture title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                    >
                        Update Agriculture Title Item
                    </button>
                </div>
            </form>
            <Toaster />
        </div>
    );
}
