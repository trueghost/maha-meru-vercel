import { useEffect, useState } from "react";

import "swiper/css";
import "swiper/css/autoplay"; // Import autoplay styles
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const CustomerStories = ({ title6, stories }) => {

  const [index, setIndex] = useState(0); // State to handle slide index for manual navigation
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); // State to track screen size

  // Update `isMobile` on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Slider navigation functions
  const nextReview = () => {
    setIndex((prevIndex) => (prevIndex + 1) % stories?.length);
  };

  const prevReview = () => {
    setIndex((prevIndex) => (prevIndex - 1 + stories?.length) % stories?.length);
  };

  const visibleStories = stories?.filter((story) => story?.hide !== 1);

  return (
    <div className="max-w-5xl mx-auto font-poppins lg:pt-10 lg:pb-10">
      <div className="flex justify-center lg:justify-between items-center mb-6 px-4">
        <h1
          className="text-3xl text-[#193048] font-poppinsSB font-bold"
          style={{ fontFamily: "PoppinsSB", fontWeight: "400" }}
        >
          {title6}
        </h1>
        <div className="hidden gap-5 lg:flex">
          {/* Previous and Next Buttons for larger screens */}
          {visibleStories?.length > 0 && (
            <>
              <button
                className="bg-[#FAFBFA] h-[50px] w-[50px] flex justify-center items-center cursor-pointer hover:bg-gray-200 transition-all duration-300 ease-in-out"
                onClick={prevReview}
              >
                <img src="/images/arrow-left.png" alt="previous" />
              </button>
              <button
                className="bg-[#FAFBFA] h-[50px] w-[50px] flex justify-center items-center cursor-pointer hover:bg-gray-200 transition-all duration-300 ease-in-out"
                onClick={nextReview}
              >
                <img src="/images/arrow-right.png" alt="next" />
              </button>
            </>
          )}
        </div>
      </div>

        <div className="overflow-hidden relative">
          {/* Swiper Component for screens below 1024px */}
          {isMobile && (
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              autoplay={{
                delay: 3000, // 3 seconds per slide
                disableOnInteraction: false,
              }}
              modules={[Autoplay]} // Use only Autoplay module
              className="w-full"
            >
              {stories?.filter((story) => story?.hide !== 1).map((story, i) => (
                <SwiperSlide key={i}>
                  <div className="group border border-[#E2E9E0] p-12 rounded-md shadow-lg flex gap-7 lg:h-[325px] h-[350px] hover:bg-[#193048] transition-all duration-300 ease-in-out">
                    <img
                      src="/images/Quote-icon.svg"
                      alt="quote icon"
                      className="w-10 h-10 group-hover:invert-[90%] group-hover:sepia group-hover:brightness-[70%] group-hover:hue-rotate-[150deg] group-hover:saturate-[700%] group-hover:contrast-[1.2]"
                    />
                    <div className="flex-col flex justify-between">
                      <p
                        className={`text-gray-600 text-base mb-4 font-normal group-hover:text-[#E6CFB7]`}
                      >
                        {story?.review}
                      </p>
                      <div className="flex items-center mt-4">
                        <img
                          src={story?.image}
                          alt={story?.name}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <h4 className="text-sm font-semibold text-[#798076] group-hover:text-[#E6CFB7] font-poppins">
                            {story?.name}
                          </h4>
                          <span className="text-sm text-[#232323] group-hover:text-[#E6CFB7] font-poppins">
                            {story?.designation}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {/* For larger screens, display stories with manual pagination */}
          {!isMobile && (
            <div
              className="flex flex-col lg:flex-row transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${index * 50}%)` }}
            >
              {stories?.filter((story) => story?.hide !== 1).map((story, i) => (
                <div
                  key={i}
                  className="flex-none w-full lg:w-1/2 p-4 box-border"
                >
                  <div className="group border border-[#E2E9E0] p-12 rounded-md shadow-lg flex gap-7 h-[325px] hover:bg-[#193048] transition-all duration-300 ease-in-out">
                    <img
                      src="/images/Quote-icon.svg"
                      alt="quote icon"
                      className="w-10 h-10 group-hover:invert-[90%] group-hover:sepia group-hover:brightness-[70%] group-hover:hue-rotate-[150deg] group-hover:saturate-[700%] group-hover:contrast-[1.2]"
                    />
                    <div className="flex-col flex justify-between">
                      <p
                        className={`text-gray-600 text-base mb-4 font-normal group-hover:text-[#E6CFB7]`}
                      >
                        {story?.review}
                      </p>
                      <div className="flex items-center mt-4">
                        <img
                          src={story?.image}
                          alt={story?.name}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <h4 className="text-sm font-semibold text-[#798076] group-hover:text-[#E6CFB7] font-poppins">
                            {story?.name}
                          </h4>
                          <span className="text-sm text-[#232323] group-hover:text-[#E6CFB7] font-poppins">
                            {story?.designation}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

    </div>
  );
};

export default CustomerStories;
