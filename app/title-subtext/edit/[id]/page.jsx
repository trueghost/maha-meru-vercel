"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function EditAllTitleAndSubtext({ params }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Updated validation schema using Yup
    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'), // Changed to title
        subtext: Yup.string().required('Subtext is required'), // Changed to subtext
        page_name: Yup.string().required('Page Name is required'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, setValue, formState: { errors } } = useForm(formOptions);

    useEffect(() => {
        if (params.id) {
            const loadData = async () => {
                try {
                    const response = await fetch(`/api/title-subtext/${params.id}`);
                    if (!response.ok) {
                        throw new Error('Failed to load data');
                    }
                    const data = await response.json();
                    setValue('title', data.title); // Use title here
                    setValue('subtext', data.subtext); // Use subtext here
                    setValue('page_name', data.page_name);
                    setIsLoading(false);
                } catch (error) {
                    toast.error('Failed to load data');
                    setIsLoading(false);
                }
            };

            loadData();
        }
    }, [params.id, setValue]);

    const onSubmit = async (formData) => {
        setIsSubmitting(true);
        
        const updateData = {
            title: formData.title, // Use title here
            subtext: formData.subtext, // Use subtext here
            page_name: formData.page_name,
        };

        try {
            const response = await fetch(`/api/title-subtext/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update data');
            }

            toast.success('Data updated successfully!');
            router.push('/title-subtext'); // Redirect to the list after editing
        } catch (error) {
            toast.error(`Failed to update data: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-t-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6">
                <h1 className="text-2xl font-bold mb-4 text-center text-black">Edit Title and Subtext</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            {...register('title')} // Updated to use title
                            className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                            placeholder="Enter title"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Subtext</label>
                        <textarea
                            {...register('subtext')} // Updated to use subtext
                            className={`mt-1 block w-full px-3 py-2 border ${errors.subtext ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                            placeholder="Enter subtext"
                        />
                        {errors.subtext && <p className="text-red-500 text-sm mt-1">{errors.subtext.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Page Name</label>
                        <input
                            type="text"
                            {...register('page_name')}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.page_name ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                            placeholder="Enter page name"
                        />
                        {errors.page_name && <p className="text-red-500 text-sm mt-1">{errors.page_name.message}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent mt-10 rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none`}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Data'}
                        </button>
                    </div>
                </form>
            </div>
            <Toaster />
        </div>
    );
}
