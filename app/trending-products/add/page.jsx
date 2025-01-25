"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function AddTrendingProduct() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [categories] = useState(["Agriculture", "Animal", "Aqua"]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [titles, setTitles] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [selectedItem, setSelectedItem] = useState("");
    
    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        subtitle: Yup.string().required('Subtitle is required'),
        content: Yup.string().required('Content is required'),
        image: Yup.mixed().required('Product image is required'),
        link: Yup.string().required('Link is required'), // Added validation for link
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm(formOptions);

      // Fetch data based on the selected category
  const fetchCategoryData = async (category) => {
    setIsLoading(true);
    try {
      const titlesResponse = await fetch(`/api/${category.toLowerCase()}-titles`);
      const itemsResponse = await fetch(`/api/${category.toLowerCase()}-admin`);

      if (!titlesResponse.ok || !itemsResponse.ok) throw new Error("Failed to fetch category data");

      const titlesData = await titlesResponse.json();
      const itemsData = await itemsResponse.json();

      setTitles(titlesData.data);
      setItems(itemsData.data);
    } catch (error) {
      toast.error(`Failed to load ${category} data`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryData(selectedCategory);
    }
  }, [selectedCategory]);
  
// Update link when dropdown values change
useEffect(() => {
    if (selectedTitle && selectedItem) {
      const formattedTitle = selectedTitle.replace(/\s+/g, ""); // Remove whitespace
      const formattedItem = selectedItem.replace(/\s+/g, ""); // Remove whitespace
  
      // Dynamically rename Aqua to Aquatic in the link
      const categoryName = selectedCategory.toLowerCase() === "aqua" ? "aquatic" : selectedCategory.toLowerCase();
  
      const link = `https://illusionsengineering.com/${categoryName}#${formattedTitle}-${formattedItem}`;
      setValue("link", link);
    }
  }, [selectedTitle, selectedItem, selectedCategory, setValue]);  

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue('image', file);
        }
    };

    const onSubmit = async (formData) => {
        setIsSubmitting(true);
    
        const productData = new FormData();
        productData.append('title', formData.title);
        productData.append('subtitle', formData.subtitle);
        productData.append('content', formData.content);
        productData.append('image', formData.image);
        productData.append('link', formData.link); // Added link to FormData
    
        try {
            const response = await fetch('/api/trending-products', {
                method: 'POST',
                body: productData,
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Network response was not ok');
            }
    
            toast.success('Trending product added successfully!');
            reset(); // Reset the form fields
            router.push('/trending-products');
        } catch (error) {
            toast.error(`Failed to add trending product: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };  

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6">
                <h1 className="text-2xl font-bold mb-4 text-center text-black">Add New Trending Application</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            {...register('title')}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                            placeholder="Enter trending product title"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                        <input
                            type="text"
                            {...register('subtitle')}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.subtitle ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                            placeholder="Enter trending product subtitle"
                        />
                        {errors.subtitle && <p className="text-red-500 text-sm mt-1">{errors.subtitle.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea
                            {...register('content')}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.content ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
                            placeholder="Enter trending product content"
                        />
                        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                        />
                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                    </div>

                    <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedTitle("");
              setSelectedItem("");
            }}
            className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Title</label>
              <select
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              >
                <option value="">Select a title</option>
                {titles.map((title) => (
                  <option key={title.id} value={title.title}>
                    {title.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Select Item</label>
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              >
                <option value="">Select an item</option>
                {items
                  .filter((item) => item.section === selectedTitle)
                  .map((filteredItem) => (
                    <option key={filteredItem.id} value={filteredItem.id}>
                      {filteredItem.title}
                    </option>
                  ))}
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Link</label>
          <input
            type="text"
            {...register("link")}
            className={`mt-1 block w-full px-3 py-2 border ${errors.link ? "border-red-500" : "border-gray-300"} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
            placeholder="Enter a valid URL"
          />
          {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link.message}</p>}
        </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent mt-10 rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none`}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Trending Product'}
                        </button>
                    </div>
                </form>
            </div>
            <Toaster />
        </div>
    );
}
