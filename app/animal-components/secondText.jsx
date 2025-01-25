"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import vector from "../../public/images/agriculture page/secondtext/vector.svg";
import vector2 from "../../public/images/agriculture page/secondtext/vector3.svg";
import { useLanguage } from "../context/languageContext"; // Import useLanguage hook

const Secondtext = ({ title1, title2, subtext }) => {

  return (
    <section className="w-full flex flex-col items-center justify-center mt-24 font-poppins">
      {/* Additional content for screens below 1024px */}
      <div className="w-full text-center px-5 sm:px-7 md:px-32 lg:px-40 mb-5 lg:hidden">
        <h2 className="text-[#193048] text-[24px] sm:text-[28px] font-poppinsSB md:text-[32px] font-bold mb-4 uppercase">
          {title2}
        </h2>
        <p className="text-[#193048] text-[16px] sm:text-[18px] md:text-[20px] font-normal">
          {subtext}
        </p>
      </div>

      {/* Blue background div */}
      <div className="w-full py-10 bg-[#193048] flex items-center justify-center">
        <div className="text-center px-5 sm:px-7 md:px-32 lg:px-40 sm:mt-10">
          <p className="text-[#E6CFB7] text-[20px] sm:text-[24px] md:text-[28px] font-normal flex items-center justify-center relative pb-8">
            {/* Image before text */}
            <Image
              src={vector}
              alt="quote before"
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 absolute left-[0px] sm:left-[-20px] md:left-[-50px] top-[-25px] md:top-0"
            />

            {/* The actual text */}
            <span className="mt-5">
              {title1}
            </span>

            {/* Image after text at the bottom */}
            <Image
              src={vector2}
              alt="quote after"
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 absolute right-[10px] bottom-[10px] sm:right-[0px] sm:bottom-[0px] md:right-[-50px] md:bottom-[30px] lg:right-[-40px] lg:bottom-[40px] "
            />
          </p>
        </div>
      </div>
    </section>
  );
};

export default Secondtext;
