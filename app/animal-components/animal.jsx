"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../context/languageContext"; // Import useLanguage

const Animal = ({ title2, subtext }) => {

  return (
    <section className="py-20 flex-col items-center justify-center lg:flex font-poppins">
      {/* Content only visible on screens 1024px and above */}
      <div className="text-center mx-auto hidden lg:block">
        <h1 className="text-[#193048] text-4xl font-semibold font-poppinsSB uppercase">
          {title2}
        </h1>
      </div>

      <div className="text-center px-40 lg:px-20 xl:px-40 mt-7 hidden lg:block font-poppins">
        <p className="text-[#193048] text-xl font-normal">
          {subtext}
        </p>
      </div>
    </section>
  );
};

export default Animal;
