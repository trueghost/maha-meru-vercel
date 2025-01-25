"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function AddAnimalItem() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animalTitlesItems, setAnimalTitlesItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnimalTitlesItems = async () => {
      try {
        const response = await fetch('/api/animal-titles');
        if (!response.ok) {
          throw new Error('Failed to fetch animal titles items');
        }
        const data = await response.json();
        setAnimalTitlesItems(data.data); // Adjusted based on API response
      } catch (error) {
        console.error('Error fetching animal titles items:', error);
        toast.error('Failed to load animal titles items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimalTitlesItems();
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    animalImage: Yup.mixed().required('Animal image is required'),
    animalSmallImage: Yup.mixed().required('Small image is required'),
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

    const animalData = new FormData();
    animalData.append('title', formData.title);
    animalData.append('description', formData.description);
    animalData.append('animalImage', formData.animalImage);
    animalData.append('animalSmallImage', formData.animalSmallImage);
    animalData.append('section', formData.section);

    try {
      const response = await fetch('/api/animal-admin', {
        method: 'POST',
        body: animalData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      toast.success('Animal item added successfully!');
      reset(); // Reset the form fields
      router.push('/animal-admin'); // Redirect to the appropriate page
    } catch (error) {
      toast.error(`Failed to add animal item: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Add New Animal Item</h1>
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
            <label className="block text-sm font-medium text-gray-700">Animal Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'animalImage')}
              className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
            />
            {errors.animalImage && <p className="text-red-500 text-sm mt-1">{errors.animalImage.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Small Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'animalSmallImage')}
              className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
            />
            {errors.animalSmallImage && <p className="text-red-500 text-sm mt-1">{errors.animalSmallImage.message}</p>}
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
                {animalTitlesItems.map((item) => (
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
              {isSubmitting ? 'Adding...' : 'Add Animal Item'}
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
