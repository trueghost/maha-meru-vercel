"use client";
import AOS from "aos"; // Import AOS
import "aos/dist/aos.css"; // Import AOS styles
import Image from "next/image";
import { useEffect, useState } from "react";
import product from "../../public/images/agriculture page/agriculture/product.png";
import walk from "../../public/images/agriculture page/agriculture/walk.png";
import plantsmall from "../../public/images/animalpage/animal3.png";

const Agriculturefinal = ({ nextTitle, setNextTitleActive, scrollToLargeComponent, activeTitle }) => {
  // List of card data for the right side
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
  const [isCardVisible, setIsCardVisible] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true }); // Initialize AOS
  }, []);

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

  const handleBackgroundClick = () => {
    if (isCardVisible) {
      setIsCardVisible(false); // Close cards when clicking on background
    }
  };

  const handleNextTitle = () => {
    // console.log("Current nextTitle:", nextTitle); // Log current nextTitle
    setNextTitleActive(nextTitle); // Update the next title
    // console.log("Next title set. Now scrolling to the large component."); // Log the action of scrolling
    scrollToLargeComponent(); // Scroll to the large component
  };  

  return (
    <section className="pb-24 font-poppins" key={activeTitle}>
      {/* First Part  Main Agriculture */}
      <div className="relative lg:flex flex-row item-center justify-center lg:mx-10 hidden ">
        {/* First Left */}
        <div className="flex items-center gap-6" data-aos="fade-up">
          <div className="flex flex-col items-center">
            <Image
              src={walk}
              alt="rounded plant image below-1024:w-[500px] "
              data-aos="zoom-in"
            />
            <div className="bg-[#193048] rounded-full h-14 w-14 below-1192:hidden"></div>
          </div>
          <div className="flex-col space-y-5 max-w-[300px]">
            <h2
              className="text-[#000] font-bold text-[22px] font-poppinsSB"
              data-aos="fade-left"
            >
              Sustainable Agriculture Boost

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
              onClick={toggleCardVisibility}
              data-aos="fade-down"
            >
              See Products
              <span className="border-2 border-[#193048] rounded-full w-6 h-6 flex items-center justify-center ml-5">
                &gt;
              </span>
            </button>
          </div>
         
        </div>

        {/* Right Part with Cards */}
      
          <div className={`flex items-start ${isCardVisible?'opacity-100': 'opacity-0' }`}>
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
                <div
                  key={card.id}
                  className="max-w-[200px] flex flex-col h-full"
                 
                >
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
              className="bg-[#1F3B59] h-10 w-10 rounded-full flex justify-center items-center text-white ml-2 mt-36 "
              onClick={handleNext}
            >
              &gt;
            </button>
          </div>
          <div  className="absolute inset-x-0 bottom-[-40px] flex items-center justify-center pointer-events-none"data-aos="fade-down">  <Image src={plantsmall}
      alt="image of animal1"
      width={150}
      height={80}
      className="rounded-full object-contain"/></div >
      
      </div>

      {/* First part line     below-1276:scale-90 below-1276:ml-[-50px] below-1276:mt-[20px] below-1146:scale-75 below-1146:mr-[5%] below-1146:mt-[40px] below:1085p:mr[-40px] below-1085:mt-[40px] below:1030:mt-[-65px]*/}
      <div className=" lg:flex hidden items-center justify-center ml-[-180px] mt-[-20px] scale-80">
        {" "}
        {/* <Image src={linefirst} alt="horizontal line" /> */}
        <svg
          width="792"
          height="68"
          viewBox="0 0 792 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M791.5 65.5C623 66 255.606 65.5 134 65.5C78.0947 65.5 33.0415 36.5611 2.16925 1.5"
            stroke="#193048"
            strokeWidth="4"
            style={{
              strokeDasharray: 1000, // Total length of the path
              strokeDashoffset: 1000, // Start with the path hidden
              animation: "drawPath 6s ease forwards", // Apply the animation
            }}
          />
          <style>
            {`
      @keyframes drawPath {
        from {
          stroke-dashoffset: 0; // Start hidden
        }
        to {
          stroke-dashoffset: 2000; // End fully visible
        }
      }
    `}
          </style>
        </svg>
        <div className="relative">
          <button className="w-[300px] py-5 bg-[#1F3B59] font-poppinsSB absolute text-2xl rounded-2xl text-[#E6CFB7]" onClick={handleNextTitle}>
          {nextTitle}{" "}
          </button>
        </div>
      </div>

      {/* Mobile resposnive code  */}
      <div className="lg:hidden flex flex-row justify-center items-center   gap-5  pb-5 mx-5">
        <div className="flex items-center justify-center" data-aos="fade-up">
          <Image
            src={walk}
            alt="image of a job"
            className="max-w-[150px]"
          />
        </div>
        <div
          className="max-w-[350px] text-left flex flex-col items-left justify-center"
          data-aos="fade-up"
        >
          <h1 className="font-extrabold text-[#000] text-[18px] font-poppinsSB  text-left">
          Sustainable Agriculture Boost
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
              &gt;
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
                className="bg-[#1F3B59] h-10 w-10 rounded-full flex justify-center items-center text-white mr-4 mt-36"
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
                    data-aos="fade-left"
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
      <div className="flex flex-col items-center space-y-4 mt-5 lg:hidden font-poppinsSB">
          <button className="px-7 py-2 border-2 border-[#193048] text-[#193048] rounded-md hover:bg-[#1F3B59] hover:text-white transition-colors duration-300">
            Protected Agriculture
          </button>
          <button className="px-10 py-2 border-2 border-[#193048] text-[#193048] rounded-md hover:bg-[#1F3B59] hover:text-white transition-colors duration-300">
            Smart Agriculture
          </button>
          <button className="px-7 py-2 border-2 border-[#193048] text-[#193048] rounded-md hover:bg-[#1F3B59] hover:text-white transition-colors duration-300">
            Sustainable Farming
          </button>
          <button className="px-10 py-2 border-2 border-[#193048] text-[#193048] rounded-md hover:bg-[#1F3B59] hover:text-white transition-colors duration-300">
            Organic Products
          </button>
        </div>

      {/* <div className="sm:flex items-center justify-center ml-5 lg:hidden">
      <Image src={linemob} alt="image of line mob" className="w-[400px] "/>
    </div> */}
    </section>
  );
};

export default Agriculturefinal;
