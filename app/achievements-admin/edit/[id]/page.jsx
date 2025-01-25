"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function EditAchievementsItem({ params }) {
    const router = useRouter();
    const { id } = params; // Get the item ID from the URL
    const [isLoading, setIsLoading] = useState(true);
    const [itemData, setItemData] = useState(null);

    const validationSchema = Yup.object().shape({
        image: Yup.mixed().required('Achievement image is required'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState: { errors }, setValue } = useForm(formOptions);

    useEffect(() => {
        const fetchAchievementsItem = async () => {
            try {
                const response = await fetch(`/api/achievements-admin/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch achievement item');
                }
                const data = await response.json();
                setItemData(data.data);
                // Set default values for the form
                setValue('image', data.data.image); // Set image value
            } catch (error) {
                console.error('Error fetching achievement item:', error);
                toast.error('Failed to load achievement item');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAchievementsItem();
    }, [id, setValue]);

    const onSubmit = async (formData) => {
        const achievementsData = new FormData();
        if (formData.image) {
            achievementsData.append('image', formData.image[0]); // Only get the first file
        }

        try {
            const response = await fetch(`/api/achievements-admin/${id}`, {
                method: 'PUT',
                body: achievementsData,
            });

            if (!response.ok) {
                throw new Error('Failed to update achievement item');
            }

            toast.success('Achievement item updated successfully!');
            router.push('/achievements-admin');
        } catch (error) {
            console.error('Error updating achievement item:', error);
            toast.error(`Failed to update achievement item: ${error.message}`);
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
            <h1 className="text-2xl font-bold mb-4 text-center">Edit Achievement Item</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Achievement Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register('image')}
                        className={`mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer ${errors.image ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                    >
                        Update Achievement Item
                    </button>
                </div>
            </form>
            <Toaster />
        </div>
    );
}
