"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function AddAboutPartnerForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    file: Yup.mixed().required('File is required'),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm(formOptions);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('file', file);
    }
  };

  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    const partnerData = new FormData();
    partnerData.append('file', formData.file);

    try {
      const response = await fetch('/api/about-partner-form', { // Updated endpoint
        method: 'POST',
        body: partnerData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      toast.success('About Partner item added successfully!');
      reset(); // Reset the form fields
      router.push('/about-partner-form'); // Updated redirection path
    } catch (error) {
      toast.error(`Failed to add About Partner item: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Add New Connect Partner Item</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">File</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
            />
            {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent mt-10 rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none`}
            >
              {isSubmitting ? 'Adding...' : 'Add Connect Partner Item'}
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
