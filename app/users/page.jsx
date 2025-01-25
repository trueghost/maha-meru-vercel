"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Protect } from '../components/protect';
import toast, { Toaster } from 'react-hot-toast';
import SidebarAdmin from '../common-components/sidebarAdmin';
import NavbarAdmin from '../common-components/navbarAdmin';

export default function Users() {
    const [users, setUsers] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                const data = await response.json();
                if (response.ok) {
                    setUsers(data.users);
                } else {
                    console.error('Failed to fetch users:', data.message);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    async function deleteUser(id) {
        setUsers(users.map(x => {
            if (x.id === id) {
                x.isDeleting = true;
            }
            return x;
        }));
    
        try {
            const response = await fetch(`/api/users?id=${id}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                setUsers(users => users.filter(x => x.id !== id));
                toast.success('User deleted successfully');
            } else {
                const data = await response.json();
                console.error('Failed to delete user:', data.message);
                // Remove the isDeleting flag in case of failure
                setUsers(users.map(x => {
                    if (x.id === id) {
                        delete x.isDeleting;
                    }
                    return x;
                }));
                toast.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            // Remove the isDeleting flag in case of error
            setUsers(users.map(x => {
                if (x.id === id) {
                    delete x.isDeleting;
                }
                return x;
            }));
            toast.error('An error occurred while deleting user');
        }
    }

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
                        <h1 className="text-3xl font-bold mb-4 text-black">Users</h1>
                        <Link href="/users/add">
                            <button className="btn btn-sm btn-success mb-2 inline-block bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">Add User</button>
                        </Link>
                        <table className="table-auto w-full bg-white shadow-md rounded overflow-hidden">
                            <thead className="bg-gray-200 text-gray-600">
                                <tr>
                                    <th className="py-2 px-4 text-left" style={{ width: '30%' }}>First Name</th>
                                    <th className="py-2 px-4 text-left" style={{ width: '30%' }}>Last Name</th>
                                    <th className="py-2 px-4 text-left" style={{ width: '30%' }}>Username</th>
                                    <th className="py-2 px-4 text-left" style={{ width: '10%' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users && users.map(user =>
                                    <tr key={user.id} className="border-t text-black">
                                        <td className="py-2 px-4">{user.firstName}</td>
                                        <td className="py-2 px-4">{user.lastName}</td>
                                        <td className="py-2 px-4">{user.username}</td>
                                        <td className="py-2 px-4 whitespace-nowrap">
                                            <Link href={`/users/edit/${user.id}`}>
                                                <button className="btn btn-sm btn-primary me-1 inline-block bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2">Edit</button>
                                            </Link>
                                            <button
                                                onClick={() => deleteUser(user.id)}
                                                className="btn btn-sm btn-danger inline-block bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 relative"
                                                style={{ width: '60px' }}
                                                disabled={user.isDeleting}
                                            >
                                                {user.isDeleting && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-4 h-4 border-2 border-t-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    </div>
                                                )}
                                                {!user.isDeleting && <span>Delete</span>}
                                            </button>
                                        </td>
                                    </tr>
                                )}
                                {!users &&
                                    <tr>
                                        <td colSpan="4" className="py-4 text-center">
                                            <div className="flex justify-center items-center">
                                                <div className="w-8 h-8 border-4 border-t-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                            </div>
                                        </td>
                                    </tr>
                                }
                                {users && !users.length &&
                                    <tr>
                                        <td colSpan="4" className="py-4 text-center text-black">
                                            <div className="p-2">No Users To Display</div>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </main>
                </div>
            </div>
            <Toaster />
        </Protect>
    );
}