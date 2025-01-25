'use client';
import AOS from "aos";
import 'aos/dist/aos.css';
import Image from "next/image";
import { forwardRef, useEffect, useState } from "react";
import smallplant from '../../public/images/agriculture page/agriculture/plant.svg';
import { useLanguage } from "../context/languageContext";

// eslint-disable-next-line react/display-name
const Largecomponent = forwardRef(({ buttonTitles, agricultureItems, setActiveButton, setNextTitle, nextTitle, nextTitleActive, activeTitle, setNextTitleActive }, ref) => {
  const [activeButtonTitle, setActiveButtonTitle] = useState("Land Rejuvenation");
  const { language } = useLanguage();
  
  // Handle button click
  const handleClick = (buttonName) => {
    setActiveButton(buttonName); // Set the active button title
    setActiveButtonTitle(buttonName);
    setNextTitleActive(buttonName);

    const newNextTitle = getNextTitle(buttonName); // Get the next title
    if (newNextTitle !== nextTitle) {
      setNextTitle(newNextTitle); // Only update nextTitle if it has changed
    }
  };

  // const getNextTitle = (currentTitle) => {
  //   const currentIndex = buttonTitles.indexOf(currentTitle);
  //   const nextIndex = (currentIndex + 1) % buttonTitles.length;
  //   return buttonTitles[nextIndex];
  // };

  const getNextTitle = (currentTitle) => {
    // console.log(buttonTitles)
    // console.log(currentTitle)
    const currentIndex = buttonTitles.findIndex(title => title.original === currentTitle);
    const nextIndex = (currentIndex + 1) % buttonTitles.length;
    // console.log(buttonTitles[nextIndex]?.original || "")
    return buttonTitles[nextIndex]?.original || ""; // Return the next original title
  };  

  // Initialize AOS for animations
  useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
  }, [activeButtonTitle]);

  // Effect to react to changes in nextTitleActive
  useEffect(() => {
    if (buttonTitles.length > 0) {
      const titleToSet = nextTitleActive || activeTitle;
      if (titleToSet) {
        // console.log("Title to set:", titleToSet);
        setActiveButton(titleToSet);
        setActiveButtonTitle(titleToSet);
  
        const newNextTitle = getNextTitle(titleToSet);
        // console.log("New Next Title:", newNextTitle);
        setNextTitle(newNextTitle);
      }
    }
  }, [nextTitleActive, activeTitle, buttonTitles]);  

  return (
    <section ref={ref} className="w-full flex flex-col items-center justify-center pb-5 relative font-poppinsSB">
      {/* Desktop View */}
      <div className="hidden lg:flex w-full flex-col items-center space-y-5">
        <div className="flex w-full max-w-4xl justify-between space-x-4 mb-4">
          {buttonTitles.slice(0, 3).map((title, index) => (
            <button
              key={index}
              className="text-[#FBF6F1] rounded-lg text-[22px] px-5 py-3 flex-1 z-20 font-poppinsSB"
              style={{ backgroundColor: activeButtonTitle === title.original ? "#897662" : "#314559" }}
              onClick={() => handleClick(title.original)} // Pass the original title to handleClick
              data-aos="fade-up"
            >
              {language === 'en' ? title.original : title.translated}
            </button>
          ))}
        </div>
        <div className="flex w-full max-w-2xl justify-center space-x-4 font-poppinsSB">
          {buttonTitles.slice(3).map((title, index) => (
            <button
              key={index + 3}
              className="text-[#FBF6F1] rounded-lg text-[22px] px-5 py-3 flex-1 font-poppinsSB"
              style={{ backgroundColor: activeButtonTitle === title.original ? "#897662" : "#314559" }}
              onClick={() => handleClick(title.original)} // Pass the original title to handleClick
              data-aos="fade-up"
            >
              {language === 'en' ? title.original : title.translated}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden w-full flex justify-start mt-[-80px] font-poppinsSB overflow-x-auto overflow-y-hidden scrollbar-hide">
        <div className="flex space-x-4 px-2 pl-20">
          {buttonTitles.map((title, index) => {
            // Calculate image index based on the number of buttons and images
            const imageIndex = index % agricultureItems.length; // This ensures repetition
            const imageSrc = agricultureItems.length > 0 ? agricultureItems[imageIndex].plantSmallImage : smallplant;

            return (
              <div key={index} className="flex flex-col items-center">
                {/* Render the image above the button */}
                <Image
                  src={imageSrc}
                  alt={`Image for ${title.original}`}
                  width={120}
                  height={60}
                  className={`object-contain max-w-[120px] max-h-[60px] mb-2 transition-opacity duration-300 ${
                    activeButtonTitle === title.original ? "opacity-100" : "opacity-0"
                  }`}
                />
                <button
                  onClick={() => {
                    handleClick(title.original); // Pass the original title to handleClick
                  }}
                  className={`text-[#FBF6F1] text-[22px] rounded-lg px-5 py-3 whitespace-nowrap transition-colors duration-300`}
                  style={{ backgroundColor: activeButtonTitle === title.original ? "#314559" : "#897662" }}
                >
                  {language === 'en' ? title.original : title.translated}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default Largecomponent;