"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Protect } from '../components/protect';
import toast, { Toaster } from 'react-hot-toast';
import SidebarAdmin from '../common-components/sidebarAdmin';
import NavbarAdmin from '../common-components/navbarAdmin';
import { useRouter } from 'next/navigation';

export default function AchievementsHomeAdmin() {
    const router = useRouter();
    const [achievements, setAchievements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const response = await fetch('/api/achievements-admin');
                if (!response.ok) {
                    throw new Error('Failed to fetch achievements');
                }
                const data = await response.json();
                setAchievements(data.data);
            } catch (error) {
                console.error('Error fetching achievements:', error);
                toast.error('Failed to load achievements');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    async function deleteAchievement(id) {
        try {
            const response = await fetch(`/api/achievements-admin/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete achievement');
            }
            setAchievements((prevAchievements) => prevAchievements.filter((achievement) => achievement.id !== id));
            toast.success('Achievement deleted successfully');
        } catch (error) {
            console.error('Error deleting achievement:', error);
            toast.error('Failed to delete achievement');
        }
    }

    async function toggleHideStatus(id, currentHideStatus) {
        try {
            const response = await fetch(`/api/achievements-admin/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ hide: !currentHideStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update hide status');
            }

            setAchievements((prevAchievements) =>
                prevAchievements.map((achievement) =>
                    achievement.id === id ? { ...achievement, hide: !currentHideStatus } : achievement
                )
            );
            toast.success(`Achievement ${!currentHideStatus ? 'hidden' : 'visible'} successfully`);
        } catch (error) {
            console.error('Error updating hide status:', error);
            toast.error('Failed to update hide status');
        }
    }

    const handleAchievementClick = (achievementId) => {
        router.push(`/achievements-admin/edit/${achievementId}`);
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
                        <h1 className="text-3xl font-bold mb-4 text-black">Achievements</h1>
                        <Link href="/achievements-admin/add">
                            <button className="btn btn-sm btn-success mb-2 inline-block bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">
                                Add Achievement
                            </button>
                        </Link>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="py-2 px-4 text-left">Image</th>
                                        <th className="py-2 px-4 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="2" className="py-4 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="w-8 h-8 border-4 border-t-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        achievements.map((achievement) => (
                                            <tr key={achievement.id} className="border-t text-black">
                                                <td className="py-2 px-4">
                                                    <img src={`${achievement.image}`} alt="Achievement Image" className="w-16 h-16 object-cover" />
                                                </td>
                                                <td className="py-2 px-4">
                                                    <button
                                                        className={`btn btn-sm me-2 inline-block py-1 px-2 rounded ${
                                                            achievement.hide
                                                                ? 'bg-gray-400 text-white hover:bg-gray-500'
                                                                : 'bg-green-500 text-white hover:bg-green-600'
                                                        }`}
                                                        onClick={() => toggleHideStatus(achievement.id, achievement.hide)}
                                                    >
                                                        {achievement.hide ? 'Unhide' : 'Hide'}
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-primary me-1 inline-block bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2"
                                                        onClick={() => handleAchievementClick(achievement.id)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteAchievement(achievement.id)}
                                                        className="btn btn-sm btn-danger inline-block bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {!achievements.length && !isLoading && (
                                        <tr>
                                            <td colSpan="2" className="py-4 text-center text-black">
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
