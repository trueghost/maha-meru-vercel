"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function EditFormItem({ params }) {
    const router = useRouter();
    const { id } = params; // Get the item ID from the URL
    const [isLoading, setIsLoading] = useState(true);
    const [itemData, setItemData] = useState(null);

    // Updated validation schema
    const validationSchema = Yup.object().shape({
        mobileNumber1: Yup.string().required('Mobile Number 1 is required'),
        mobileNumber2: Yup.string().optional(),
        mail: Yup.string().email('Invalid email format').required('Email is required'),
        location: Yup.string().required('Location is required'),
        facebookUrl: Yup.string().optional(),
        xUrl: Yup.string().optional(),
        instagramUrl: Yup.string().optional(),
        linkedinUrl: Yup.string().optional(),
        whatsappUrl: Yup.string().optional(),
        placeholder1: Yup.string().optional(),
        placeholder2: Yup.string().optional(),
        placeholder3: Yup.string().optional(),
        placeholder4: Yup.string().optional(),
        placeholder5: Yup.string().optional(),
        placeholder6: Yup.string().optional(),
        placeholder7: Yup.string().optional(),
        placeholder8: Yup.string().optional(),
        placeholder9: Yup.string().optional(),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState: { errors }, setValue } = useForm(formOptions);

    useEffect(() => {
        const fetchFormItem = async () => {
            try {
                const response = await fetch(`/api/form-admin/${id}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Error ${response.status}: ${errorData.message || 'Failed to fetch form item'}`);
                }
                const data = await response.json();
                // console.log(data); // Log the response to check its structure
                if (data && data.data) {
                    setItemData(data.data);
    
                    // Set default values for the form, using snake_case to match your database schema
                    setValue('mobileNumber1', data.data.mobile_number_1);
                    setValue('mobileNumber2', data.data.mobile_number_2);
                    setValue('mail', data.data.mail);
                    setValue('location', data.data.location);
                    setValue('facebookUrl', data.data.facebook_url);
                    setValue('xUrl', data.data.x_url);
                    setValue('instagramUrl', data.data.instagram_url);
                    setValue('linkedinUrl', data.data.linkedin_url);
                    setValue('whatsappUrl', data.data.whatsapp_url);
                    setValue('placeholder1', data.data.placeholder_1);
                    setValue('placeholder2', data.data.placeholder_2);
                    setValue('placeholder3', data.data.placeholder_3);
                    setValue('placeholder4', data.data.placeholder_4);
                    setValue('placeholder5', data.data.placeholder_5);
                    setValue('placeholder6', data.data.placeholder_6);
                    setValue('placeholder7', data.data.placeholder_7);
                    setValue('placeholder8', data.data.placeholder_8);
                    setValue('placeholder9', data.data.placeholder_9);
                } else {
                    toast.error('No data found for the form item.');
                }
            } catch (error) {
                console.error('Error fetching form item:', error);
                toast.error(`Failed to load form item: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchFormItem();
    }, [id, setValue]);
    
    const onSubmit = async (formData) => {
        const payload = {
            mobile_number_1: formData.mobileNumber1,
            mobile_number_2: formData.mobileNumber2,
            mail: formData.mail,
            location: formData.location,
            facebook_url: formData.facebookUrl,
            x_url: formData.xUrl,
            instagram_url: formData.instagramUrl,
            linkedin_url: formData.linkedinUrl,
            whatsapp_url: formData.whatsappUrl,
            placeholder_1: formData.placeholder1,
            placeholder_2: formData.placeholder2,
            placeholder_3: formData.placeholder3,
            placeholder_4: formData.placeholder4,
            placeholder_5: formData.placeholder5,
            placeholder_6: formData.placeholder6,
            placeholder_7: formData.placeholder7,
            placeholder_8: formData.placeholder8,
            placeholder_9: formData.placeholder9,
        };
    
        try {
            const response = await fetch(`/api/form-admin/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            // Check if response is not ok and handle it accordingly
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update form item');
            }
    
            const data = await response.json(); // Ensure we can parse the JSON response
            toast.success('Form item updated successfully!');
            router.push('/form-admin');
        } catch (error) {
            console.error('Error updating form item:', error);
            toast.error(`Failed to update form item: ${error.message}`);
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
            <h1 className="text-2xl font-bold mb-4 text-center">Edit Form Item</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">
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
                        className={`mt-1 block w-full px-3 py-2 border ${errors.mobileNumber2 ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter mobile number 2 (optional)"
                    />
                    {errors.mobileNumber2 && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber2.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        {...register('mail')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.mail ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter email"
                    />
                    {errors.mail && <p className="text-red-500 text-sm mt-1">{errors.mail.message}</p>}
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
                        placeholder="Enter Facebook URL (optional)"
                    />
                    {errors.facebookUrl && <p className="text-red-500 text-sm mt-1">{errors.facebookUrl.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">X URL</label>
                    <input
                        type="url"
                        {...register('xUrl')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.xUrl ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter X URL (optional)"
                    />
                    {errors.xUrl && <p className="text-red-500 text-sm mt-1">{errors.xUrl.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Instagram URL</label>
                    <input
                        type="url"
                        {...register('instagramUrl')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.instagramUrl ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter Instagram URL (optional)"
                    />
                    {errors.instagramUrl && <p className="text-red-500 text-sm mt-1">{errors.instagramUrl.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                    <input
                        type="url"
                        {...register('linkedinUrl')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.linkedinUrl ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter LinkedIn URL (optional)"
                    />
                    {errors.linkedinUrl && <p className="text-red-500 text-sm mt-1">{errors.linkedinUrl.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">WhatsApp URL</label>
                    <input
                        type="url"
                        {...register('whatsappUrl')}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.whatsappUrl ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                        placeholder="Enter WhatsApp URL (optional)"
                    />
                    {errors.whatsappUrl && <p className="text-red-500 text-sm mt-1">{errors.whatsappUrl.message}</p>}
                </div>

                {/* Placeholder fields */}
                {[...Array(9).keys()].map((index) => (
                    <div key={index}>
                        <label className="block text-sm font-medium text-gray-700">{`Placeholder ${index + 1}`}</label>
                        <input
                            type="text"
                            {...register(`placeholder${index + 1}`)}
                            className={`mt-1 block w-full px-3 py-2 border ${errors[`placeholder${index + 1}`] ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                            placeholder={`Enter placeholder ${index + 1}`}
                        />
                        {errors[`placeholder${index + 1}`] && (
                            <p className="text-red-500 text-sm mt-1">{errors[`placeholder${index + 1}`].message}</p>
                        )}
                    </div>
                ))}

                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </form>
            <Toaster />
        </div>
    );
}
