"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Market = ({ title3, marketSegments }) => {

  return (
    <section className="flex flex-col items-center justify-center  gap-10 mx-auto mb-12 font-poppinsSB">
      <div className="text-center mb-8 my-14 sm:mx-14  ">
        <h1
          className="text-[#193048] text-4xl font-poppinsSB font-semibold "
          style={{
            fontFamily: "PoppinsSB",
            color: "#193048",
            fontSize: "1.875rem",
            fontWeight: "400",
          }}
        >
          {title3}
        </h1>
      </div>

      {/* Swiper for desktop and mobile view */}
      <div className="w-full flex justify-center items-center lg:ml-0 ml-20 md:ml-0 lg:gap-0 gap-8">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={50}
          autoplay={{
            delay: 500,
           
          }}
          breakpoints={{
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 50,
            },
            0: {
              slidesPerView: 1,
              spaceBetween: 50,
            },
          }}
          className="w-full lg:max-w-[1440px] md:max-w-[800px] sm:max-w-[350px] flex justify-center"
        >
          {marketSegments.map((segment, index) => (
            <SwiperSlide key={index} className="flex justify-center w-full">
              <MarketCard
                image={segment.image}
                hoverImage={segment.hoverImage}
                title={segment.title}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

const MarketCard = ({ image, hoverImage, title }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group flex flex-col items-center justify-center gap-3 p-5 lg:w-[340px] w-[300px] lg:h-[340px] h-[300px] transition-all duration-300 mb-10 hover:bg-[#193048] hover:text-[#E6CFB7] rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={isHovered ? hoverImage : image}
        alt={`Image of ${title}`}
        width={180}
        height={180}
        className="object-contain w-[180px] h-[180px]"
      />
      <h4 className="text-center text-[#193048] transition-colors duration-300 group-hover:text-[#E6CFB7]">
        {title}
      </h4>
    </div>
  );
};

export default Market;
