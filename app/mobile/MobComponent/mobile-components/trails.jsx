import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import big4 from "../../../../public/images/logoanimation/bigdinning.png";
import big3 from "../../../../public/images/logoanimation/bigfarm.png";
import big1 from "../../../../public/images/logoanimation/bigmap.png";
import big2 from "../../../../public/images/logoanimation/bigwater.png";
import big5 from "../../../../public/images/logoanimation/image-big.png";

import Link from "next/link";
import four from "../../../../public/images/logoanimation/foursm.png";
import mahameru from "../../../../public/images/logoanimation/mahameru.png";
import one from "../../../../public/images/logoanimation/onesm.png";
import three from "../../../../public/images/logoanimation/threesm.png";
import two from "../../../../public/images/logoanimation/twosm.png";
import mobileImage from "../../../../public/mobile-images/mobileB.png";
import { useLanguage } from '../../../context/languageContext'; // Import useLanguage hook
import "../../../web/components/AnimationTrial.css";


const Trial = ({ missionMobileItems, translatedSeeProductsText }) => {

  const [triggerStates, setTriggerStates] = useState({
    trigger1: false,
    trigger2: false,
    trigger3: false,
    trigger4: false,
    trigger5: false,
    trigger6: false,
    trigger7: false,
    trigger8: false,
    trigger9: false,
    trigger10: false,
    trigger11: false,
    trigger12: false,
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const triggerRefs = useRef([]);
  const bigImages = [big1, big2, big3, big4, big5];
  const contents = [
    "‘Promoting sustainable cyclical farming practices’",
    "‘Enhancing animal welfare and nutrition’",
    "‘Farming as a lifestyle’",
    "‘Home food production - advancing agri tech innovation’",
    "‘Cultivating a healthy community connection’",
  ];
  
  const getCurrentImage = () => {
    if (!missionMobileItems) return null;
    if (triggerStates.trigger6) return missionMobileItems?.image5;
    if (triggerStates.trigger5) return missionMobileItems?.image4;
    if (triggerStates.trigger4) return missionMobileItems?.image3;
    if (triggerStates.trigger3) return missionMobileItems?.image2;
    if (triggerStates.trigger2) return missionMobileItems?.image1;
    return missionMobileItems?.image1; // Default image
  };
  
  const getCurrentContent = () => {
    if (!missionMobileItems) return null;
    if (triggerStates.trigger6) return missionMobileItems?.imageTitle5;
    if (triggerStates.trigger5) return missionMobileItems?.imageTitle4;
    if (triggerStates.trigger4) return missionMobileItems?.imageTitle3;
    if (triggerStates.trigger3) return missionMobileItems?.imageTitle2;
    if (triggerStates.trigger2) return missionMobileItems?.imageTitle1;
    return missionMobileItems?.imageTitle1; // Default content
  };

  // const getCurrentImage = () => {
  //   if (triggerStates.trigger6) return big4;
  //   if (triggerStates.trigger5) return big3;
  //   if (triggerStates.trigger4) return big5;
  //   if (triggerStates.trigger3) return big2;
  //   if (triggerStates.trigger2) return big1;
  //   return big1;
  // };

  // const getCurrentContent = () => {
  //   if (triggerStates.trigger6) return contents[4];
  //   if (triggerStates.trigger5) return contents[3];
  //   if (triggerStates.trigger4) return contents[2];
  //   if (triggerStates.trigger3) return contents[1];
  //   if (triggerStates.trigger2) return contents[0];
  //   return contents[0];
  // };

  const handleReadMore = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      setTriggerStates((prevStates) => {
        const newStates = { ...prevStates };

        entries.forEach((entry) => {
          const index = triggerRefs.current.indexOf(entry.target);
          if (index >= 0) {
            const triggerKey = `trigger${index + 1}`;

            if (entry.isIntersecting) {
              // When entering a trigger area, mark as true
              newStates[triggerKey] = true;
            } else if (entry.boundingClientRect.top > 0) {
              // When leaving from the top (scrolling up), mark as false
              newStates[triggerKey] = false;
            }
          }
        });

        return newStates;
      });
    }, observerOptions);

    // Observe each trigger point
    triggerRefs.current.forEach((trigger) => {
      if (trigger) observer.observe(trigger);
    });

    return () => {
      // Unobserve when component unmounts
      triggerRefs.current.forEach((trigger) => {
        if (trigger) observer.unobserve(trigger);
      });
    };
  }, []);

  return (
    <div className="relative" style={{ height: "6000px" }}>
      <div
        className="absolute top-[calc(5%)]"
        ref={(el) => (triggerRefs.current[1] = el)}
      ></div>
      <div
        className="absolute top-[calc(20%)]"
        ref={(el) => (triggerRefs.current[2] = el)}
      ></div>
      <div
        className="absolute top-[calc(30%)]"
        ref={(el) => (triggerRefs.current[3] = el)}
      ></div>
      <div
        className="absolute top-[calc(40%)]"
        ref={(el) => (triggerRefs.current[4] = el)}
      ></div>
      <div
        className="absolute top-[calc(50%)]"
        ref={(el) => (triggerRefs.current[5] = el)}
      ></div>
      <div
        className="absolute top-[calc(60%)]"
        ref={(el) => (triggerRefs.current[6] = el)}
      ></div>
      <div
        className="absolute top-[calc(70%)]"
        ref={(el) => (triggerRefs.current[7] = el)}
      ></div>
      <div
        className="absolute top-[calc(80%)]"
        ref={(el) => (triggerRefs.current[8] = el)}
      ></div>
      <div
        className="absolute top-[calc(90%)]"
        ref={(el) => (triggerRefs.current[9] = el)}
      ></div>
      <div
        className="absolute top-[calc(100%)]"
        ref={(el) => (triggerRefs.current[10] = el)}
      ></div>

      {/* Right Section Only */}
      <section className="sticky top-0 h-screen bg-banner-main w-screen flex flex-col items-center justify-center font-poppins">
        <div className="flex items-start flex-col justify-center gap-6">
          {/* Check for trigger7 */}
          {triggerStates.trigger7 && !triggerStates.trigger8 && (
            // !triggerStates.trigger9 &&
            // !triggerStates.trigger10 &&
            <div
              className={`${triggerStates.trigger7 ? "visible" : "invisible"}`}
              style={{
                animation: triggerStates.trigger7
                  ? "fadeIn 1s ease-out forwards, fadeOut 1s ease-out 3s forwards" // Added fadeOut animation
                  : "fadeOut 0.5s ease-out forwards", // Fade out when not visible
              }}
            >
              <Image src={missionMobileItems?.logo} alt="image of mahameru logo" width={300} height={400} />

              <style jsx>{`
                /* Fade-in animation */
                @keyframes fadeIn {
                  0% {
                    opacity: 0;
                  }
                  100% {
                    opacity: 1;
                  }
                }

                /* Fade-out animation */
                @keyframes fadeOut {
                  0% {
                    opacity: 1;
                  }
                  100% {
                    opacity: 0;
                  }
                }

                /* Initial fade-in and grow animation */
                @keyframes fadeInGrowSlideDown {
                  0% {
                    opacity: 0;
                    transform: scale(0.5) translateY(-100px);
                  }
                  100% {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                  }
                }

                /* Shrink, move up, and fade out animation */
                @keyframes shrinkMoveUpFadeOut {
                  0% {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                  }
                  100% {
                    opacity: 0;
                    transform: scale(0.5) translateY(-100px);
                  }
                }
              `}</style>
            </div>
          )}

          {/* Check for trigger8 */}

          {/* Check for trigger8 */}
          {triggerStates.trigger8 && (
            <div className="bg-no-repeat bg-bottom bg-screen w-full flex items-center justify-center h-screen">
              <div className="flex flex-col items-center justify-center gap-10 max-w-[500px] z-30">
                {/* Animated Logo */}
                <Image
                  src={missionMobileItems?.logo}
                  width={150}
                  height={150}
                  alt="small"
                  className="mb-0"
                  style={{
                    width: "150px",
                    height: "150px",
                    animation: "slideUp 1s ease-out forwards",
                  }}
                />

                {/* Animated Text Content */}
                <div
                  style={{
                    opacity: 0,
                    animation: "fadeIn 1s ease-out forwards",
                    animationDelay: "1s",
                  }}
                  className="flex flex-col items-center justify-center"
                >
                  <h1
                    className="text-[#193048] text-2xl mb-0 font-poppinsSB text-center" // Keeping font-poppinsSB
                    style={{
                      color: "#193048",
                      fontSize: "1.5rem", // Adjust based on your design
                      marginBottom: 0,
                      fontFamily: "PoppinsSB", // Inline style to ensure PoppinsSB is used
                      fontWeight: "600", // Semi-bold for "SB" style
                      textAlign: "center",
                    }}
                  >
                    {missionMobileItems?.pioneerTitle}
                  </h1>
                  <p
                    className="text-black text-center text-md font-poppins"
                    style={{
                      color: "black",
                      fontFamily: "Poppins",
                      fontSize: "1.125rem", // Adjust based on your design
                      textAlign: "center",
                      margin: "0", // Optional: remove default margin
                      lineHeight: "1.6", // Adjust for better readability
                    }}
                  >
                    {missionMobileItems?.pioneerSubtitle}
                  </p>

                  <Link href="/about" passHref>
                    <button className="text-[#193048] font-poppinsSB border border-[#193048] px-10 py-2 mt-8 rounded-md hover:bg-[#193048] hover:text-[#E6CFB7] transition">
                    {translatedSeeProductsText || 'Read More'}
                    </button>
                  </Link>
                </div>
              </div>

              {/* Inline Keyframes using <style> */}
              <style jsx>{`
                @keyframes slideUp {
                  0% {
                    transform: translateY(100%);
                    opacity: 0;
                  }
                  100% {
                    transform: translateY(0);
                    opacity: 1;
                  }
                }

                @keyframes fadeIn {
                  0% {
                    opacity: 0;
                    transform: translateY(20px);
                  }
                  100% {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
              <div className="absolute bottom-0 left-0 right-0 z-10">
                <Image
                  src={mobileImage}
                  alt="Mobile Banner"
                  layout="responsive"
                  priority
                  objectFit="cover"
                />
              </div>
            </div>
          )}

          {/* Check for trigger10 */}
          {/* {triggerStates.trigger10 && (
            <div className="bg-no-repeat bg-bottom bg-contain w-screen flex items-center justify-center h-screen">
              <div
                className={`flex flex-col items-center justify-center gap-10 max-w-[600px]`}
              >
                <h2>Valiya Myr</h2>
              </div>
            </div>
          )} */}

          {/* Default content if none of the triggers are active */}
          {!triggerStates.trigger7 && !triggerStates.trigger8 && (
            // !triggerStates.trigger9 &&
            // !triggerStates.trigger10 &&
            <>
              <div className="flex items-center mt-24 justify-center">
                <div
                  className={`flex animate-item ${
                    triggerStates.trigger3 ? "visible" : "invisible"
                  }`}
                >
                  <Image
                    src={missionMobileItems?.smallImage1}
                    alt="image1"
                    width={100}
                    height={100}
                    className="rounded-[100%] h-[100px] w-[100px]"
                  />
                </div>
                <div
                  className={`flex animate-item ${
                    triggerStates.trigger4 ? "visible" : "invisible"
                  }`}
                >
                  <Image
                    src={missionMobileItems?.smallImage2}
                    alt="image2"
                    width={100}
                    height={100}
                    className="rounded-[150%] h-[100px] w-[100px]"
                  />
                </div>
                <div
                  className={`flex animate-item ${
                    triggerStates.trigger5 ? "visible" : "invisible"
                  }`}
                >
                  <Image
                    src={missionMobileItems?.smallImage3}
                    alt="image3"
                    width={100}
                    height={100}
                    className="rounded-[100%] h-[100px] w-[100px]"
                  />
                </div>
                <div
                  className={`flex animate-item ${
                    triggerStates.trigger6 ? "visible" : "invisible"
                  }`}
                >
                  <Image
                    src={missionMobileItems?.smallImage4}
                    alt="image4"
                    width={100}
                    height={100}
                    className="rounded-[100%] h-[100px] w-[100px]"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-10 w-full">
                <div
                  className={`animate-item ${
                    triggerStates.trigger2 ? "visible" : "invisible"
                  }`}
                >
                  <Image
                    src={getCurrentImage()}
                    alt="A big image"
                    className="w-[320px] h-[350px] mt-5"
                    width={320}
                    height={350}
                  />
                </div>
                <div
                  className={`animate-item ${
                    triggerStates.trigger2 ? "visible" : "invisible"
                  }`}
                >
                  <h1
                    className="font-bold text-2xl max-w-[400px] font-poppinsM text-[#193048] text-center"
                    style={{
                      fontFamily: "PoppinsM", // Ensure the correct font is applied
                      fontWeight: "700", // Corresponds to Tailwind's 'font-bold'
                      color: "#193048", // Ensure color is applied
                      fontSize: "1.5 rem", // Corresponds to Tailwind's 'text-3xl'
                      maxWidth: "400px", // Corresponds to Tailwind's 'max-w-[400px]'
                      textAlign: "center", // Corresponds to Tailwind's 'text-center'
                    }}
                  >
                    {getCurrentContent()}
                  </h1>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="bg-mob-banner"></div>
      </section>
    </div>
  );
};

export default Trial;