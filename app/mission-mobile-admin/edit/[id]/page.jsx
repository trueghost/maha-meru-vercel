"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function EditMissionMobile({ params }) {
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
        logo: Yup.mixed().required('Logo is required'),
        smallLogo: Yup.mixed().required('Small logo is required'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState: { errors }, setValue } = useForm(formOptions);

    useEffect(() => {
        const fetchMissionMobile = async () => {
            try {
                const response = await fetch(`/api/mission-mobile-admin/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch mission mobile item');
                }
                const data = await response.json();
                // console.log('Fetched Mission Mobile Item:', data.data);
                setItemData(data.data);

                if (data.data) {
                    Object.keys(data.data).forEach(key => {
                        setValue(key, data.data[key]);
                    });
                }
            } catch (error) {
                console.error('Error fetching mission mobile item:', error);
                toast.error('Failed to load mission mobile item');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMissionMobile();
    }, [id, setValue]);

    const onSubmit = async (formData) => {
        const missionMobileData = new FormData();
    
        ['smallImage1', 'smallImage2', 'smallImage3', 'smallImage4', 'image1', 'image2', 'image3', 'image4', 'image5', 'logo', 'smallLogo']
            .forEach(field => {
                if (formData[field]) {
                    missionMobileData.append(field, formData[field][0]);
                }
            });
        
        ['imageTitle1', 'imageTitle2', 'imageTitle3', 'imageTitle4', 'imageTitle5', 'pioneerTitle', 'pioneerSubtitle']
            .forEach(field => {
                if (formData[field]) {
                    missionMobileData.append(field, formData[field]);
                }
            });
    
        try {
            const response = await fetch(`/api/mission-mobile-admin/${id}`, {
                method: 'PUT',
                body: missionMobileData,
            });
    
            if (!response.ok) {
                throw new Error('Failed to update mission mobile item');
            }
    
            toast.success('Mission mobile item updated successfully!');
            router.push('/mission-mobile-admin');
        } catch (error) {
            console.error('Error updating mission mobile item:', error);
            toast.error(`Failed to update mission mobile item: ${error.message}`);
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
            <h1 className="text-2xl font-bold mb-4 text-center">Edit Mission Mobile Item</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">
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

                {[1, 2, 3, 4, 5].map(num => (
                    <div key={`imageTitle${num}`}>
                        <label className="block text-sm font-medium text-gray-700">Image Title {num}</label>
                        <input {...register(`imageTitle${num}`)} className={`mt-1 block w-full px-3 py-2 border ${errors[`imageTitle${num}`] ? 'border-red-500' : 'border-gray-300'} text-black rounded-md`} />
                        {errors[`imageTitle${num}`] && <p className="text-red-500 text-sm mt-1">{errors[`imageTitle${num}`].message}</p>}
                    </div>
                ))}

                {[1, 2, 3, 4].map(num => (
                    <div key={`smallImage${num}`}>
                        <label className="block text-sm font-medium text-gray-700">Small Image {num}</label>
                        <input type="file" accept="image/*" {...register(`smallImage${num}`)} className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer" />
                        {errors[`smallImage${num}`] && <p className="text-red-500 text-sm mt-1">{errors[`smallImage${num}`].message}</p>}
                    </div>
                ))}

                {[1, 2, 3, 4, 5].map(num => (
                    <div key={`image${num}`}>
                        <label className="block text-sm font-medium text-gray-700">Image {num}</label>
                        <input type="file" accept="image/*" {...register(`image${num}`)} className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer" />
                        {errors[`image${num}`] && <p className="text-red-500 text-sm mt-1">{errors[`image${num}`].message}</p>}
                    </div>
                ))}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Logo</label>
                    <input type="file" accept="image/*" {...register('logo')} className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer" />
                    {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Small Logo</label>
                    <input type="file" accept="image/*" {...register('smallLogo')} className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer" />
                    {errors.smallLogo && <p className="text-red-500 text-sm mt-1">{errors.smallLogo.message}</p>}
                </div>

                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none">
                    Update Mission Mobile Item
                </button>
            </form>
            <Toaster />
        </div>
    );
}
