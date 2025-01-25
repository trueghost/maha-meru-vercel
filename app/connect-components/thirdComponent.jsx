import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import Image from "next/image";
import { useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// import four from "../../public/images/connect/third-section/four.png";
// import one from "../../public/images/connect/third-section/one.png";
// import three from "../../public/images/connect/third-section/three.png";
// import two from "../../public/images/connect/third-section/two.png";

// Data for the cards (initially in English, you can update to include all languages if needed)
// const cardsData = [
//   {
//     image: one,
//     label: "Agriculture",
//     content: "This is detailed agriculture content.",
//   },
//   {
//     image: two,
//     label: "Industry",
//     content: "This is detailed industry content.",
//   },
//   {
//     image: three,
//     label: "Technology",
//     content: "This is detailed technology content.",
//   },
//   {
//     image: four,
//     label: "Education",
//     content: "This is detailed education content.",
//   },
//   {
//     image: three,
//     label: "Technology",
//     content: "This is detailed technology content.",
//   },
// ];

const ThirdComponent = ({ title2, connect }) => {

  useEffect(() => {
    // Initialize AOS for animations
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section className="flex flex-col items-center justify-center mb-10 font-poppins">
      {/* Header */}
      <div
        className="text-center mb-10"
        data-aos="fade-up" // Animation for heading
        data-aos-delay="0" // No delay, appears first
      >
        <h5
          className="font-Poppins text-[#193048] font-poppinsSB mx-5 font-semibold text-3xl lg:text-4xl leading-tight md:leading-snug lg:leading-normal"
          style={{
            fontFamily: "PoppinsSB",
            color: "#193048",
            fontSize: "1.875rem", // Equivalent to text-3xl in Tailwind
            fontWeight: "400", // Equivalent to font-semibold in Tailwind
          }}
        >
          {title2}
        </h5>
      </div>

      {/* Swiper Container */}
      <Swiper
          modules={[Autoplay]}
          spaceBetween={10} // Space between slides
          autoplay={{
            delay: 800,
           
          }}
        breakpoints={{
          640: {
            slidesPerView: 1, // 1 slide for small screens (below 640px)
          },
          768: {
            slidesPerView: 2, // 2 slides for tablet screens
          },
          1024: {
            slidesPerView: 3, // 3 slides for medium screens
          },
          1280: {
            slidesPerView: 4, // 4 slides for large screens
          },
        }}
        className="w-full flex flex-row items-center justify-center px-4 xl:px-0 font-poppins whitespace-nowrap above-1900:w-[1400px] below-640:w-[350px]"
      >
        {connect?.map((card, index) => (
          <SwiperSlide key={index}>
            <div
              className=" p-4 relative flex items-center justify-center   w-[350px] h-[400px] group"
              data-aos="fade-up" // AOS animation for each card
            >
              <div className="relative w-full h-full overflow-hidden">
                {/* Image of the card */}
                <Image
                  className="w-full h-full object-cover"
                  src={card?.image}
                  alt={`image of ${card?.title.toLowerCase()}`}
                  width={300}
                  height={300}
                />

                {/* Initially visible label (hidden on hover) */}
                <div className="absolute bottom-0 left-0 right-0 text-white text-center py-2 transition-all duration-1000 ease-in-out opacity-100 group-hover:opacity-0">
                  <p>{card?.title}</p>
                </div>

                {/* Hover content */}
                <div className="absolute inset-0 opacity-0 transition-all duration-1000 ease-in-out transform group-hover:translate-y-0 group-hover:opacity-100 flex flex-col justify-center items-center text-white p-4">
                  <h3 className="text-xl font-bold mb-2">{card?.title}</h3>
                  <p className="text-center">{card?.description}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Tailwind CSS class to hide scrollbars */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none; /* Internet Explorer 10+ */
          scrollbar-width: none; /* Firefox */
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }
      `}</style>
    </section>
  );
};

export default ThirdComponent;
