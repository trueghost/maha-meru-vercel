"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState } from 'react';
import { Layout } from '../components/layout';
import toast, { Toaster } from 'react-hot-toast';

export default Register;

function Register() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form validation rules 
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // Get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    async function onSubmit(user) {
        setIsSubmitting(true);
        const formData = {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            password: user.password
        };
    
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Network response was not ok');
            }    

            await response.json();
            router.push('login');
        } catch (error) {
            console.error('Registration failed:', error);
            // Handle errors here
            toast.error(`Registration failed: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Layout>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                    <h4 className="mb-6 text-2xl font-bold text-center text-black">Register</h4>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
                            <input
                                name="firstName"
                                type="text"
                                {...register('firstName')}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.firstName && (
                                <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                name="lastName"
                                type="text"
                                {...register('lastName')}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.lastName && (
                                <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700">Username</label>
                            <input
                                name="username"
                                type="text"
                                {...register('username')}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                                    errors.username ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.username && (
                                <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                            <input
                                name="password"
                                type="password"
                                {...register('password')}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            {isSubmitting ? (
                                <span className="inline-block w-4 h-4 border-2 border-t-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                'Register'
                            )}
                        </button>
                        <div className="mt-4 text-center">
                            <Link href="/" className="text-blue-500 hover:underline">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <Toaster />
        </Layout>
    );
}
