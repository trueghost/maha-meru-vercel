"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function AddAgricultureItem() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agricultureTitlesItems, setAgricultureTitlesItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAgricultureTitlesItems = async () => {
      try {
        const response = await fetch('/api/agriculture-titles');
        if (!response.ok) {
          throw new Error('Failed to fetch agriculture titles items');
        }
        const data = await response.json();
        setAgricultureTitlesItems(data.data); // Adjusted based on API response
      } catch (error) {
        console.error('Error fetching agriculture titles items:', error);
        toast.error('Failed to load agriculture titles items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgricultureTitlesItems();
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    plantImage: Yup.mixed().required('Plant image is required'),
    plantSmallImage: Yup.mixed().required('Small image is required'),
    section: Yup.string().required('Section is required'),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm(formOptions);

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setValue(field, file);
    }
  };

  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    const agricultureData = new FormData();
    agricultureData.append('title', formData.title);
    agricultureData.append('description', formData.description);
    agricultureData.append('plantImage', formData.plantImage);
    agricultureData.append('plantSmallImage', formData.plantSmallImage);
    agricultureData.append('section', formData.section);

    try {
      const response = await fetch('/api/agriculture-admin', {
        method: 'POST',
        body: agricultureData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      toast.success('Agriculture item added successfully!');
      reset(); // Reset the form fields
      router.push('/agriculture-admin'); // Redirect to the appropriate page
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
              {...register('title')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter item title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter item description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Plant Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'plantImage')}
              className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
            />
            {errors.plantImage && <p className="text-red-500 text-sm mt-1">{errors.plantImage.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Small Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'plantSmallImage')}
              className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
            />
            {errors.plantSmallImage && <p className="text-red-500 text-sm mt-1">{errors.plantSmallImage.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Section</label>
            {isLoading ? (
              <p className="text-gray-500">Loading sections...</p>
            ) : (
              <select
                {...register('section')}
                className={`mt-1 block w-full px-3 py-2 border ${errors.section ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              >
                <option value="">Select a section</option>
                {agricultureTitlesItems.map((item) => (
                  <option key={item.id} value={item.title}>{item.title}</option>
                ))}
              </select>
            )}
            {errors.section && <p className="text-red-500 text-sm mt-1">{errors.section.message}</p>}
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
