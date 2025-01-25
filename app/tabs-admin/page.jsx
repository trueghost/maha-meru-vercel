"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Protect } from '../components/protect';
import toast, { Toaster } from 'react-hot-toast';
import SidebarAdmin from '../common-components/sidebarAdmin';
import NavbarAdmin from '../common-components/navbarAdmin';
import { useRouter } from 'next/navigation';

export default function TabsAdminHome() {
    const router = useRouter();
    const [tabsItems, setTabsItems] = useState([]);
    const [products, setProducts] = useState([]); // To store product data
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchTabsItems = async () => {
            try {
                const response = await fetch('/api/tabs-admin');
                if (!response.ok) {
                    throw new Error('Failed to fetch tabs items');
                }
                const data = await response.json();
                setTabsItems(data.data); // Assuming response has tabs data
            } catch (error) {
                console.error('Error fetching tabs items:', error);
                toast.error('Failed to load tabs items');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTabsItems();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products'); // Adjust the endpoint to get products
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data.products); // Assuming the API returns a list of products
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Failed to load products');
            }
        };

        fetchProducts();
    }, []);

    const deleteTabsItem = async (tabId) => {
        try {
            const response = await fetch(`/api/tabs-admin/${tabId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete tabs item');
            }
            setTabsItems((items) => items.filter(item => item.id !== tabId)); // Use tab id for filtering
            toast.success('Tabs item deleted successfully');
        } catch (error) {
            console.error('Error deleting tabs item:', error);
            toast.error('Failed to delete tabs item');
        }
    };

    const handleTabsItemClick = (tabId) => {
        router.push(`/tabs-admin/edit/${tabId}`); // Edit tab by its id
    };

    const getProductNamesByIds = (productIds) => {
        // Ensure productIds is an array, parse it if necessary
        const productIdsArray = Array.isArray(productIds) ? productIds : JSON.parse(productIds);

        // Normalize the productIds to integers, assuming product.id is a number
        const normalizedProductIds = productIdsArray.map(id => Number(id));

        // Find the names of products from the products list based on the productIds
        const linkedProducts = products.filter(product => 
            normalizedProductIds.includes(Number(product.id)) // Ensure product.id is also treated as a number
        );

        return linkedProducts.map(product => product.name).join(', ');
    };

    return (
        <Protect>
            <div className="min-h-screen flex flex-col bg-gray-100">
                <NavbarAdmin 
                    isSidebarOpen={isSidebarOpen} 
                    setIsSidebarOpen={setIsSidebarOpen} 
                />
                <div className="flex flex-1">
                    {isSidebarOpen && <SidebarAdmin />}
                    <div className="flex-grow p-6">
                        <h1 className="text-3xl font-bold mb-4 text-black">Tags Admin</h1>
                        <Link href="/tabs-admin/add">
                            <button className="btn btn-sm btn-success mb-2 inline-block bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">
                                Add Tags Item
                            </button>
                        </Link>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="py-2 px-4 text-left">Title</th>
                                        <th className="py-2 px-4 text-left">Linked Products</th>
                                        <th className="py-2 px-4 text-left"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="3" className="py-4 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="w-8 h-8 border-4 border-t-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        tabsItems.map(item => (
                                            <tr key={item.id} className="border-t text-black">
                                                <td className="py-2 px-4 truncate max-w-xs">{item.tabTitle}</td>
                                                <td className="py-2 px-4">
                                                    {/* Displaying linked products */}
                                                    {getProductNamesByIds(item.productIds)}
                                                </td>
                                                <td className="py-2 px-4">
                                                    <button 
                                                        className="btn btn-sm btn-primary me-1 inline-block bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2" 
                                                        onClick={() => handleTabsItemClick(item.id)} // Use tab id for editing
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteTabsItem(item.id)} // Use tab id for deleting
                                                        className="btn btn-sm btn-danger inline-block bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {!tabsItems.length && !isLoading && (
                                        <tr>
                                            <td colSpan="3" className="py-4 text-center text-black">
                                                <div className="p-2">Nothing To Display</div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </Protect>
    );
}
