"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function EditTabsAdminItem({ params }) {
    const router = useRouter();
    const { id } = params; // Get the item ID from the URL
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [products, setProducts] = useState([]); // State to store the product list
    const [itemData, setItemData] = useState(null);

    // Validation schema
    const validationSchema = Yup.object().shape({
        tabTitle: Yup.string().required('Title is required'),
        productIds: Yup.array().min(1, 'At least one product ID must be selected').required('Product IDs are required'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState: { errors }, setValue } = useForm(formOptions);

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

    // Fetch tabs admin item data
    useEffect(() => {
        const fetchTabsAdminItem = async () => {
            try {
                const response = await fetch(`/api/tabs-admin/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tabs admin item');
                }
                const data = await response.json();
                setItemData(data.data);
                // Set default values for the form
                setValue('tabTitle', data.data.tabTitle);
                // Ensure productIds is an array, even if stored as a string in the database
                setValue('productIds', Array.isArray(data.data.productIds) ? data.data.productIds : JSON.parse(data.data.productIds)); 
            } catch (error) {
                console.error('Error fetching tabs admin item:', error);
                toast.error('Failed to load tabs admin item');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTabsAdminItem();
    }, [id, setValue]);

    const onSubmit = async (formData) => {
        const tabsAdminData = new FormData();
        tabsAdminData.append('tabTitle', formData.tabTitle);
        tabsAdminData.append('productIds', JSON.stringify(formData.productIds)); // Store productIds as JSON

        try {
            const response = await fetch(`/api/tabs-admin/${id}`, {
                method: 'PUT',
                body: tabsAdminData,
            });

            if (!response.ok) {
                throw new Error('Failed to update tabs admin item');
            }

            toast.success('Tabs admin item updated successfully!');
            router.push('/tabs-admin');
        } catch (error) {
            console.error('Error updating tabs admin item:', error);
            toast.error(`Failed to update tabs admin item: ${error.message}`);
        }
    };

    if (isLoading || isLoadingProducts) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loader"></div> {/* Add your loading spinner here */}
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Edit Tabs Admin Item</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4">
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
                        {products.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                    {errors.productIds && <p className="text-red-500 text-sm mt-1">{errors.productIds.message}</p>}
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                    >
                        Update Tabs Admin Item
                    </button>
                </div>
            </form>
            <Toaster />
        </div>
    );
}
