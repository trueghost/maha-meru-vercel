"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function AddFormItem() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    mobileNumber1: Yup.string().required('Mobile Number 1 is required'),
    mobileNumber2: Yup.string(),
    email: Yup.string().email('Invalid email').required('Email is required'),
    location: Yup.string().required('Location is required'),
    facebookUrl: Yup.string(), // Removed 'required'
    xUrl: Yup.string(), // Removed 'required'
    instagramUrl: Yup.string(), // Removed 'required'
    linkedinUrl: Yup.string(), // Removed 'required'
    whatsappUrl: Yup.string(), // Removed 'required'
    placeholder_1: Yup.string(),
    placeholder_2: Yup.string(),
    placeholder_3: Yup.string(),
    placeholder_4: Yup.string(),
    placeholder_5: Yup.string(),
    placeholder_6: Yup.string(),
    placeholder_7: Yup.string(),
    placeholder_8: Yup.string(),
    placeholder_9: Yup.string(),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm(formOptions);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
  
    // Create a new FormData object
    const formSubmissionData = new FormData();
    
    // Append each form field to the FormData object
    formSubmissionData.append('mobileNumber1', formData.mobileNumber1);
    formSubmissionData.append('mobileNumber2', formData.mobileNumber2);
    formSubmissionData.append('email', formData.email);
    formSubmissionData.append('location', formData.location);
    formSubmissionData.append('facebookUrl', formData.facebookUrl);
    formSubmissionData.append('xUrl', formData.xUrl);
    formSubmissionData.append('instagramUrl', formData.instagramUrl);
    formSubmissionData.append('linkedinUrl', formData.linkedinUrl);
    formSubmissionData.append('whatsappUrl', formData.whatsappUrl);
    formSubmissionData.append('placeholder_1', formData.placeholder_1);
    formSubmissionData.append('placeholder_2', formData.placeholder_2);
    formSubmissionData.append('placeholder_3', formData.placeholder_3);
    formSubmissionData.append('placeholder_4', formData.placeholder_4);
    formSubmissionData.append('placeholder_5', formData.placeholder_5);
    formSubmissionData.append('placeholder_6', formData.placeholder_6);
    formSubmissionData.append('placeholder_7', formData.placeholder_7);
    formSubmissionData.append('placeholder_8', formData.placeholder_8);
    formSubmissionData.append('placeholder_9', formData.placeholder_9);
  
    try {
      const response = await fetch('/api/form-admin', {
        method: 'POST',
        body: formSubmissionData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }
  
      toast.success('Form item added successfully!');
      reset();
      router.push('/form-admin');
    } catch (error) {
      toast.error(`Failed to add form item: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Add New Form Item</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile Number 1</label>
            <input
              type="text"
              {...register('mobileNumber1')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.mobileNumber1 ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter mobile number 1"
            />
            {errors.mobileNumber1 && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber1.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile Number 2</label>
            <input
              type="text"
              {...register('mobileNumber2')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none sm:text-sm"
              placeholder="Enter mobile number 2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              {...register('location')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter location"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Facebook URL</label>
            <input
              type="url"
              {...register('facebookUrl')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.facebookUrl ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter Facebook URL"
            />
            {errors.facebookUrl && <p className="text-red-500 text-sm mt-1">{errors.facebookUrl.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">X URL</label>
            <input
              type="url"
              {...register('xUrl')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.xUrl ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter X URL"
            />
            {errors.xUrl && <p className="text-red-500 text-sm mt-1">{errors.xUrl.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Instagram URL</label>
            <input
              type="url"
              {...register('instagramUrl')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.instagramUrl ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter Instagram URL"
            />
            {errors.instagramUrl && <p className="text-red-500 text-sm mt-1">{errors.instagramUrl.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
            <input
              type="url"
              {...register('linkedinUrl')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.linkedinUrl ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter LinkedIn URL"
            />
            {errors.linkedinUrl && <p className="text-red-500 text-sm mt-1">{errors.linkedinUrl.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">WhatsApp URL</label>
            <input
              type="url"
              {...register('whatsappUrl')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.whatsappUrl ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter WhatsApp URL"
            />
            {errors.whatsappUrl && <p className="text-red-500 text-sm mt-1">{errors.whatsappUrl.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Placeholder 1</label>
            <input
              type="text"
              {...register('placeholder_1')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none sm:text-sm"
              placeholder="Enter placeholder 1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Placeholder 2</label>
            <input
              type="text"
              {...register('placeholder_2')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none sm:text-sm"
              placeholder="Enter placeholder 2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Placeholder 3</label>
            <input
              type="text"
              {...register('placeholder_3')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none sm:text-sm"
              placeholder="Enter placeholder 3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Placeholder 4</label>
            <input
              type="text"
              {...register('placeholder_4')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none sm:text-sm"
              placeholder="Enter placeholder 4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Placeholder 5</label>
            <input
              type="text"
              {...register('placeholder_5')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none sm:text-sm"
              placeholder="Enter placeholder 5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Placeholder 6</label>
            <input
              type="text"
              {...register('placeholder_6')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none sm:text-sm"
              placeholder="Enter placeholder 6"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Placeholder 7</label>
            <input
              type="text"
              {...register('placeholder_7')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none sm:text-sm"
              placeholder="Enter placeholder 7"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Placeholder 8</label>
            <input
              type="text"
              {...register('placeholder_8')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none sm:text-sm"
              placeholder="Enter placeholder 8"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Placeholder 9</label>
            <input
              type="text"
              {...register('placeholder_9')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none sm:text-sm"
              placeholder="Enter placeholder 9"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Add Item'}
          </button>
        </form>
      </div>
      <Toaster />
    </div>
  );
}