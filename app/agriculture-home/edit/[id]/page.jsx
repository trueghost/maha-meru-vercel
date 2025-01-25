"use client";

import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';

export default function EditAgricultureItem({ params }) {
    const router = useRouter();
    const { id } = params; // Get the item ID from the URL
    const [isLoading, setIsLoading] = useState(true);
    const [itemData, setItemData] = useState(null);
    const [wordCount, setWordCount] = useState(0);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        category: Yup.string().required('Category is required'),
        description: Yup.string().required('Description is required')
       
        .test(
          'max-words',
          'Description must not exceed 100 words',
          value => value && value.trim().split(/\s+/).length <= 100
        ),
        link: Yup.string().required('Link is required'), // Validation for link field
        image: Yup.mixed().optional(),
        isMobileImage: Yup.boolean(), // Validation for the checkbox
    });

    const handleWordCount = (e) => {
        const value = e.target.value;
        const words = value.trim().split(/\s+/); // Split by whitespace
        if (words.length <= 100) {
          setWordCount(words.length);
          setValue('description', value); // Update form value
        }
      };

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState: { errors }, setValue } = useForm(formOptions);

    useEffect(() => {
        const fetchAgricultureItem = async () => {
            try {
                const response = await fetch(`/api/agriculture-home-items/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch agriculture item');
                }
                const data = await response.json();
                setItemData(data.data);
                // Set default values for the form
                setValue('title', data.data.title);
                setValue('category', data.data.category);
                setValue('description', data.data.description);
                setValue('link', data.data.link); // Set link value
                setValue('isMobileImage', data.data.is_mobile_image); // Set checkbox value
            } catch (error) {
                console.error('Error fetching agriculture item:', error);
                toast.error('Failed to load agriculture item');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgricultureItem();
    }, [id, setValue]);

    const onSubmit = async (formData) => {
        const agricultureData = new FormData();
        agricultureData.append('title', formData.title);
        agricultureData.append('category', formData.category);
        agricultureData.append('description', formData.description);
        agricultureData.append('link', formData.link); // Include link value
        agricultureData.append('isMobileImage', formData.isMobileImage); // Include checkbox value
        
        if (formData.image) {
            agricultureData.append('image', formData.image[0]); // Only get the first file
        }

        try {
            const response = await fetch(`/api/agriculture-home-items/${id}`, {
                method: 'PUT',
                body: agricultureData,
            });

            if (!response.ok) {
                throw new Error('Failed to update agriculture item');
            }

            toast.success('Agriculture item updated successfully!');
            router.push('/agriculture-home');
        } catch (error) {
            console.error('Error updating agriculture item:', error);
            toast.error(`Failed to update agriculture item: ${error.message}`);
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
            <h1 className="text-2xl font-bold mb-4 text-center">Edit Agriculture Item</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        {...register('title')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter agriculture item title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                        type="text"
                        {...register('category')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter agriculture item category"
                    />
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                </div>

                <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description', {
            required: 'Description is required',
            validate: (value) =>
              value.trim().split(/\s+/).length <= 30 || 'Must not exceed 100 words',
          })}
          onInput={handleWordCount}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          } text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
          placeholder="Enter agriculture item description"
        />
        <p className="text-sm text-gray-500 mt-1">
          {wordCount} / 30 words
        </p>
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Link</label>
                    <input
                        type="url"
                        {...register('link')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.link ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter a valid URL"
                    />
                    {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Agriculture Image (optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register('image')}
                        className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                </div>

                <div>
                    <label className="flex items-center text-sm font-medium text-gray-700">
                        <input
                            type="checkbox"
                            {...register('isMobileImage')}
                            className="mr-2"
                        />
                        Mobile Image
                    </label>
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                    >
                        Update Agriculture Item
                    </button>
                </div>
            </form>
            <Toaster />
        </div>
    );
}
