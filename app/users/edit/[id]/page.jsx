"use client";

import { useEffect, useState } from 'react';
import { EditUser } from '../../../components/editUser';
import toast, { Toaster } from 'react-hot-toast';
import { Protect } from '../../../components/protect';

export default function Edit() {
    const [id, setId] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParts = window.location.pathname.split('/');
            const userId = urlParts[urlParts.length - 1];
            setId(userId);
        }
    }, []);

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        // Fetch user data by sending ID to the API endpoint
        fetch(`/api/users/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                return response.json();
            })
            .then(data => {
                setUser(data.user);
                setLoading(false);
            })
            .catch(error => {
                toast.error(`${error.message}`);
                setLoading(false);
            });
    }, [id]);

    // console.log(id);

    return (
        <Protect>
            {user ? (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-100 flex justify-center items-center">
                <EditUser user={user} />
                </div>
            ) : (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-100 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black"></div>
                </div>
            )}
        <Toaster />
        </Protect>
    );
}