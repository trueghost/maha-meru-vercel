"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function AddAgricultureTitleItem() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState: { errors }, reset } = useForm(formOptions);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    const agricultureData = new FormData();
    agricultureData.append('title', formData.title);

    try {
      const response = await fetch('/api/agriculture-titles', {
        method: 'POST',
        body: agricultureData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      toast.success('Agriculture title added successfully!');
      reset(); // Reset the form fields
      router.push('/agriculture-titles'); // Redirect to the appropriate page
    } catch (error) {
      toast.error(`Failed to add agriculture title: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Add New Agriculture Title</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent mt-10 rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none`}
            >
              {isSubmitting ? 'Adding...' : 'Add Agriculture Title'}
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
