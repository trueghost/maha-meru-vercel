"use client";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/languageContext"; // Import the language context

const OurStory = ({ title4, imageUrl1, description1 }) => {

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <section className="overflow-x-hidden flex flex-col justify-center items-center font-poppins">
      <h3
        className="font-Poppins text-[#193048] font-semibold text-center lg:text-center text-4xl font-poppinsSB mb-10 w-full max-w-[1200px] ml-4"
        style={{
          fontFamily: "PoppinsSB",
          color: "#193048",
          fontSize: "1.875rem",
          fontWeight: "400",
        }}
      >
        {title4}
      </h3>
      <div className="flex flex-col lg:flex-row justify-center items-center gap-10 max-w-[1200px] font-poppins text-lg">
        { imageUrl1 ? (
          <Image
            id="Gardener"
            src={imageUrl1}
            alt="Gardener"
            className="flex-1"
            width={300}
            height={300}
            data-aos="fade-right"
          />
        ) : (
          <p>No image available</p>
        )}
        <span
          className="flex-1 text-justify px-4 lg:px-0 text-[#193048] mx-5 lg:mx-0 text-xl"
          data-aos="fade-left"
        >
          {description1}
        </span>
      </div>
    </section>
  );
};

export default OurStory;
