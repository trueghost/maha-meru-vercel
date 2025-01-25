"use client";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import animal from "../../public/images/connect/questions/cow.webp";

const Questions = ({ title6, subtext6, questions }) => {
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <section className="flex flex-col md:flex-row justify-center gap-10 items-start py-7 flex-wrap px-4 pb-28 sm:px-0 font-poppins">
      {/* Left section questions */}
      <div
        className="flex flex-col items-start justify-start gap-5 max-w-[300px] w-full sm:w-auto"
        data-aos="fade-right" // Left section comes from the left
      >
        <h3 className="text-[#06150A] font-semibold text-[24px] text-start font-poppinsSB md:text-[40px] leading-none">
          {title6}
        </h3>
        <p className="text-[#193048] text-[14px] md:text-[16px] max-w-[300px] md:max-w-[450px]">
          {subtext6}
        </p>
        <Image
          src={animal}
          alt="image of an animal"
          className="w-full hidden sm:block"
        />
      </div>

      {/* Right section questions (Accordion) */}
      <div
        className="flex flex-col space-y-5 w-full max-w-[600px] mt-5 md:mt-0 md:ml-5"
        data-aos="fade-left" // Right section comes from the right
      >
        {/* Accordion Items */}
        {questions?.map((item, index) => (
          <div key={index} className="border border-black max-w-full">
            <div
              className="flex items-center justify-between py-[15px] cursor-pointer px-4"
              onClick={() => toggleAccordion(index)}
            >
              <p className="text-[#06150A] text-[16px] md:text-[20px] font-normal font-poppinsSB">
                {item?.title}
              </p>
              <p className="text-[#06150A] text-[24px] md:text-[28px] font-normal">
                {openAccordion === index ? "-" : "+"}
              </p>
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openAccordion === index ? "max-h-[500px]" : "max-h-0"
              }`}
            >
              <div className="px-4 pb-4 text-[#06150A] text-[14px] md:text-[16px]">
                {item?.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Questions;
