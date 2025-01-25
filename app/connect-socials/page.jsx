"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Protect } from "../components/protect";
import toast, { Toaster } from "react-hot-toast";
import SidebarAdmin from "../common-components/sidebarAdmin";
import NavbarAdmin from "../common-components/navbarAdmin";
import { useRouter } from "next/navigation";

export default function ConnectSocialsHomeAdmin() {
    const router = useRouter();
    const [connectSocials, setConnectSocials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchConnectSocials = async () => {
            try {
                const response = await fetch("/api/connect-socials");
                if (!response.ok) {
                    throw new Error("Failed to fetch connect socials");
                }
                const data = await response.json();
                setConnectSocials(data.data); // Adjusted based on API response
            } catch (error) {
                console.error("Error fetching connect socials:", error);
                toast.error("Failed to load connect socials");
            } finally {
                setIsLoading(false);
            }
        };

        fetchConnectSocials();
    }, []);

    async function deleteConnectSocial(id) {
        try {
            const response = await fetch(`/api/connect-socials/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete connect social");
            }
            setConnectSocials((connectSocials) =>
                connectSocials.filter((social) => social.id !== id)
            );
            toast.success("Connect social deleted successfully");
        } catch (error) {
            console.error("Error deleting connect social:", error);
            toast.error("Failed to delete connect social");
        }
    }

    async function toggleHideStatus(id, currentHideStatus) {
        try {
            const response = await fetch(`/api/connect-socials/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ hide: !currentHideStatus }), // Toggle hide status
            });

            if (!response.ok) {
                throw new Error("Failed to update hide status");
            }

            setConnectSocials((prevSocials) =>
                prevSocials.map((social) =>
                    social.id === id ? { ...social, hide: !currentHideStatus } : social
                )
            );
            toast.success(`Social ${!currentHideStatus ? "hidden" : "visible"} successfully`);
        } catch (error) {
            console.error("Error updating hide status:", error);
            toast.error("Failed to update hide status");
        }
    }

    const handleConnectSocialClick = (socialId) => {
        router.push(`/connect-socials/edit/${socialId}`);
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
                        <h1 className="text-3xl font-bold mb-4 text-black">Connect Socials</h1>
                        <Link href="/connect-socials/add">
                            <button className="btn btn-sm btn-success mb-2 inline-block bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">
                                Add Connect Social
                            </button>
                        </Link>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                                <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                        <th className="py-2 px-4 text-left">Image</th>
                                        <th className="py-2 px-4 text-left">Title</th>
                                        <th className="py-2 px-4 text-left">Category</th>
                                        <th className="py-2 px-4 text-left">Description</th>
                                        <th className="py-2 px-4 text-left">Date</th>
                                        <th className="py-2 px-4 text-left">Link</th>
                                        <th className="py-2 px-4 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="7" className="py-4 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="w-8 h-8 border-4 border-t-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        connectSocials.map((social) => (
                                            <tr
                                                key={social.id}
                                                className="border-t text-black"
                                            >
                                                <td className="py-2 px-4">
                                                    <img
                                                        src={`${social.image_url}`}
                                                        alt={social.title}
                                                        className="w-16 h-16 object-cover"
                                                    />
                                                </td>
                                                <td className="py-2 px-4">{social.title}</td>
                                                <td className="py-2 px-4">{social.category}</td>
                                                <td className="py-2 px-4 truncate max-w-xs">
                                                    {social.description}
                                                </td>
                                                <td className="py-2 px-4">
                                                    {new Date(social.date).toLocaleDateString()}
                                                </td>
                                                <td className="py-2 px-4">
                                                    {social.link ? (
                                                        <a
                                                            href={social.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-500 underline"
                                                        >
                                                            {social.link}
                                                        </a>
                                                    ) : (
                                                        "N/A"
                                                    )}
                                                </td>
                                                <td className="py-2 px-4">
                                                    <button
                                                        onClick={() =>
                                                            toggleHideStatus(
                                                                social.id,
                                                                social.hide
                                                            )
                                                        }
                                                        className={`btn btn-sm ${
                                                            social.hide
                                                                ? "bg-gray-400"
                                                                : "bg-green-500"
                                                        } text-white py-1 px-2 rounded hover:${
                                                            social.hide
                                                                ? "bg-gray-500"
                                                                : "bg-green-600"
                                                        } mr-2`}
                                                    >
                                                        {social.hide
                                                            ? "Unhide"
                                                            : "Hide"}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleConnectSocialClick(
                                                                social.id
                                                            )
                                                        }
                                                        className="btn btn-sm btn-primary me-1 inline-block bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mr-2"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            deleteConnectSocial(social.id)
                                                        }
                                                        className="btn btn-sm btn-danger inline-block bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {!connectSocials.length && !isLoading && (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="py-4 text-center text-black"
                                            >
                                                <div className="p-2">
                                                    Nothing To Display
                                                </div>
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
