"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function AddTitleAndSubtext() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation schema using Yup
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    subtext: Yup.string().required('Subtext is required'),
    page_name: Yup.string().required('Page Name is required'),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState: { errors } } = useForm(formOptions);

  // Handle form submission
  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    const titleAndSubtextData = {
      title: formData.title,
      subtext: formData.subtext,
      page_name: formData.page_name,
    };

    try {
      const response = await fetch('/api/title-subtext', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(titleAndSubtextData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      toast.success('Title and Subtext added successfully!');
      router.push('/title-subtext'); // Redirect after adding
    } catch (error) {
      toast.error(`Failed to add title and subtext: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Add New Title and Subtext</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              {...register('title')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subtext</label>
            <textarea
              {...register('subtext')}
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
              {isSubmitting ? 'Adding...' : 'Add Title and Subtext'}
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
