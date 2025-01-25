"use client";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
// import cow from "../../public/images/blog/cow.png";
// import plant from "../../public/images/blog/land.png";
// import water from "../../public/images/blog/watering.png";

// const blogPosts = [
//   {
//     id: 1,
//     image: cow,
//     category: "CATEGORY",
//     date: "MAY 26, 2024",
//     title: "The Future of Smart Farming: Trends to Watch",
//     description: "Explore the latest trends in smart farming and how they are shaping the future of agriculture.",
//   },
//   {
//     id: 2,
//     image: water,
//     category: "CATEGORY",
//     date: "MAY 26, 2024",
//     title: "The Future of Smart Farming: Trends to Watch",
//     description: "Explore the latest trends in smart farming and how they are shaping the future of agriculture.",
//   },
//   {
//     id: 3,
//     image: plant,
//     category: "CATEGORY",
//     date: "MAY 26, 2024",
//     title: "The Future of Smart Farming: Trends to Watch",
//     description: "Explore the latest trends in smart farming and how they are shaping the future of agriculture.",
//   },
// ];

const Blogs = ({ title7, blogPosts }) => {

  useEffect(() => {
    AOS.init(); 
  }, []);
  
  const formatDate = (dateString) => {
    const options = { day: '2-digit', year: 'numeric' };
    const date = new Date(dateString);
    
    // Get the month abbreviation
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    
    // Format the date
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${month}-${date.getFullYear()}`;
    return formattedDate;
  }; 

  return (
    <section className="object-contain bg-no-repeat w-full flex items-center justify-center blogs-section font-poppins">
      <div className="flex flex-col items-center w-full px-5 md:px-20">
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl text-[#193048] font-semibold font-poppinsSB"
           style={{
            fontFamily: "PoppinsSB",
            color: "#193048",
            fontSize: "1.875rem", // Equivalent to text-3xl in Tailwind
            fontWeight: "400", // Equivalent to font-semibold in Tailwind
          }}
          >
            {title7}
          </h1>
        </div>

        <div className="flex flex-wrap  items-center justify-center mt-10 gap-10">
          {blogPosts?.filter((post) => post?.hide !== 1).map((post) => (
            <Link key={post?.id} href={post?.link} passHref>
            <div
              className="relative flex flex-col"
              data-aos="fade-up"
              data-aos-duration="500"
            >
              <Image
                className="w-[400px] h-[300px] "
                src={post?.image_url}
                alt={`image of ${post?.title.toLowerCase()}`}
                width={400}
                height={300}
              />
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <div className="flex gap-5 mt-2">
                  <p className="text-[12px] md:text-[14px] text-white font-semibold">
                    {post?.category}
                  </p>
                  <p className="text-[12px] md:text-[14px] text-white font-normal">
                  {formatDate(post?.date)}
                  </p>
                </div>
                <div className="max-w-[200px] md:max-w-[250px] mt-1">
                  <h3 className="text-lg md:text-xl font-semibold font-poppinsSB text-white">
                    {post?.title}
                  </h3>
                </div>
                <div className="max-w-[250px] md:max-w-[350px] mt-2">
                  <p className="text-xs md:text-sm text-white font-normal">
                    {post?.description}
                  </p>
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;
