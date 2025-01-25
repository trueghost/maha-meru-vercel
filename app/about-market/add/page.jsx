"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function AddAboutMarketItem() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    image: Yup.mixed().required('About image is required'),
    hoverImage: Yup.mixed().required('Hover image is required'), // Updated validation
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm(formOptions);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('image', file);
    }
  };

  const handleHoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('hoverImage', file); // Set hoverImage value
    }
  };

  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    const aboutData = new FormData();
    aboutData.append('title', formData.title);
    aboutData.append('image', formData.image);
    aboutData.append('hoverImage', formData.hoverImage); // Include hoverImage in the form data

    try {
      const response = await fetch('/api/about-market', {
        method: 'POST',
        body: aboutData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      toast.success('About market item added successfully!');
      reset(); // Reset the form fields
      router.push('/about-market'); // Redirect to the appropriate page
    } catch (error) {
      toast.error(`Failed to add about market item: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Add New About Market Item</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <textarea
              {...register('title')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter about market item title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">About Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleHoverImageChange} // Set hoverImage file
              className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
            />
            {errors.hoverImage && <p className="text-red-500 text-sm mt-1">{errors.hoverImage.message}</p>}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent mt-10 rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none`}
            >
              {isSubmitting ? 'Adding...' : 'Add About Market Item'}
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
