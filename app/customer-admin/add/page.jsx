"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function AddCustomerStory() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validationSchema = Yup.object().shape({
        image: Yup.mixed().required('Image is required'),
        review: Yup.string().required('Review is required'),
        name: Yup.string().required('Name is required'),
        role: Yup.string().required('Role is required'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm(formOptions);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue('image', file);
        }
    };

    const onSubmit = async (formData) => {
        setIsSubmitting(true);

        const storyData = new FormData();
        storyData.append('image', formData.image);
        storyData.append('review', formData.review);
        storyData.append('name', formData.name);
        storyData.append('role', formData.role);

        try {
            const response = await fetch('/api/customer-admin', {
                method: 'POST',
                body: storyData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Network response was not ok');
            }

            toast.success('Customer story added successfully!');
            reset();
            router.push('/customer-admin');
        } catch (error) {
            toast.error(`Failed to add customer story: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6">
                <h1 className="text-2xl font-bold mb-4 text-center text-black">Add Customer Story</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
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
                            disabled={isSubmitting}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent mt-10 rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none`}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Customer Story'}
                        </button>
                    </div>
                </form>
            </div>
            <Toaster />
        </div>
    );
}
