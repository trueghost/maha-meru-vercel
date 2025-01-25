"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export { Protect };

function Protect({ children }) {
    const router = useRouter();

    useEffect(() => {
        // Check if user is present in localStorage
        const user = sessionStorage.getItem('user');
        if (!user) {
            // User is present, redirect to home
            router.push('/');
        }
    }, [router]);

    return (
    <div>
        {children}
    </div>
    );
}