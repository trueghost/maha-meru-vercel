"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Protect } from '../components/protect';
import SidebarAdmin from '../common-components/sidebarAdmin';
import NavbarAdmin from '../common-components/navbarAdmin';

export default function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [name, setName] = useState('');

    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            const userObj = JSON.parse(user);
            setName(userObj.firstName);
        }
    }, []);

    return (
        <Protect>
            <div className="min-h-screen flex flex-col">
                <NavbarAdmin 
                    isSidebarOpen={isSidebarOpen} 
                    setIsSidebarOpen={setIsSidebarOpen} 
                />

                <div className="flex flex-1">
                    {isSidebarOpen && (
                        <SidebarAdmin />
                    )}
                    <main className="flex-1 p-6 bg-gray-100">
                        <h1 className="text-3xl font-bold mb-4 text-black">Dashboard</h1>
                        <p className='text-black'>Hi {name}, Welcome to the dashboard!</p>
                    </main>
                </div>
            </div>
        </Protect>
    );
}
