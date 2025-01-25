"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';

export { EditUser };

function EditUser(props) {
    const user = props?.user;
    const router = useRouter();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        username: Yup.string().required('Username is required'),
        password: Yup.string()
            .transform((x) => (x === '' ? undefined : x))
            .concat(user ? null : Yup.string().required('Password is required'))
            .min(6, 'Password must be at least 6 characters'),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // set default form values if in edit mode
    if (user) {
        formOptions.defaultValues = {
            ...props.user,
            password: '',
        };
    }

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    async function onSubmit(data) {
        try {
            // Create or update user based on user prop
            let message;
            if (user) {
                // Send updated user data to the API handler along with user ID
                const response = await fetch(`/api/users/${user.id}`, { // Fix URL to include user ID
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
    
                // Check if the request was successful
                if (response.ok) {
                    message = 'User updated';
                } else {
                    // Handle different response status codes
                    const responseData = await response.json();
                    throw new Error(responseData.message || 'Failed to update user');
                }
            }
    
            // Redirect to user list with success message
            router.push('/users');
        } catch (error) {
            toast.error(`${error}`);
            console.error(error);
        }
    }    

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8">
            <div className="mb-4">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    First Name
                </label>
                <input
                    name="firstName"
                    type="text"
                    {...register('firstName')}
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${errors.firstName ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                />
                {errors.firstName && (
                    <p className="text-red-500 text-xs italic">{errors.firstName?.message}</p>
                )}
            </div>
            <div className="mb-4">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Last Name
                </label>
                <input
                    name="lastName"
                    type="text"
                    {...register('lastName')}
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${errors.lastName ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                />
                {errors.lastName && (
                    <p className="text-red-500 text-xs italic">{errors.lastName?.message}</p>
                )}
            </div>
            <div className="mb-4">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Username
                </label>
                <input
                    name="username"
                    type="text"
                    {...register('username')}
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${errors.username ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                />
                {errors.username && (
                    <p className="text-red-500 text-xs italic">{errors.username?.message}</p>
                )}
            </div>
            <div className="mb-4">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Password
                    {user && (
                        <em className="text-gray-600 text-xs ml-1">
                            (Leave blank to keep the same password)
                        </em>
                    )}
                </label>
                <input
                    name="password"
                    type="password"
                    {...register('password')}
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                />
                {errors.password && (
                    <p className="text-red-500 text-xs italic">{errors.password?.message}</p>
                )}
            </div>
            <div className="flex flex-col items-center justify-between w-full">
                <button
                    type="submit"
                    disabled={formState.isSubmitting}
                    className="bg-blue-500 hover:bg-blue-700 text-white w-full font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                >
                    {formState.isSubmitting && (
                        <span className="spinner-border spinner-border-sm mr-1"></span>
                    )}
                    Save
                </button>
                <button
                    type="button"
                    onClick={() => reset(formOptions.defaultValues)}
                    disabled={formState.isSubmitting}
                    className="bg-gray-500 hover:bg-gray-700 text-white w-full font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ml-2"
                >
                    Reset
                </button>
                <Link href="/users">
                    <div className="inline-block align-baseline w-full font-bold text-sm text-blue-500 m-2 hover:text-blue-800 ml-2 cursor-pointer transition duration-150 ease-in-out">
                        Cancel
                    </div>
                </Link>
            </div>
            <Toaster />
        </form>
    );
}