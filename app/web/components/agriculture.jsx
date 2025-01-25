"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper and SwiperSlide correctly
import "./AnimationTrial.css";

const Agriculture = ({ title3, subtext3, items, hovered, setHovered }) => {

  const router = useRouter();

  // Navigation handlers
  const handleNavigation = (link) => {
    router.push(link);
  };

  return (
    <section
    className={`object-cover bg-no-repeat w-screen px-5 pt-10 font-poppins ${
      hovered ? "min-h-[800px]" : "min-h-[600px]"
    }`}
  >
    {/* Content and Title */}
    <div className="flex flex-col items-center justify-center">
      <div className="text-center">
        <h1
          className="text-3xl lg:text-4xl font-semibold font-poppinsSB text-[#193048]"
          style={{
            fontFamily: "PoppinsSB",
            color: "#193048",
            fontSize: "1.875rem",
            fontWeight: "400",
          }}
        >
          {title3}
        </h1>
        <p className="flex justify-center text-md text-center font-medium max-w-[1200px] font-poppins text-black mt-5">
          {subtext3}
        </p>
      </div>
    </div>
  
    {/* Layout for screens above 1024px */}
    <div className="hidden lg:flex flex-row items-center justify-center pt-[40px] gap-10">
      {items
        ?.filter((section) => !section.is_mobile_image)
        .map((section) => (
          <div
            key={section?.id}
            className="relative max-w-[250px] text-center"
          >
            {/* Image Hover Area */}
            <div
              className="relative overflow-hidden cursor-pointer"
              onMouseEnter={() => setHovered(section?.id)} // Trigger hover state only when entering image container
              onMouseLeave={() => setHovered(null)} // Reset hover state when leaving image container
              onClick={() => handleNavigation(section?.link)}
            >
              <Image
                src={section?.image_url}
                width={350}
                height={250}
                className={`h-[350px] w-[250px] rounded-lg transition-transform duration-500 ease-in-out transform filter ${
                  hovered === section?.id
                    ? "brightness-100 scale-110" // Remove blue tint and brighten the image
                    : "brightness-75"
                }`}
                alt={`image of agriculture`}
              />
              <h4
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl font-poppinsSB font-extrabold transition-opacity duration-500 ease-in-out ${
                  hovered === section?.id ? "opacity-0" : "opacity-100"
                }`}
              >
                {section?.title}
              </h4>
            </div>
  
            {/* Content Below Image */}
            <div
              className={`min-h-[200px] transition-opacity duration-500 ease-in-out ${
                hovered === section?.id ? "opacity-100" : "opacity-0"
              }`}
            >
              <h5 className="text-[#193048] font-poppinsSB font-extrabold text-2xl mt-6">
                {section?.category}
              </h5>
              <p className="text-[#193048] font-medium text-[14px] font-poppins mt-4">
                {section?.description}
              </p>
            </div>
          </div>
        ))}
    </div>

      {/* Layout for screens below 1024px */}
      <div className="lg:hidden flex flex-col items-center justify-center pt-[40px] scale-90 gap-10 font-poppins pb-10">
        <Swiper
          spaceBetween={20}
          modules={[Autoplay]}
          slidesPerView={1}
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
          className="w-full max-w-[350px]"
        >
          {items
            ?.filter((section) => section?.is_mobile_image)
            .map((section) => (
              <SwiperSlide key={section?.id}>
                <div
                  className="relative w-full text-center"
                  onMouseEnter={() => setHovered(section?.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleNavigation(section?.link)}
                >
                  <Image
                    src={section?.image_url}
                    width={400}
                    height={300}
                    className="w-full h-[300px] rounded-t-2xl"
                    alt={`image of agriculture`}
                  />
                  <div className="border-x-[4px] border-b-[4px] border-[#193048] rounded-b-2xl pt-5 min-h-[300px]">
                    <h5 className="text-[#193048] font-extrabold font-poppinsSB text-3xl">
                      {section?.title}
                    </h5>
                    <p className="text-[#193048] font-medium text-lg mt-2 px-2 pb-16">
                      {section?.description}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Agriculture;
