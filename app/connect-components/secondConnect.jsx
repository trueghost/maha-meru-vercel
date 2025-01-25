import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import { useEffect, useState } from "react";
// Import your language context hook

const SecondConnect = ({ title1, description1, imageUrl1 }) => {
  useEffect(() => {
    AOS.init({ duration: 600 });
  }, []);

  return (
    <section className="py-8 md:py-12 flex flex-col items-center justify-center gap-6 md:gap-10 font-poppins">
      <div className="text-center px-4 md:px-0">
        <h3 className="font-Poppins text-[#193048] font-semibold mx-5 text-3xl lg:text-4xl font-poppinsSB leading-tight md:leading-snug lg:leading-normal"
          style={{
            fontFamily: "PoppinsSB",
            color: "#193048",
            fontSize: "1.875rem", // Equivalent to text-3xl in Tailwind
            fontWeight: "400", // Equivalent to font-semibold in Tailwind
          }}
        >
          {title1}
        </h3>
      </div>

      {/* Only render the Image component if imageUrl is valid */}
      {imageUrl1 && (
        <div
          className="flex items-center justify-center w-full h-full max-w-2xl md:max-w-screen lg:max-w-4xl"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <Image
            src={imageUrl1}
            alt="image of customer"
            className="w-full h-auto sm:max-h-[600px] object-contain"
            width={500}
            height={500}
          />
        </div>
      )}

      <div
        className="flex items-center justify-center mt-4 px-4 md:px-8 lg:px-0"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <p className="font-Poppins text-[#193048] font-poppins text-lg md:text-lg lg:text-[20px] text-center max-w-xl md:max-w-2xl lg:max-w-4xl leading-relaxed md:leading-normal">
          {description1}
        </p>
      </div>
    </section>
  );
};

export default SecondConnect;
