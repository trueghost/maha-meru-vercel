"use client";

import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';

export default function AddAgricultureHomeItem() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileImage, setIsMobileImage] = useState(false);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    category: Yup.string().required('Category is required'),
    description: Yup.string().required('Description is required')
    .test(
      'max-words',
      'Description must not exceed 100 words',
      value => value && value.trim().split(/\s+/).length <= 100
    ),
    link: Yup.string().required('Link is required'),
    image: Yup.mixed().required('Agriculture image is required'),
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
  
    const agricultureData = new FormData();
    agricultureData.append('title', formData.title);
    agricultureData.append('category', formData.category);
    agricultureData.append('description', formData.description);
    agricultureData.append('link', formData.link);
    agricultureData.append('image', formData.image);
    agricultureData.append('isMobileImage', isMobileImage);
  
    try {
      const response = await fetch('/api/agriculture-home-items', {
        method: 'POST',
        body: agricultureData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }
  
      toast.success('Agriculture item added successfully!');
      reset(); // Reset the form fields
      router.push('/agriculture-home');
    } catch (error) {
      toast.error(`Failed to add agriculture item: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Add New Agriculture Item</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              {...register('description')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter agriculture item description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Link</label>
            <input
              type="url"
              {...register('link')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.link ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter URL link"
            />
            {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Agriculture Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
          </div>

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="mobileImage"
              checked={isMobileImage}
              onChange={(e) => setIsMobileImage(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="mobileImage" className="text-sm text-gray-700">Mobile Image</label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent mt-10 rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none`}
            >
              {isSubmitting ? 'Adding...' : 'Add Agriculture Item'}
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
