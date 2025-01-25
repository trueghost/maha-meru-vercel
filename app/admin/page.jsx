import Link from 'next/link';

export default function Page() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-bold mb-4 text-black'>
          Welcome to Maha Meru Admin Dashboard
        </h1>
        <p className='text-lg text-black'>
          Please choose an option below to continue:
        </p>
      </div>
      <div className='flex space-x-4'>
        <Link href='/login'>
          <button className='px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'>
            Login
          </button>
        </Link>
        <Link href='/signup'>
          <button className='px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'>
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
