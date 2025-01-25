"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function AddMissionItem() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    pioneerTitle: Yup.string().required('Pioneer title is required'),
    pioneerSubtitle: Yup.string().required('Pioneer subtitle is required'),
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

    const missionData = new FormData();
    missionData.append('pioneerTitle', formData.pioneerTitle);
    missionData.append('pioneerSubtitle', formData.pioneerSubtitle);
    missionData.append('smallImage1', formData.smallImage1);
    missionData.append('smallImage2', formData.smallImage2);
    missionData.append('smallImage3', formData.smallImage3);
    missionData.append('smallImage4', formData.smallImage4);
    missionData.append('image1', formData.image1);
    missionData.append('image2', formData.image2);
    missionData.append('image3', formData.image3);
    missionData.append('image4', formData.image4);
    missionData.append('image5', formData.image5);
    missionData.append('imageTitle1', formData.imageTitle1);
    missionData.append('imageTitle2', formData.imageTitle2);
    missionData.append('imageTitle3', formData.imageTitle3);
    missionData.append('imageTitle4', formData.imageTitle4);
    missionData.append('imageTitle5', formData.imageTitle5);

    try {
      const response = await fetch('/api/mission-admin', {
        method: 'POST',
        body: missionData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      toast.success('Mission item added successfully!');
      reset();
      router.push('/mission-admin');
    } catch (error) {
      toast.error(`Failed to add mission item: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Add New Mission Item</h1>
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

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent mt-10 rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none`}
            >
              {isSubmitting ? 'Adding...' : 'Add Mission Item'}
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
