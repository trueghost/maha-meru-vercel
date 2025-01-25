"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

function NavbarAdmin({ isSidebarOpen, setIsSidebarOpen }) {
    const router = useRouter();

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        router.push('/');
    };  

    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-2xl font-bold">Maha Meru</div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded lg:hidden"
                >
                    {isSidebarOpen ? 'Close' : 'Open'} Menu
                </button>
                <button onClick={handleLogout} className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded hidden lg:block">
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default NavbarAdmin;
