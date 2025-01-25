"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../context/languageContext"; // Import useLanguage

const Aqua = ({ title2, subtext }) => {

  return (
    <section className="py-20 flex flex-col items-center justify-center lg:flex font-poppins">
      {/* Content visible for large screens (1024px and above) */}
      <div className="text-center mx-auto hidden lg:block">
        <h1 className="text-[#193048] text-4xl font-poppinsSB font-semibold uppercase">
          {title2}
        </h1>
      </div>

      <div className="text-center px-5 sm:px-7 md:px-32 hidden lg:px-20 xl:px-40 mt-7">
        <p className="text-[#193048] text-lg sm:text-xl md:text-2xl font-normal lg:hidden">
          {/* Mobile and smaller screens content */}
          {subtext}
        </p>
      </div>

      {/* Larger screen paragraph */}
      <div className="text-center px-40 lg:px-20 xl:px-40 mt-7 hidden lg:block">
        <p className="text-[#193048] text-xl font-normal">
          {subtext}
        </p>
      </div>
    </section>
  );
};

export default Aqua;
