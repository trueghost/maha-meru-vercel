'use client';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Tilt } from "react-tilt";
// import land from '../../public/images/connect/blogs/farming.png';
// import plant from '../../public/images/connect/blogs/plant.png';
// import water from '../../public/images/connect/blogs/water.png';

// const cardData = [
//   {
//     id: 1,
//     image: land,
//     category: "CATEGORY",
//     date: "MAY 26, 2024",
//     title: "The Future of Smart Farming: Trends to Watch",
//     description: "Explore the latest trends in smart farming and how they are shaping the future of agriculture."
//   },
//   {
//     id: 2,
//     image: water,
//     category: "CATEGORY",
//     date: "MAY 26, 2024",
//     title: "Sustainable Practices for Modern Agriculture",
//     description: "Explore the latest trends in smart farming and how they are shaping the future of agriculture."
//   },
//   {
//     id: 3,
//     image: plant,
//     category: "CATEGORY",
//     date: "MAY 26, 2024",
//     title: "The Future of Smart Farming: Trends to Watch",
//     description: "Explore the latest trends in smart farming and how they are shaping the future of agriculture."
//   }
// ];

const Socialmedia = ({ title8, cardData }) => {

  useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
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

  const visibleSocial = cardData?.filter((card) => card?.hide !== 1);

  return (
    <section className={`flex flex-col items-center justify-center ${visibleSocial?.length > 0 ? "py-36" : ""} font-poppins`}>
      <div className="flex-col">
        <div className="mb-8">
          <h1 className="lg:text-4xl text-3xl font-bold text-center text-[#193048] font-poppinsSB"
           style={{
            fontFamily: "PoppinsSB",
            color: "#193048",
            fontSize: "1.875rem", // Equivalent to text-3xl in Tailwind
            fontWeight: "400", // Equivalent to font-semibold in Tailwind
          }}
          >{title8}</h1>
        </div>
        <div className="flex flex-wrap justify-center gap-24">
          {cardData?.filter((card) => card?.hide !== 1).map((card) => (
            <Link key={card?.id} href={card?.link} passHref>
            <div
              className="flex flex-col items-center max-w-[300px]"
              data-aos="fade-up"  // Add this line to apply AOS fade-in
            >
              <div className="text-center">
                <Tilt
                  perspective={500}
                  glareEnable={true}
                  glareMaxOpacity={0.45}
                  scale={1.02}
                  gyroscope={true}
                >
                  <Image
                    src={card?.image_url}
                    alt={card?.title}
                    width={300}
                    height={350}
                    className="w-[300px] h-[350px] object-cover mx-auto"
                  />
                </Tilt>
                <div className="w-full">
                  <div className="flex justify-start gap-5 mt-3">
                    <p className="text-[#5E6642] text-[14px] font-semibold font-poppinsSB">{card?.category}</p>
                    <p className="text-[#5E6642] text-[14px]">{formatDate(card?.date)}</p>
                  </div>
                  <div className="text-left mt-2">
                    <h2 className="text-[#06150A] text-[20px]  font-medium">{card?.title}</h2>
                  </div>
                  <div className="mt-2 text-left max-w-[400px] mx-auto">
                    <p className="text-[#232323] text-[16px] font-normal">{card?.description}</p>
                  </div>
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

export default Socialmedia;
