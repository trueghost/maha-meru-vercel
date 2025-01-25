"use client";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

const FourthComponent = ({ title4, subtext4, title5, translatedSeeProductsText, aboutPartnerFormItems }) => {
  
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

// Handle download of the first file in the list
const handleDownload = () => {
  const firstItem = aboutPartnerFormItems[0]; // Get the first item
  if (firstItem && firstItem.file) {
    const fileUrl = firstItem.file; // Assuming the file URL is in the 'file' field of the item
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl.split("/").pop(); // Use the file name from the URL
    link.click(); // Trigger the download

    // Show success toast with custom styles
    toast.success("File downloaded successfully!", {
      style: {
        backgroundColor: "#E6CFB7",
        color: "#193048", // Success text color
        border: "2px solid #193048", // Outline for toast
      },
    });
  } else {
    console.error("No file available to download.");

    // Show error toast with custom styles
    toast.error("No file available to download.", {
      style: {
        backgroundColor: "#E6CFB7",
        color: "#DA1D21", // Error text color
        border: "2px solid #193048", // Outline for toast
      },
    });
  }
};

  return (
    <section className="flex flex-col items-center justify-center gap-16 py-10">
      <div className="w-full lg:max-w-[1000px] px-5 mx-auto">
        {/* Header */}
        <div className="text-center">
          <h5 className="font-poppinsSB text-[#193048] leading-normal font-semibold lg:text-4xl text-3xl mx-5">
            {title4}
          </h5>
        </div>

        {/* Animated Paragraph */}
        <div className="text-center mt-7 text-lg ">
          <p
            className="text-[#232323] font-light font-poppins text-lg"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            {subtext4}
          </p>
        </div>
      </div>
      <div className="bg-[#193048] flex-col items-center text-center lg:py-24 relative mt-2 w-full lg:max-w-[1000px] py-20">
        <h6 className="text-white font-semibold font-poppinsSB text-[28px] mt-[-30px] lg:mx-0 mx-5">
          {title5}
        </h6>

        {/* Button with Hover Animation */}
        <div className="flex justify-center mt-10">
          <button className="flex justify-center mt-4 cursor-pointer rounded-2xl" onClick={handleDownload}>
            <div
              className={`cursor-pointer w-[200px] h-[55px] absolute z-20 font-poppinsSB flex justify-center items-center ${isHovered ? "bg-[#E6CFB7]" : "bg-[#E6CFB7]"}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <h4
                className={`cursor-pointer lg:text-lg z-10 font-semibold ${isHovered ? "text-[#193048]" : "text-[#193048]"}`}
                style={{
                  fontFamily: "PoppinsSB",
                  color: "#193048",
                  fontWeight: "400", // Equivalent to font-semibold in Tailwind
                }}
              >
                 {translatedSeeProductsText || 'Partner Application'}
              </h4>
            </div>
            <div
              className={`w-[195px] h-[60px] border-2 relative z-10 ml-8 mt-[6px] ${isHovered ? "border-[#E6CFB7]" : "border-[#E6CFB7]"}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            ></div>
          </button>
        </div>
      </div>
      <Toaster /> 
    </section>
  );
};

export default FourthComponent;
