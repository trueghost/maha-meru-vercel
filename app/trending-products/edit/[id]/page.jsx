"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function EditTrendingProduct({ params }) {
    const router = useRouter();
    const { id } = params; // Get the product ID from the URL
    const [isLoading, setIsLoading] = useState(true);
    const [productData, setProductData] = useState(null);

    const [categories] = useState(["Agriculture", "Animal", "Aqua"]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [titles, setTitles] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [selectedItem, setSelectedItem] = useState("");
  
    const validationSchema = Yup.object().shape({
      title: Yup.string().required("Title is required"),
      subtitle: Yup.string().required("Subtitle is required"),
      content: Yup.string().required("Content is required"),
      image: Yup.mixed().required("Product image is required"),
      link: Yup.string().required("Link is required"),
    });
  
    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState: { errors }, setValue } = useForm(formOptions);
  
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

    useEffect(() => {
        const fetchTrendingProduct = async () => {
            try {
                const response = await fetch(`/api/trending-products/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch trending product');
                }
                const data = await response.json();
                setProductData(data.data);
                // Set default values for the form
                setValue('title', data.data.title);
                setValue('subtitle', data.data.subtitle);
                setValue('content', data.data.content);
                setValue('link', data.data.link);
            } catch (error) {
                console.error('Error fetching trending product:', error);
                toast.error('Failed to load trending product');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrendingProduct();
    }, [id, setValue]);

    const onSubmit = async (formData) => {
        const productData = new FormData();
        productData.append('title', formData.title);
        productData.append('subtitle', formData.subtitle);
        productData.append('content', formData.content);
        productData.append('link', formData.link);
        productData.append('image', formData.image[0]); // Only get the first file

        try {
            const response = await fetch(`/api/trending-products/${id}`, {
                method: 'PUT',
                body: productData,
            });

            if (!response.ok) {
                throw new Error('Failed to update trending product');
            }

            toast.success('Trending product updated successfully!');
            router.push('/trending-products');
        } catch (error) {
            console.error('Error updating trending product:', error);
            toast.error(`Failed to update trending product: ${error.message}`);
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
            <h1 className="text-2xl font-bold mb-4 text-center">Edit Trending Application</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">
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
                        {...register('image')}
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
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                    >
                        Update Trending Product
                    </button>
                </div>
            </form>
            <Toaster />
        </div>
    );
}
