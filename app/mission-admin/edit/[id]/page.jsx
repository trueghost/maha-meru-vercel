"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function EditMissionItem({ params }) {
    const router = useRouter();
    const { id } = params;
    const [isLoading, setIsLoading] = useState(true);
    const [itemData, setItemData] = useState(null);

    const validationSchema = Yup.object().shape({
        pioneerTitle: Yup.string().required('Pioneer title is required'),
        pioneerSubtitle: Yup.string().required('Pioneer subtitle is required'),
        imageTitle1: Yup.string().required('Image title 1 is required'),
        imageTitle2: Yup.string().required('Image title 2 is required'),
        imageTitle3: Yup.string().required('Image title 3 is required'),
        imageTitle4: Yup.string().required('Image title 4 is required'),
        imageTitle5: Yup.string().required('Image title 5 is required'),
        smallImage1: Yup.mixed().required('Small image 1 is required'),
        smallImage2: Yup.mixed().required('Small image 2 is required'),
        smallImage3: Yup.mixed().required('Small image 3 is required'),
        smallImage4: Yup.mixed().required('Small image 4 is required'),
        image1: Yup.mixed().required('Image 1 is required'),
        image2: Yup.mixed().required('Image 2 is required'),
        image3: Yup.mixed().required('Image 3 is required'),
        image4: Yup.mixed().required('Image 4 is required'),
        image5: Yup.mixed().required('Image 5 is required'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState: { errors }, setValue } = useForm(formOptions);

    useEffect(() => {
        const fetchMissionItem = async () => {
            try {
                const response = await fetch(`/api/mission-admin/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch mission item');
                }
                const data = await response.json();
                // console.log('Fetched Mission Item:', data.data); // Log the fetched data
                setItemData(data.data);

                // Set default values for the form
                if (data.data) {
                    Object.keys(data.data).forEach(key => {
                        setValue(key, data.data[key]);
                    });

                    // Handle file inputs separately if needed (e.g., previewing images)
                    ['smallImage1', 'smallImage2', 'smallImage3', 'smallImage4', 'image1', 'image2', 'image3', 'image4', 'image5']
                        .forEach((field) => {
                            if (data.data[field]) {
                                // You can set the image preview here if needed, for example:
                                // setImagePreview(field, data.data[field]);
                            }
                        });
                }
            } catch (error) {
                console.error('Error fetching mission item:', error);
                toast.error('Failed to load mission item');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMissionItem();
    }, [id, setValue]);

    const onSubmit = async (formData) => {
        const missionData = new FormData();
    
        // Manually append the data for both text and file inputs
        if (formData.smallImage1) {
            missionData.append('smallImage1', formData.smallImage1[0]); // File input
        }
        if (formData.smallImage2) {
            missionData.append('smallImage2', formData.smallImage2[0]); // File input
        }
        if (formData.smallImage3) {
            missionData.append('smallImage3', formData.smallImage3[0]); // File input
        }
        if (formData.smallImage4) {
            missionData.append('smallImage4', formData.smallImage4[0]); // File input
        }
        if (formData.image1) {
            missionData.append('image1', formData.image1[0]); // File input
        }
        if (formData.image2) {
            missionData.append('image2', formData.image2[0]); // File input
        }
        if (formData.image3) {
            missionData.append('image3', formData.image3[0]); // File input
        }
        if (formData.image4) {
            missionData.append('image4', formData.image4[0]); // File input
        }
        if (formData.image5) {
            missionData.append('image5', formData.image5[0]); // File input
        }
    
        // Manually append text values
        if (formData.imageTitle1) {
            missionData.append('imageTitle1', formData.imageTitle1); // Text input
        }
        if (formData.imageTitle2) {
            missionData.append('imageTitle2', formData.imageTitle2); // Text input
        }
        if (formData.imageTitle3) {
            missionData.append('imageTitle3', formData.imageTitle3); // Text input
        }
        if (formData.imageTitle4) {
            missionData.append('imageTitle4', formData.imageTitle4); // Text input
        }
        if (formData.imageTitle5) {
            missionData.append('imageTitle5', formData.imageTitle5); // Text input
        }
        if (formData.pioneerTitle) {
            missionData.append('pioneerTitle', formData.pioneerTitle); // Text input
        }
        if (formData.pioneerSubtitle) {
            missionData.append('pioneerSubtitle', formData.pioneerSubtitle); // Text input
        }
    
        // Log the FormData to see all fields
        // for (let [key, value] of missionData.entries()) {
        //     console.log(`${key}: ${value}`);
        // }
    
        try {
            const response = await fetch(`/api/mission-admin/${id}`, {
                method: 'PUT',
                body: missionData,
            });
    
            if (!response.ok) {
                throw new Error('Failed to update mission item');
            }
    
            toast.success('Mission item updated successfully!');
            router.push('/mission-admin');
        } catch (error) {
            console.error('Error updating mission item:', error);
            toast.error(`Failed to update mission item: ${error.message}`);
        }
    };    

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Edit Mission Item</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">

                {/* Text Inputs */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Pioneer Title</label>
                    <input {...register('pioneerTitle')} className={`mt-1 block w-full px-3 py-2 border ${errors.pioneerTitle ? 'border-red-500' : 'border-gray-300'} text-black rounded-md`} />
                    {errors.pioneerTitle && <p className="text-red-500 text-sm mt-1">{errors.pioneerTitle.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Pioneer Subtitle</label>
                    <input {...register('pioneerSubtitle')} className={`mt-1 block w-full px-3 py-2 border ${errors.pioneerSubtitle ? 'border-red-500' : 'border-gray-300'} text-black rounded-md`} />
                    {errors.pioneerSubtitle && <p className="text-red-500 text-sm mt-1">{errors.pioneerSubtitle.message}</p>}
                </div>

                {/* Image Title Fields */}
                {[1, 2, 3, 4, 5].map(num => (
                    <div key={`imageTitle${num}`}>
                        <label className="block text-sm font-medium text-gray-700">Image Title {num}</label>
                        <input {...register(`imageTitle${num}`)} className={`mt-1 block w-full px-3 py-2 border ${errors[`imageTitle${num}`] ? 'border-red-500' : 'border-gray-300'} text-black rounded-md`} />
                        {errors[`imageTitle${num}`] && <p className="text-red-500 text-sm mt-1">{errors[`imageTitle${num}`].message}</p>}
                    </div>
                ))}

                {/* Small Image Fields */}
                {[1, 2, 3, 4].map(num => (
                    <div key={`smallImage${num}`}>
                        <label className="block text-sm font-medium text-gray-700">Small Image {num}</label>
                        <input type="file" accept="image/*" {...register(`smallImage${num}`)} className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer" />
                        {errors[`smallImage${num}`] && <p className="text-red-500 text-sm mt-1">{errors[`smallImage${num}`].message}</p>}
                    </div>
                ))}

                {/* Main Image Fields */}
                {[1, 2, 3, 4, 5].map(num => (
                    <div key={`image${num}`}>
                        <label className="block text-sm font-medium text-gray-700">Image {num}</label>
                        <input type="file" accept="image/*" {...register(`image${num}`)} className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer" />
                        {errors[`image${num}`] && <p className="text-red-500 text-sm mt-1">{errors[`image${num}`].message}</p>}
                    </div>
                ))}

                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none">
                    Update Mission Item
                </button>
            </form>
            <Toaster />
        </div>
    );
}