"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function AddMissionMobile() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    pioneerTitle: Yup.string().required('Pioneer title is required'),
    pioneerSubtitle: Yup.string().required('Pioneer subtitle is required'),
    logo: Yup.mixed().required('Logo is required'),
    smallLogo: Yup.mixed().required('Small logo is required'),
    smallImage1: Yup.mixed().required('Small image 1 is required'),
    smallImage2: Yup.mixed().required('Small image 2 is required'),
    smallImage3: Yup.mixed().required('Small image 3 is required'),
    smallImage4: Yup.mixed().required('Small image 4 is required'),
    image1: Yup.mixed().required('Image 1 is required'),
    image2: Yup.mixed().required('Image 2 is required'),
    image3: Yup.mixed().required('Image 3 is required'),
    image4: Yup.mixed().required('Image 4 is required'),
    image5: Yup.mixed().required('Image 5 is required'),
    imageTitle1: Yup.string().required('Image title 1 is required'),
    imageTitle2: Yup.string().required('Image title 2 is required'),
    imageTitle3: Yup.string().required('Image title 3 is required'),
    imageTitle4: Yup.string().required('Image title 4 is required'),
    imageTitle5: Yup.string().required('Image title 5 is required'),
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
  
    const missionMobileData = new FormData();
    missionMobileData.append('pioneerTitle', formData.pioneerTitle);
    missionMobileData.append('pioneerSubtitle', formData.pioneerSubtitle);
    missionMobileData.append('logo', formData.logo);
    missionMobileData.append('smallLogo', formData.smallLogo);
    missionMobileData.append('smallImage1', formData.smallImage1);
    missionMobileData.append('smallImage2', formData.smallImage2);
    missionMobileData.append('smallImage3', formData.smallImage3);
    missionMobileData.append('smallImage4', formData.smallImage4);
    missionMobileData.append('image1', formData.image1);
    missionMobileData.append('image2', formData.image2);
    missionMobileData.append('image3', formData.image3);
    missionMobileData.append('image4', formData.image4);
    missionMobileData.append('image5', formData.image5);
    missionMobileData.append('imageTitle1', formData.imageTitle1);
    missionMobileData.append('imageTitle2', formData.imageTitle2);
    missionMobileData.append('imageTitle3', formData.imageTitle3);
    missionMobileData.append('imageTitle4', formData.imageTitle4);
    missionMobileData.append('imageTitle5', formData.imageTitle5);
  
    try {
      const response = await fetch('/api/mission-mobile-admin', {
        method: 'POST',
        body: missionMobileData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(errorData.message || 'Network response was not ok');
      }
  
      toast.success('Mission mobile item added successfully!');
      reset();
      router.push('/mission-mobile-admin');
    } catch (error) {
      toast.error(`Failed to add mission mobile item: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Add New Mission Mobile Item</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Pioneer Title and Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Pioneer Title</label>
            <input
              {...register('pioneerTitle')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.pioneerTitle ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter pioneer title"
            />
            {errors.pioneerTitle && <p className="text-red-500 text-sm mt-1">{errors.pioneerTitle.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pioneer Subtitle</label>
            <input
              {...register('pioneerSubtitle')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.pioneerSubtitle ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter pioneer subtitle"
            />
            {errors.pioneerSubtitle && <p className="text-red-500 text-sm mt-1">{errors.pioneerSubtitle.message}</p>}
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'logo')}
              className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
            />
            {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo.message}</p>}
          </div>

          {/* Small Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Small Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'smallLogo')}
              className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
            />
            {errors.smallLogo && <p className="text-red-500 text-sm mt-1">{errors.smallLogo.message}</p>}
          </div>

          {/* Small Images */}
          {[1, 2, 3, 4].map((i) => (
            <div key={`smallImage${i}`}>
              <label className="block text-sm font-medium text-gray-700">Small Image {i}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, `smallImage${i}`)}
                className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
              />
              {errors[`smallImage${i}`] && <p className="text-red-500 text-sm mt-1">{errors[`smallImage${i}`].message}</p>}
            </div>
          ))}

          {/* Main Images */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={`image${i}`}>
              <label className="block text-sm font-medium text-gray-700">Image {i}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, `image${i}`)}
                className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
              />
              {errors[`image${i}`] && <p className="text-red-500 text-sm mt-1">{errors[`image${i}`].message}</p>}
            </div>
          ))}

          {/* Image Titles */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={`imageTitle${i}`}>
              <label className="block text-sm font-medium text-gray-700">Image Title {i}</label>
              <input
                {...register(`imageTitle${i}`)}
                className={`mt-1 block w-full px-3 py-2 border ${errors[`imageTitle${i}`] ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                placeholder={`Enter image title ${i}`}
              />
              {errors[`imageTitle${i}`] && <p className="text-red-500 text-sm mt-1">{errors[`imageTitle${i}`].message}</p>}
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : 'Add Mission Mobile Item'}
          </button>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
