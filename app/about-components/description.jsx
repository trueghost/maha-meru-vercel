'use client';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from "next/image";
import { useEffect, useState } from 'react';

const Description = ({ title1, imageUrl, description, translatedSeeProductsText, translatedSeeProductsTexts }) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleText = () => {
    setShowFullText(!showFullText);
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
    <div className="overflow-x-hidden flex flex-col justify-center items-center mb-20 font-poppins">
      {/* Main Heading */}
      <section className="flex flex-col items-center justify-center gap-8 py-10">
        <div className="w-full px-5 max-w-[1200px]">
          <div className="text-center">
            <h5 className="font-Poppins text-[#193048] leading-normal font-semibold font-poppinsSB text-4xl"
            style={{
              fontFamily: "PoppinsSB",
              color: "#193048",
              fontSize: "1.875rem", // Equivalent to text-3xl in Tailwind
              fontWeight: "400", // Equivalent to font-semibold in Tailwind
            }}
            >
              {title1}
            </h5>
          </div>
        </div>
      </section>

      {/* Page Content */}
      <div className="flex justify-center items-start flex-col lg:flex-row px-4 md:px-8 lg:px-32">
        <section className="w-full flex flex-col lg:flex-row justify-center items-start mx-auto gap-8 md:gap-12">
          {/* Image Section with AOS animation from left */}
          {imageUrl && (
            <Image
              id="grass"
              src={imageUrl}
              alt="About Image"
              className="w-full max-w-[600px] h-auto below-1356:max-w-[700px] below-1276:max-w-[400px]"
              width={600}
              height={400}
              priority  // Mark this image as a high priority for LCP
            />
          )}
          
          {/* Text Section with AOS animation from bottom */}
          <section
            data-aos="fade-up"  // AOS fade-up animation
            className="flex-1 flex flex-col text:lg lg:text-md  gap-5 font-poppins text-[#232323] text-center lg:text-start max-w-[800px] below-1276:max-w-[1200px] px-6 sm:px-16 lg:px-0"
          >
            <span className={`transition-all duration-500 ease-in-out ${showFullText ? "max-h-[1000px]" : "max-h-[385px] overflow-hidden"}`}>
              {description?.slice(0, 717)} {/* Show the initial part of the description */}
              {description?.length > 800 && !showFullText && (
                <span className="transition-all duration-300 ease-in-out">...</span>
              )}

              {/* Show the remaining part of the description if the user has clicked 'Read More' */}
              {description?.length > 800 && showFullText && (
                <span className="transition-all duration-300 ease-in-out">
                  {description?.slice(717)} {/* Show the remaining part inline */}
                </span>
              )}
            </span>

            {/* Center the Read More button */}
            <div className="flex justify-center mt-4">
              {description?.length > 800 && !showFullText && (
                <button
                  onClick={toggleText}
                  className="px-6 py-2 w-[200px] flex items-center justify-center gap-2 border border-[#193048] text-[#193048] bg-transparent rounded-full hover:bg-[#193048] hover:text-white transition-all duration-300 ease-in-out"
                >
                    {translatedSeeProductsText || 'Read More'}
                  {/* <span className={`w-6 h-6 flex items-center justify-center rounded-full border border-[#193048] transition-transform duration-300 ${showFullText ? "rotate-180" : "rotate-0"}`}>
                    ↓
                  </span> */}
                </button>
              )}
              
              {showFullText && (
                <button
                  onClick={toggleText}
                  className="px-6 py-2 w-[200px] flex items-center justify-center gap-2 border border-[#193048] text-[#193048] bg-transparent rounded-full hover:bg-[#193048] hover:text-white transition-all duration-300 ease-in-out"
                >
                   {translatedSeeProductsTexts || 'Read Less'}
                  {/* <span className={`w-6 h-6 flex items-center justify-center rounded-full border border-[#193048] transition-transform duration-300 ${showFullText ? "rotate-180" : "rotate-0"}`}>
                    ↑
                  </span> */}
                </button>
              )}
            </div>
          </section>
        </section>
      </div>
    </div>
  );
};

export default Description;
