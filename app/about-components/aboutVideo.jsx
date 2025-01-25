import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { useLanguage } from "../context/languageContext"; // Import language context

const Aboutvideo = ({ title6, title7, subtext }) => {
  const [isPlaying, setIsPlaying] = useState(false); // State to manage play

  // Video URL
  const autoplayUrl = `${title7}?autoplay=1&mute=1`; // Video URL with autoplay and mute

  return (
    <section className="mt-16 flex flex-col items-center justify-center w-screen font-poppinsSB">
      {/* Text Section */}
      <div className="text-center mb-8 font-poppins">
        <h3 className="text-[#314559] font-bold text-[38px] font-poppinsSB pb-5"
          style={{
            fontFamily: "PoppinsSB",
            color: "#193048",
            fontSize: "1.875rem", // Equivalent to text-3xl in Tailwind
            fontWeight: "400", // Equivalent to font-semibold in Tailwind
          }}
        >
          {title6}
        </h3>
        <p className="text-[#314559] font-extralight text-[28px]">
          {subtext}
        </p>
      </div>

      {/* Video Section */}
      <div className="relative w-full max-w-[800px] aspect-video rounded-2xl overflow-hidden flex items-center justify-center">
        {/* YouTube Video with lazy loading */}
        <iframe
          className="w-[800px] h-[400px] rounded-2xl"
          src={isPlaying ? autoplayUrl : title7} // Toggle between autoplay+mute and default URL
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy" // Lazy load the iframe
        ></iframe>

        {/* Play Icon Overlay */}
        {!isPlaying && (
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={() => setIsPlaying(true)} // Set the state to play the video
          >
            <FaPlay className="text-white text-6xl opacity-80" />
          </div>
        )}
      </div>
    </section>
  );
};

export default Aboutvideo;
