import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";


function TrendingProducts({ title4, products, translatedLearnMoreText, hovered }) {

  const Card = ({ title, image, content, subtitle, link }) => (
    <div className="overflow-x-hidden card flex flex-col p-[30px] rounded-lg border-[#FBF6F1] w-[308px] h-[400px] group shrink-0 font-poppins">
      <div
        className="h-full relative group-hover:scale-110 transform transition-transform cursor-pointer"
        onClick={() => (window.location.href = link)}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-xl"
        />
        <div className="flex flex-col items-center justify-between absolute bottom-0 w-full rounded-2xl bg-black/30 backdrop-blur-lg p-4 h-auto">
          <div className="text-white mb-2">
            <p className="text-[14px] text-center font-poppins">{subtitle}</p>
          </div>
          <div className="card-title text-[16px] font-semibold font-poppinsSB text-white flex items-center justify-center text-center w-full">
            <h3>{title}</h3>
          </div>
          <div className="text-white mb-2">
            <p className="text-[12px] text-center font-poppins">{content}</p>
          </div>
          <button
            className="card-learn-more border-[1px] bg-white rounded-xl py-1 px-12"
            onClick={() => (window.location.href = link)}
          >
            <h1 className="text-[#193048] font-extrabold text-[14px] font-poppinsSB">
            {translatedLearnMoreText || 'Learn More'}
            </h1>
          </button>
        </div>
      </div>
    </div>
  );
  

  return (
    
    // <div
    //     className={w-full flex items-center justify-center lg:mt-[-80px] mt-10 transition-all duration-500 ease-in-out ${hovered ? "transform translate-y-10" : "transform translate-y-0"}}
    //   >
    //   <div className="px-5 w-full max-w-[1440px] ">
    //     <h1
    //       className="text-4xl mb-0  text-center text-[#193048] font-poppinsSB font-semibold"
    //       style={{
    //         fontFamily: "PoppinsSB",
    //         color: "#193048",
    //         fontSize: "1.875rem", // Equivalent to text-3xl in Tailwind
    //         fontWeight: "600", // Equivalent to font-semibold in Tailwind
    //       }}
    //     >
    //       {title}
    //     </h1>
    //     <div className="flex space-x-1 overflow-x-auto scrollbar-hide overflow-y-hidden pb-2 lg:items-center lg:justify-center">
    //       {isLoading ? (
    //         <p>Loading...</p>
    //       ) : (
    //         products.map((product, index) => (
    //           <Card
    //             key={index}
    //             title={product.title}
    //             image={product.image}
    //             content={product.content}
    //             subtitle={product.subtitle}
    //             link={product.link} // Assuming each product has a link property
    //           />
    //         ))
    //       )}
    //     </div>
    //     <style>
    //       {`
    //         div::-webkit-scrollbar {
    //           display: none; /* For Chrome, Safari, and Opera */
    //         }
    //       `}
    //     </style>
    //   </div>
    // </div>

    <div
    className={`w-full overflow-x-hidden flex items-center justify-center lg:mt-[-80px] mt-10 lg:transition-all lg:duration-500 lg:ease-in-out ${
      hovered ? "lg:transform lg:translate-y-10" : "lg:transform lg:translate-y-0"
    }`}
  >
    <div className="px-5">
      <h1
        className="text-4xl mb-0 text-center text-[#193048] font-poppinsSB font-semibold"
        style={{
          fontFamily: "PoppinsSB",
          color: "#193048",
          fontSize: "1.875rem",
          fontWeight: "600",
        }}
      >
          {title4}
      </h1>
        <Swiper
          spaceBetween={0}
          modules={[Autoplay]}
          slidesPerView="auto"
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { // Small screens
              slidesPerView: 1,
            },
            768: { // Medium screens
              slidesPerView: 2,
            },
            1024: { // Large screens
              slidesPerView: 3,
            },
          }}
          className="pb-10 max-w-[300px] lg:max-w-[900px]"
        >
          {products?.map((product, index) => (
            <SwiperSlide key={index} className="w-auto">
              <Card
                key={index}
                title={product?.title}
                image={product?.image}
                content={product?.content}
                subtitle={product?.subtitle}
                link={product?.link} // Assuming each product has a link property
              />
            </SwiperSlide>
          ))}
        </Swiper>

    </div>
  </div>
  );
}

export default TrendingProducts;