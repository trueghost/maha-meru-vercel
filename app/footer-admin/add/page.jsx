"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function AddFooterItem() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const validationSchema = Yup.object().shape({
    imageTitle: Yup.string().required('Image Title is required'),
    exploreTitle: Yup.string().required('Explore Title is required'),
    contactTitle: Yup.string().required('Contact Title is required'),
    location: Yup.string().required('Location is required'),
    number: Yup.string().required('Number is required'),
    mail: Yup.string().email('Invalid email format').required('Email is required'),
    facebookLink: Yup.string().required('Facebook link is required'),
    whatsappLink: Yup.string().required('WhatsApp link is required'),
    twitterLink: Yup.string().required('Twitter link is required'),
    instaLink: Yup.string().required('Instagram link is required'),
    image: Yup.mixed().required('Footer image is required'),
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

    const footerData = new FormData();
    footerData.append('imageTitle', formData.imageTitle);
    footerData.append('exploreTitle', formData.exploreTitle);
    footerData.append('contactTitle', formData.contactTitle);
    footerData.append('location', formData.location);
    footerData.append('number', formData.number);
    footerData.append('mail', formData.mail);
    footerData.append('facebookLink', formData.facebookLink);
    footerData.append('whatsappLink', formData.whatsappLink);
    footerData.append('twitterLink', formData.twitterLink);
    footerData.append('instaLink', formData.instaLink);
    footerData.append('image', formData.image);

    try {
      const response = await fetch('/api/footer-admin', {
        method: 'POST',
        body: footerData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      toast.success('Footer item added successfully!');
      reset(); // Reset the form fields
      router.push('/footer-admin'); // Redirect to the appropriate page
    } catch (error) {
      toast.error(`Failed to add footer item: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Add New Footer Item</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Image Title</label>
            <input
              {...register('imageTitle')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.imageTitle ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter image title"
            />
            {errors.imageTitle && <p className="text-red-500 text-sm mt-1">{errors.imageTitle.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Explore Title</label>
            <input
              {...register('exploreTitle')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.exploreTitle ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter explore title"
            />
            {errors.exploreTitle && <p className="text-red-500 text-sm mt-1">{errors.exploreTitle.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Title</label>
            <input
              {...register('contactTitle')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.contactTitle ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter contact title"
            />
            {errors.contactTitle && <p className="text-red-500 text-sm mt-1">{errors.contactTitle.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              {...register('location')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter location"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number</label>
            <input
              {...register('number')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.number ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter number"
            />
            {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register('mail')}
              type="email"
              className={`mt-1 block w-full px-3 py-2 border ${errors.mail ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter email"
            />
            {errors.mail && <p className="text-red-500 text-sm mt-1">{errors.mail.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Facebook Link</label>
            <input
              {...register('facebookLink')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.facebookLink ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter Facebook link"
            />
            {errors.facebookLink && <p className="text-red-500 text-sm mt-1">{errors.facebookLink.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">WhatsApp Link</label>
            <input
              {...register('whatsappLink')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.whatsappLink ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter WhatsApp link"
            />
            {errors.whatsappLink && <p className="text-red-500 text-sm mt-1">{errors.whatsappLink.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Twitter Link</label>
            <input
              {...register('twitterLink')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.twitterLink ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter Twitter link"
            />
            {errors.twitterLink && <p className="text-red-500 text-sm mt-1">{errors.twitterLink.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Instagram Link</label>
            <input
              {...register('instaLink')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.instaLink ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter Instagram link"
            />
            {errors.instaLink && <p className="text-red-500 text-sm mt-1">{errors.instaLink.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Footer Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
          </div>

          <div className="mt-4 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      <Toaster />
    </div>
  );
}
