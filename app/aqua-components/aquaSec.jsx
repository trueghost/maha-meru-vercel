"use client";
import AOS from "aos"; // Import AOS
import "aos/dist/aos.css"; // Import AOS styles
import Image from "next/image";
import { useEffect, useState } from "react";
import plant from "../../public/images/agriculture page/agriculture/job.png";
import product from "../../public/images/agriculture page/agriculture/product.png";
import plantsmall from "../../public/images/aquaticpage/fish2.png";

const Agriculturesec = ({ activeTitle }) => {
  const cardList = [
    {
      id: 1,
      title: "M-Terraboost",
      content:
        "The plants, our natural survival instincts kick in and we realise the drastic nature of chemicals used.",
      image: product, // You can add unique images here
    },
    {
      id: 2,
      title: "EcoBoost",
      content:
        "EcoBoost offers a sustainable way to nurture plants and ensure healthy growth with minimal chemicals.",
      image: product, // Replace with actual image for this card
    },
    {
      id: 3,
      title: "Plant Protector",
      content:
        "Natural plant protection solutions that help maintain the ecosystem while boosting plant health.",
      image: product, // Replace with actual image for this card
    },
    {
      id: 4,
      title: "BioGrow",
      content:
        "BioGrow nurtures plants with organic nutrients, providing the best conditions for sustainable farming.",
      image: product, // Replace with actual image for this card
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCardVisible, setIsCardVisible] = useState(false); // Initialize as false to hide cards initially

  const handleNext = () => {
    if (currentIndex < cardList.length - 2) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleCardVisibility = () => {
    setIsCardVisible((prev) => !prev); // Toggle card visibility
  };

  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true }); // Initialize AOS
  }, []);

  const handleBackgroundClick = () => {
    if (isCardVisible) {
      setIsCardVisible(false); // Close cards when clicking on background
    }
  };

  return (
    <section className="2xl:ml-36 xl:ml-28 font-poppins" key={activeTitle}>
      {/* First Part  Main Agriculture */}
      <div className="lg:flex flex-row item-center justify-center space-x-24 lg:mx-10 hidden below-1146:mb-10 relative">
        {/* First Left */}

        <div
          className={`flex items-start below-1146:scale-80 ${
            isCardVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Prev Button */}
          <button
            className="bg-[#1F3B59] h-10 w-10 rounded-full flex justify-center items-center text-white mr-4 mt-36"
            onClick={handlePrev}
          >
            &lt;
          </button>

          {/* Cards Container */}
          <div className="grid grid-cols-2 gap-4 max-w-[400px] min-h-[300px] below-1146:min-h[100px] below-1146:max-w-[500px] ">
            {cardList.slice(currentIndex, currentIndex + 2).map((card) => (
              <div key={card.id} className="max-w-[200px] flex flex-col h-full">
                <Image src={card.image} alt={card.title} className="h-auto" />
                <div className="bg-[#1F3B59] p-3 text-white flex-grow">
                  <h2 className="text-[23px] font-poppinsSB">{card.title}</h2>
                  <p className="text-[12px]">{card.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button
            className="bg-[#1F3B59] h-10 w-10 rounded-full flex justify-center items-center text-white ml-2 mt-36"
            onClick={handleNext}
          >
            &gt;
          </button>
        </div>

        {/* right */}

        <div className="flex items-center gap-1 " data-aos="fade-up">
          <div className="flex-col space-y-5 max-w-[300px]">
            <h2
              className="text-[#000] font-bold font-poppinsSB text-[22px]"
              data-aos="fade-left"
            >
              Toxic Algae Bloom Control
            </h2>
            <p
              className="text-[#000] font-extralight text-[14px]"
              data-aos="fade-left"
            >
              Lorem ipsum Dior amet Lorem ipsum Dior amet Lorem ipsum Dior amet
              Lorem ipsum Dior amet Lorem ipsum Dior amet Lorem ipsum Dior amet
              .
            </p>
            <button
              className="px-7 py-3 border-2 border-[#193048] font-poppinsSB text-[#193048] rounded-md flex items-center space-x-2"
              data-aos="fade-down"
              onClick={toggleCardVisibility} // Toggle visibility on click
            >
              See Products
              <span className="border-2 border-[#193048] rounded-full w-6 h-6 flex items-center justify-center ml-5">
                &lt;
              </span>
            </button>
          </div>
          <div className="flex flex-col items-center">
            <Image
              src={plant}
              alt="rounded plant image below-1024:w-[500px] "
              data-aos="zoom-in"
            />
            <div className="bg-[#193048] rounded-full h-14 w-14 below-1192:hidden"></div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-[-30px] right-48 flex items-center justify-center pointer-events-none" data-aos="fade-down">
          <Image
            src={plantsmall}
            alt="image of animal1"
            width={120}
            height={80}
            className="rounded-full object-contain"
          />
        </div>
      </div>

      {/* Conditional Rendering for Lines */}
      <div className="lg:flex hidden items-center justify-center mr-11 below-1276:scale-90 below-1276:ml-[15px] below-1276:mt-[-20px] below-1146:scale-75 below-1146:mr-[5%] below-1146:mt-[-40px] below:1085p:mr[-40px] below-1085:mt-[-60px] below-1030:mt-[-65px]">
        <svg
          width="1200"
          height="225"
          viewBox="0 0 980 225"
          fill="none"
          className="mt-5 ml-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 224C15 113.5 122.5 65.5 174.5 65.5C343 66 710.394 65.5 832 65.5C887.905 65.5 932.959 36.5611 963.831 1.5"
            stroke="#193048"
            strokeWidth="4"
            style={{
              animation: "drawPath 6s ease forwards", // Apply the animation
              strokeDasharray: "1000", // Set the dash array
              strokeDashoffset: "2000", // Start hidden
            }}
          />
          <style>
            {`@keyframes drawPath {
          from {
            stroke-dashoffset: 00; // Start hidden
          }
          to {
            stroke-dashoffset: 3000; // End fully visible
          }
        }`}
          </style>
        </svg>
      </div>
      {/* Mobile responsive code  */}
      <div className="lg:hidden flex flex-row-reverse justify-center items-center   gap-5  pb-5 mx-5">
        <div className="flex items-center justify-center" data-aos="fade-up">
          <Image
            src={plant}
            alt="image of a job"
            className="max-w-[150px]"
          />
        </div>
        <div
          className="max-w-[350px] text-left flex flex-col items-left justify-center"
          data-aos="fade-up"
        >
          <h1 className="font-extrabold font-poppinsSB text-[#000] text-[18px]  text-left">
          Toxic Algae Bloom Control
          </h1>
          <p className="font-extralight text-[#000] text-[14px] text-left ">
            Lorem ipsum Dior amet Lorem ipsum Dior amet Lorem ipsum Dior amet
            Lorem ipsum Dior amet Lorem ipsum Dior amet Lorem ipsum Dior amet.
          </p>
          <button
            className="px-4 sm:px-7 py-2 sm:py-3 border-2 font-poppinsSB border-[#193048] text-[#193048] rounded-md flex items-center justify-center space-x-2 mt-3 sm:mt-0"
            onClick={toggleCardVisibility}
          >
            See product
            <span className="border-2 border-[#193048] rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center ml-2 sm:ml-5">
              &lt;
            </span>
          </button>
        </div>

        <div
          className={`${
            isCardVisible
              ? "fixed inset-0 z-50 backdrop-filter backdrop-blur-md flex items-center"
              : ""
          }`}
          style={{
            background: isCardVisible
              ? "linear-gradient(106deg, #121212 -2.96%, rgba(54, 54, 54, 0.00) 102.18%)"
              : "",
          }}
          onClick={handleBackgroundClick}
        >
          {isCardVisible && (
            <div className="flex items-start">
              {/* Prev Button */}
              <button
                className="bg-[#1F3B59] h-10 w-10 rounded-full font-poppinsSB flex justify-center items-center text-white mr-4 mt-36"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event from bubbling up
                  handlePrev();
                }}
              >
                &lt;
              </button>

              {/* Cards Container */}
              <div className="grid grid-cols-2 gap-4 max-w-[400px] min-h-[300px] below-1146:min-h[100px] below-1146:max-w-[500px] ">
                {cardList.slice(currentIndex, currentIndex + 2).map((card) => (
                  <div
                    key={card.id}
                    className="max-w-[200px] flex flex-col h-full"
                    data-aos="fade-right"
                  >
                    <Image
                      src={card.image}
                      alt={card.title}
                      className="h-auto"
                    />
                    <div className="bg-[#1F3B59] p-3 text-white flex-grow">
                      <h2 className="text-[23px] font-poppinsSB">{card.title}</h2>
                      <p className="text-[12px]">{card.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Next Button */}
              <button
                className="bg-[#1F3B59] h-10 w-10 rounded-full flex justify-center items-center text-white ml-2 mt-36"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event from bubbling up
                  handleNext();
                }}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center ml-5 lg:hidden mt-5 mb-5">
        <svg
          width="248"
          height="47"
          viewBox="0 0 248 47"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M236.667 6C236.667 8.94552 239.054 11.3333 242 11.3333C244.946 11.3333 247.333 8.94552 247.333 6C247.333 3.05448 244.946 0.666667 242 0.666667C239.054 0.666667 236.667 3.05448 236.667 6ZM49 27.5L48.9634 28.4993L48.987 28.5002L49.0105 28.4999L49 27.5ZM0.551317 45.1838C0.376669 45.7077 0.659829 46.274 1.18377 46.4487C1.70772 46.6233 2.27404 46.3402 2.44868 45.8162L0.551317 45.1838ZM241.058 5.66499C238.591 12.6027 224.784 27.2949 189.022 26.5002L188.978 28.4998C225.216 29.3051 240.076 14.3973 242.942 6.33501L241.058 5.66499ZM189.022 26.5002C153.003 25.6998 80.6537 26.1667 48.9895 26.5001L49.0105 28.4999C80.6796 28.1666 152.997 27.7002 188.978 28.4998L189.022 26.5002ZM49.0366 26.5007C42.1318 26.2481 31.4504 26.8518 21.8103 29.4982C12.2448 32.1241 3.32263 36.8698 0.551317 45.1838L2.44868 45.8162C4.87737 38.5302 12.8718 34.0259 22.3397 31.4268C31.7329 28.8482 42.2015 28.2519 48.9634 28.4993L49.0366 26.5007Z"
            stroke="black" // Use stroke to apply the animation
            strokeWidth="1"
            fill="transparent"
            style={{
              animation:
                "drawPath 4s ease forwards, fillPath 1s ease forwards 4s",
              strokeDasharray: "1000", // Set the total length of the path
              strokeDashoffset: "1000", // Initially set to the total length of the path to hide the stroke
            }}
          />
        </svg>
        <style>
          {`@keyframes drawPath {
                  from {
                      stroke-dashoffset: 1000; // Start from the full length of the path
                  }
                  to {
                      stroke-dashoffset: 0; // Animate to fully reveal the stroke from left to right
                  }
              }

              @keyframes fillPath {
                  from {
                      fill: transparent; // Start transparent
                  }
                  to {
                      fill: black; // End with black fill
                  }
              }`}
        </style>
      </div>
    </section>
  );
};

export default Agriculturesec;
