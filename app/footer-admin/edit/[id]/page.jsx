"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function EditFooterItem({ params }) {
    const router = useRouter();
    const { id } = params; // Get the item ID from the URL
    const [isLoading, setIsLoading] = useState(true);
    const [itemData, setItemData] = useState(null);

    const validationSchema = Yup.object().shape({
        image: Yup.mixed().required('Footer image is required'),
        image_title: Yup.string().required('Image title is required'),
        explore_title: Yup.string().required('Explore title is required'),
        contact_title: Yup.string().required('Contact title is required'),
        location: Yup.string().required('Location is required'),
        number: Yup.string().required('Phone number is required'),
        mail: Yup.string().email('Invalid email').required('Email is required'),
        facebook_link: Yup.string().optional(),
        whatsapp_link: Yup.string().optional(),
        twitter_link: Yup.string().optional(),
        insta_link: Yup.string().optional(),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState: { errors }, setValue } = useForm(formOptions);

    useEffect(() => {
        const fetchFooterItem = async () => {
            try {
                const response = await fetch(`/api/footer-admin/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch footer item');
                }
                const data = await response.json();
                setItemData(data.data);

                // console.log(data.data)
                // Set default values for the form
                setValue('image_title', data.data.image_title);
                setValue('explore_title', data.data.explore_title);
                setValue('contact_title', data.data.contact_title);
                setValue('location', data.data.location);
                setValue('number', data.data.number);
                setValue('mail', data.data.mail);
                setValue('facebook_link', data.data.facebook_link);
                setValue('whatsapp_link', data.data.whatsapp_link);
                setValue('twitter_link', data.data.twitter_link);
                setValue('insta_link', data.data.insta_link);
            } catch (error) {
                console.error('Error fetching footer item:', error);
                toast.error('Failed to load footer item');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFooterItem();
    }, [id, setValue]);

    const onSubmit = async (formData) => {
        const footerData = new FormData();
        footerData.append('image_title', formData.image_title);
        footerData.append('explore_title', formData.explore_title);
        footerData.append('contact_title', formData.contact_title);
        footerData.append('location', formData.location);
        footerData.append('number', formData.number);
        footerData.append('mail', formData.mail);
        footerData.append('facebook_link', formData.facebook_link);
        footerData.append('whatsapp_link', formData.whatsapp_link);
        footerData.append('twitter_link', formData.twitter_link);
        footerData.append('insta_link', formData.insta_link);
        
        if (formData.image) {
            footerData.append('image', formData.image[0]); // Only get the first file
        }

        try {
            const response = await fetch(`/api/footer-admin/${id}`, {  // Updated API endpoint
                method: 'PUT',
                body: footerData,
            });

            if (!response.ok) {
                throw new Error('Failed to update footer item');
            }

            toast.success('Footer item updated successfully!');
            router.push('/footer-admin');
        } catch (error) {
            console.error('Error updating footer item:', error);
            toast.error(`Failed to update footer item: ${error.message}`);
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
            <h1 className="text-2xl font-bold mb-4 text-center">Edit Footer Item</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Image Title</label>
                    <input
                        {...register('image_title')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.image_title ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter image title"
                    />
                    {errors.image_title && <p className="text-red-500 text-sm mt-1">{errors.image_title.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Explore Title</label>
                    <input
                        {...register('explore_title')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.explore_title ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter explore title"
                    />
                    {errors.explore_title && <p className="text-red-500 text-sm mt-1">{errors.explore_title.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Title</label>
                    <input
                        {...register('contact_title')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.contact_title ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter contact title"
                    />
                    {errors.contact_title && <p className="text-red-500 text-sm mt-1">{errors.contact_title.message}</p>}
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
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        {...register('number')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.number ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter phone number"
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
                        {...register('facebook_link')}
                        type="url"
                        className={`mt-1 block w-full px-3 py-2 border ${errors.facebook_link ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter Facebook link"
                    />
                    {errors.facebook_link && <p className="text-red-500 text-sm mt-1">{errors.facebook_link.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Whatsapp Link</label>
                    <input
                        {...register('whatsapp_link')}
                        type="url"
                        className={`mt-1 block w-full px-3 py-2 border ${errors.whatsapp_link ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter Whatsapp link"
                    />
                    {errors.whatsapp_link && <p className="text-red-500 text-sm mt-1">{errors.whatsapp_link.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Twitter Link</label>
                    <input
                        {...register('twitter_link')}
                        type="url"
                        className={`mt-1 block w-full px-3 py-2 border ${errors.twitter_link ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter Twitter link"
                    />
                    {errors.twitter_link && <p className="text-red-500 text-sm mt-1">{errors.twitter_link.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Instagram Link</label>
                    <input
                        {...register('insta_link')}
                        type="url"
                        className={`mt-1 block w-full px-3 py-2 border ${errors.insta_link ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter Instagram link"
                    />
                    {errors.insta_link && <p className="text-red-500 text-sm mt-1">{errors.insta_link.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <input
                        type="file"
                        {...register('image')}
                        className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer"
                    />
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                </div>

                <div className="flex justify-between mt-4">
                    <button type="submit" className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-700">
                        {isLoading ? 'Updating...' : 'Update Footer'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/footer-admin')}
                        className="bg-gray-300 text-black py-2 px-6 rounded-md hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                </div>
            </form>
            <Toaster />
        </div>
    );
}
