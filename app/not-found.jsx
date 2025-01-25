import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-banner min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#193048] text-white rounded-md"
      >
        Go Back Home
      </Link>
    </div>
  );
}
