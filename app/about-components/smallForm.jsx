"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import vector from "../../public/images/agriculture page/secondtext/vector.svg";
import vector2 from "../../public/images/agriculture page/secondtext/vector3.svg";
import { useLanguage } from "../context/languageContext";

const Smallform = ({ title2 }) => {

  return (
    <section className="bg-[#193048] p-5 py-10 flex flex-col items-center font-poppins">
      {/* Heading */}
      <div className="text-center px-5 sm:px-7 md:px-32 lg:px-40 sm:mt-10">
        <p className="text-[#E6CFB7] text-[20px] sm:text-[24px] md:text-[28px] font-normal flex items-center justify-center relative pb-8">
          {/* Image before text */}
          <Image
            src={vector}
            alt="quote before"
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 absolute left-[0px] sm:left-[-20px] md:left-[-50px] top-[-25px] md:top-0"
          />

          {/* The actual text */}
          <span className="mt-5 font-extrabold font-poppinsSB">
            {title2}
          </span>

          {/* Image after text at the bottom */}
          <Image
            src={vector2}
            alt="quote after"
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 absolute right-[10px] bottom-[10px] sm:right-[0px] sm:bottom-[0px] md:right-[-50px] md:bottom-[30px] lg:right-[-40px] lg:bottom-[40px]"
          />
        </p>
      </div>
    </section>
  );
};

export default Smallform;
