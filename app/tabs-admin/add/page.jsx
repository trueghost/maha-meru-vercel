"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function AddTabsAdminItem() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([]); // State to store fetched product data
  const [isLoadingProducts, setIsLoadingProducts] = useState(true); // Loading state for products

  // Validation schema
  const validationSchema = Yup.object().shape({
    tabTitle: Yup.string().required('Title is required'),
    productIds: Yup.array().min(1, 'At least one product ID must be selected').required('Product IDs are required'),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm(formOptions);

  // Fetch product list
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products'); // Adjust API endpoint accordingly
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products); // Assuming the API returns a 'products' array with name and id
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    const tabsAdminData = new FormData();
    tabsAdminData.append('tabTitle', formData.tabTitle);
    tabsAdminData.append('productIds', JSON.stringify(formData.productIds)); // Store productIds as JSON

    try {
      const response = await fetch('/api/tabs-admin', {
        method: 'POST',
        body: tabsAdminData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      toast.success('Tabs item added successfully!');
      reset(); // Reset the form fields
      router.push('/tabs-admin'); // Redirect to the appropriate page
    } catch (error) {
      toast.error(`Failed to add tabs item: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Add New Tabs Admin Item</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tab Title</label>
            <input
              {...register('tabTitle')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.tabTitle ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter tab title"
            />
            {errors.tabTitle && <p className="text-red-500 text-sm mt-1">{errors.tabTitle.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Select Products</label>
            <select
              {...register('productIds')}
              multiple
              className={`mt-1 block w-full px-3 py-2 border ${errors.productIds ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
            >
              {isLoadingProducts ? (
                <option value="" disabled>Loading products...</option>
              ) : (
                products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))
              )}
            </select>
            {errors.productIds && <p className="text-red-500 text-sm mt-1">{errors.productIds.message}</p>}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent mt-10 rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none`}
            >
              {isSubmitting ? 'Adding...' : 'Add Tabs Admin Item'}
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
