"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function EditCustomerStory({ params }) {
    const router = useRouter();
    const { id } = params; // Get the customer story ID from the URL
    const [isLoading, setIsLoading] = useState(true);
    const [storyData, setStoryData] = useState(null);

    const validationSchema = Yup.object().shape({
        image: Yup.mixed().required('Image is required'),
        review: Yup.string().required('Review is required'),
        name: Yup.string().required('Name is required'),
        role: Yup.string().required('Role is required'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState: { errors }, setValue } = useForm(formOptions);

    useEffect(() => {
        const fetchCustomerStory = async () => {
            try {
                const response = await fetch(`/api/customer-admin/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch customer story');
                }
                const data = await response.json();
                setStoryData(data.data);
                // Set default values for the form
                setValue('image', data.data.image);
                setValue('review', data.data.review);
                setValue('name', data.data.name);
                setValue('role', data.data.role);
            } catch (error) {
                console.error('Error fetching customer story:', error);
                toast.error('Failed to load customer story');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCustomerStory();
    }, [id, setValue]);

    const onSubmit = async (formData) => {
        const customerStoryData = new FormData();
        customerStoryData.append('image', formData.image[0]); // Only get the first file
        customerStoryData.append('review', formData.review);
        customerStoryData.append('name', formData.name);
        customerStoryData.append('role', formData.role);

        try {
            const response = await fetch(`/api/customer-admin/${id}`, {
                method: 'PUT',
                body: customerStoryData,
            });

            if (!response.ok) {
                throw new Error('Failed to update customer story');
            }

            toast.success('Customer story updated successfully!');
            router.push('/customer-admin');
        } catch (error) {
            console.error('Error updating customer story:', error);
            toast.error(`Failed to update customer story: ${error.message}`);
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
            <h1 className="text-2xl font-bold mb-4 text-center">Edit Customer Story</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register('image')}
                        className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Review</label>
                    <textarea
                        {...register('review')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.review ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter customer review"
                    />
                    {errors.review && <p className="text-red-500 text-sm mt-1">{errors.review.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        {...register('name')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter customer name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <input
                        type="text"
                        {...register('role')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.role ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter customer role"
                    />
                    {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                    >
                        Update Customer Story
                    </button>
                </div>
            </form>
            <Toaster />
        </div>
    );
}
