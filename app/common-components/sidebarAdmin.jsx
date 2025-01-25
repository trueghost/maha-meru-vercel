'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function SidebarAdmin({ totalItems1, totalItems2, totalItems3 }) {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-md lg:block">
      <div className="p-4 font-bold text-lg border-b text-black">Menu</div>
      <ul>
        <Link href="/dashboard" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/dashboard' ? 'bg-gray-100' : ''}`}>
            Home
          </li>
        </Link>
        <Link href="/users" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/users' ? 'bg-gray-100' : ''}`}>
            Users
          </li>
        </Link>
        <Link href="/banner-admin" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/banner-admin' ? 'bg-gray-100' : ''}`}>
            Banner
          </li>
        </Link>
        <Link href="/form-handle" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/form-handle' ? 'bg-gray-100' : ''}`}>
            Form Data
            {totalItems1 ? ` - ${totalItems1}` : null} {/* Fixed the conditional rendering */}
          </li>
        </Link>
        <Link href="/connect-form-handle" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/connect-form-handle' ? 'bg-gray-100' : ''}`}>
            Connect Form Data
            {totalItems2 ? ` - ${totalItems2}` : null} {/* Fixed the conditional rendering */}
          </li>
        </Link>
        <Link href="/product-form-handle" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/product-form-handle' ? 'bg-gray-100' : ''}`}>
            Product Form Data
            {totalItems3 ? ` - ${totalItems3}` : null} {/* Fixed the conditional rendering */}
          </li>
        </Link>
        <Link href="/mission-admin" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/mission-admin' ? 'bg-gray-100' : ''}`}>
            Mission
          </li>
        </Link>
        <Link href="/mission-mobile-admin" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/mission-mobile-admin' ? 'bg-gray-100' : ''}`}>
            Mission Mobile
          </li>
        </Link>
        <Link href="/about-partner-form" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/about-partner-form' ? 'bg-gray-100' : ''}`}>
            Connect Partner Form
          </li>
        </Link>
        <Link href="/footer-admin" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/footer-admin' ? 'bg-gray-100' : ''}`}>
            Footer
          </li>
        </Link>
        <Link href="/products-admin" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/products-admin' ? 'bg-gray-100' : ''}`}>
            Products
          </li>
        </Link>
        <Link href="/tabs-admin" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/tabs-admin' ? 'bg-gray-100' : ''}`}>
            Tags
          </li>
        </Link>
        <Link href="/product-supply" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/product-supply' ? 'bg-gray-100' : ''}`}>
            Product Supply
          </li>
        </Link>
        <Link href="/agriculture-home" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/agriculture-home' ? 'bg-gray-100' : ''}`}>
            Agriculture Home
          </li>
        </Link>
        <Link href="/title-subtext" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/title-subtext' ? 'bg-gray-100' : ''}`}>
            Titles, Subtexts And Youtube Video Link 
          </li>
        </Link>
        <Link href="/trending-products" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/trending-products' ? 'bg-gray-100' : ''}`}>
            Trending Applications Home
          </li>
        </Link>
        <Link href="/achievements-admin" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/achievements-admin' ? 'bg-gray-100' : ''}`}>
            Achievements Home
          </li>
        </Link>
        <Link href="/customer-admin" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/customer-admin' ? 'bg-gray-100' : ''}`}>
            Customer Home
          </li>
        </Link>
        <Link href="/blogs-admin" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/blogs-admin' ? 'bg-gray-100' : ''}`}>
            Blogs
          </li>
        </Link>
        <Link href="/form-admin" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/form-admin' ? 'bg-gray-100' : ''}`}>
            Form
          </li>
        </Link>
        <Link href="/about-first" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/about-first' ? 'bg-gray-100' : ''}`}>
            About First
          </li>
        </Link>
        <Link href="/about-market" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/about-market' ? 'bg-gray-100' : ''}`}>
            About Market
          </li>
        </Link>
        <Link href="/about-story" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/about-story' ? 'bg-gray-100' : ''}`}>
            About Story
          </li>
        </Link>
        <Link href="/about-trust" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/about-trust' ? 'bg-gray-100' : ''}`}>
            About Trust
          </li>
        </Link>
        <Link href="/connect-first" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/connect-first' ? 'bg-gray-100' : ''}`}>
            Connect First
          </li>
        </Link>
        <Link href="/connect-second" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/connect-second' ? 'bg-gray-100' : ''}`}>
            Connect Second
          </li>
        </Link>
        <Link href="/connect-questions" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/connect-questions' ? 'bg-gray-100' : ''}`}>
            Connect Questions
          </li>
        </Link>
        <Link href="/connect-socials" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/connect-socials' ? 'bg-gray-100' : ''}`}>
            Connect Socials
          </li>
        </Link>
        <Link href="/agriculture-titles" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/agriculture-titles' ? 'bg-gray-100' : ''}`}>
            Agriculture Titles
          </li>
        </Link>
        <Link href="/agriculture-admin" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/agriculture-admin' ? 'bg-gray-100' : ''}`}>
            Agriculture Page
          </li>
        </Link>
        <Link href="/animal-titles" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/animal-titles' ? 'bg-gray-100' : ''}`}>
            Animal Titles
          </li>
        </Link>
        <Link href="/animal-admin" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/animal-admin' ? 'bg-gray-100' : ''}`}>
            Animal Page
          </li>
        </Link>
        <Link href="/aqua-titles" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/aqua-titles' ? 'bg-gray-100' : ''}`}>
            Aqua Titles
          </li>
        </Link>
        <Link href="/aqua-admin" passHref>
          <li className={`p-4 hover:bg-gray-100 cursor-pointer text-black ${pathname === '/aqua-admin' ? 'bg-gray-100' : ''}`}>
            Aqua Page
          </li>
        </Link>
      </ul>
    </div>
  );
}

export default SidebarAdmin;
