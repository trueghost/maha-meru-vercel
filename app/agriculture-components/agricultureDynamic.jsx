"use client";
import { Player } from "@lottiefiles/react-lottie-player";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react"; // Import createRef here
import "../../app/web/components/AnimationTrial.css";
// import plant from "../../public/images/agriculture page/agriculture/plant.png";
// import plantsmall from "../../public/images/agriculture page/agriculture/plant.svg";
import animationLineFinal from "../../public/images/animationLineFinal.json";
import animationLineLeft from "../../public/images/animationLineLeft.json";
import animationLineLeftMobile from "../../public/images/animationLineLeftMobile.json";
import animationLineRight from "../../public/images/animationLineRight.json";
import animationLineRightMobile from "../../public/images/animationLineRightMobile.json";
import { useLanguage } from "../context/languageContext";

// Different arrays of sections based on active titles


// const sections = {
//   "Land Rejuvenation": [
//     {
//       id: 1,
//       title: "Fallow Land Rejuvenation 1",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwad",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: plantsmall, // Path to small plant image
//     },
//     {
//       id: 2,
//       title: "Fallow Land Rejuvenation 2",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwa",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: plantsmall, // Path to small plant image
//     },
//     {
//       id: 3,
//       title: "Fallow Land Rejuvenation 3",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwa",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: plantsmall, // Path to small plant image
//     },
//     {
//       id: 4,
//       title: "Fallow Land Rejuvenation 4",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwa",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: plantsmall, // Path to small plant image
//     },
//     {
//       id: 5,
//       title: "Fallow Land Rejuvenation 5",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwa",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: plantsmall, // Path to small plant image
//     },
//     // Add more details related to this title if needed
//   ],
//   "Pet & Sun Control": [
//     {
//       id: 1,
//       title: "Fallow Land Rejuvenation 4",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity.",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: plantsmall, // Path to small plant image
//     },
//     {
//       id: 2,
//       title: "Fallow Land Rejuvenation 5",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity.",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: plantsmall, // Path to small plant image
//     },
//     {
//       id: 3,
//       title: "Fallow Land Rejuvenation 6",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity.",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: plantsmall, // Path to small plant image
//     },
//     // Add more details related to this title if needed
//   ],
//   "Protected Agriculture": [
//     {
//       id: 1,
//       title: "Fallow Land Rejuvenation 7",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity.",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: plantsmall, // Path to small plant image
//     },
//     {
//       id: 2,
//       title: "Fallow Land Rejuvenation 8",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity.",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: plantsmall, // Path to small plant image
//     },
//     {
//       id: 3,
//       title: "Fallow Land Rejuvenation 9",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity.",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: plantsmall, // Path to small plant image
//     },
//   ],
//   "Urban Farming": [
//     {
//       id: 1,
//       title: "Fallow Land Rejuvenation 10",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity.",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: plantsmall, // Path to small plant image
//     },
//     {
//       id: 2,
//       title: "Fallow Land Rejuvenation 11",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity.",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: plantsmall, // Path to small plant image
//     },
//     {
//       id: 3,
//       title: "Fallow Land Rejuvenation 12",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity.",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: plantsmall, // Path to small plant image
//     },
//   ],
//   "Indoor AgTech Solutions": [
//     {
//       id: 1,
//       title: "Fallow Land Rejuvenation 13",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity.",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: plantsmall, // Path to small plant image
//     },
//     {
//       id: 2,
//       title: "Fallow Land Rejuvenation 14",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity.",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: plantsmall, // Path to small plant image
//     },
//     {
//       id: 3,
//       title: "Fallow Land Rejuvenation 15",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity.",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: plantsmall, // Path to small plant image
//     },
//   ],
// };

const AgricultureDynamic = ({
  sections, 
  agricultureTitlesItems,
  translatedSeeProductsText,
  translatedNextTitle, 
  products,
  activeTitle,
  nextTitle,
  setNextTitleActive,
  scrollToLargeComponent,
  setActiveTitle,
  isLoading,
}) => {
  const router = useRouter();
  // const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const players = useRef([]);
  const playersMobile = useRef([]);
  const { language } = useLanguage(); // Get current language
  
  // Access the specific section array based on the activeTitle
  const activeSections = sections.filter(
    (section) => section.section === activeTitle
  );
  // const activeSections = sections[activeTitle] || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleSection, setVisibleSection] = useState(null); // Track the visible section

  // useEffect(() => {
  //   console.log("activeTitle has changed:", activeTitle);
  // }, [activeTitle]);
  
  // useEffect(() => {
  //   console.log("nextTitle has changed:", nextTitle);
  // }, [nextTitle]);  

  const [hasScrolled, setHasScrolled] = useState(false); // Flag to track scroll completion  

  useEffect(() => {
    const scrollToSection = () => {
      if (isLoading || !agricultureTitlesItems.length || !sections.length || hasScrolled) {
        return;
      }
  
      const hash = window.location.hash; // Get the hash part of the URL
      if (hash) {
        const sectionId = hash.substring(1); // Remove the leading "#"
        const sectionName = sectionId.split("-")[0]; // Extract the part before the "-"
  
        // Find the corresponding title based on the section hash
        const matchedTitle = agricultureTitlesItems.find((item) => {
          const titleString = item?.title || '';
          return titleString.replace(/\s+/g, "") === sectionName;
        });
  
        if (matchedTitle && !hasScrolled) {
          const titleWithSpaces = matchedTitle?.title || matchedTitle; // Ensure you're extracting the correct property for the title with spaces
          setActiveTitle(titleWithSpaces);
        }
  
        // Now find the section element to scroll to
        const element = document?.getElementById(sectionId);
        if (element) {
          // Listen for the scroll event to check when the scrolling is finished
          const onScroll = () => {
            const elementRect = element.getBoundingClientRect();
            if (elementRect.top <= window.innerHeight && elementRect.bottom >= 0) {
              // Scroll finished: remove hash and cleanup event listener
              window.history.replaceState(null, '', window.location.pathname);
              setHasScrolled(true);
              window.removeEventListener('scroll', onScroll); // Cleanup after scroll completion
            }
          };
  
          // Add scroll event listener
          window.addEventListener('scroll', onScroll);
  
          // Start scrolling to the element with more smoothness
          requestAnimationFrame(() => {
            element.scrollIntoView({
              behavior: "smooth",  // Smooth scroll
              block: "start",      // Align to the top of the viewport
              inline: "nearest",   // Align horizontally to the nearest edge
            });
          });
        }
      }
    };
  
  // Check if window is defined (browser environment)
  if (typeof window !== 'undefined') {
    if (document.readyState === "complete") {
      scrollToSection();
    } else {
      window.addEventListener('load', scrollToSection);
    }
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('load', scrollToSection);
      window.removeEventListener('scroll', () => {});
    }
  };

  }, [isLoading, sections, agricultureTitlesItems, hasScrolled, setActiveTitle]);  

  const playAnimation = (index) => {
    if (players.current[index]?.current) {
      players.current[index].current.play();
      setTimeout(() => {
        pauseAnimation(index);
      }, 8500); // Match this duration to your animation's length
    }
  };

  const pauseAnimation = (index) => {
    if (players.current[index]?.current) {
      players.current[index].current.pause();
    }
  };

  const playAnimationMobile = (index) => {
    if (playersMobile.current[index]?.current) {
      playersMobile.current[index].current.play();
      setTimeout(() => {
        pauseAnimationMobile(index);
      }, 2500);
    }
  };

  const pauseAnimationMobile = (index) => {
    if (playersMobile.current[index]?.current) {
      playersMobile.current[index].current.pause();
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
  }, []);

  // Handler for previous button
  const handlePrev = () => {
    setCurrentIndex(prevIndex => Math.max(0, prevIndex - 2)); // Decrease index but not below 0
  };

  // Handler for next button
  const handleNext = () => {
    setCurrentIndex(prevIndex => Math.min(products.length - 2, prevIndex + 2)); // Increase index but not beyond the last set of 2 items
  };

  // Handler to toggle the visibility of the product cards for the active section
  const toggleCardVisibility = (sectionId) => {
    // Set the active section's id when the button is clicked and reset the currentIndex
    setVisibleSection((prev) => {
      if (prev === sectionId) {
        return null; // If the same section is clicked, hide the cards
      } else {
        setCurrentIndex(0); // Reset currentIndex to 0 when a new section is opened
        return sectionId; // Otherwise, show the new section's products
      }
    });
  };

  const handleBackgroundClick = () => {
    if (visibleSection !== null) {
      setVisibleSection(null);
    }
  };

  const handleNextTitle = () => {
    // console.log("Current nextTitle:", nextTitle); // Log current nextTitle
    setNextTitleActive(nextTitle); // Update the next title
    // console.log("Next title set. Now scrolling to the large component."); // Log the action of scrolling
    scrollToLargeComponent(); // Scroll to the large component
  };

  const handleProductClick = (productId) => {
    // Push to the route with category as a query parameter
    router.push(`/single-product/${productId}?category=agriculture`);
  };  

  useEffect(() => {
    const isSmallScreen = window.innerWidth < 1024;

    if (typeof document !== 'undefined') {
      if (visibleSection && isSmallScreen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'auto';
      }
    };
  }, [visibleSection]);

    // Filter products for each section outside of the render method
    const filteredProductsForSections = useMemo(() => {
      return activeSections.map((section) => {
        return {
          sectionId: section.id,
          filteredProducts: products.filter((product) =>
            product.applicationTitleSection?.some(
              (sectionItem) => `Agriculture-${activeTitle}-${section.id}` === sectionItem.generatedText
            )
          )
        };
      });
    }, [products, activeTitle, activeSections]);

  return (
    <section className="mt-24 font-poppins" key={activeTitle}>
      {activeSections.map((section, index) => {
        const isEven = index % 2 === 0;
        // console.log(index)
        const isActive = visibleSection === section.id; // Check if this section is active
        const isLastSection = index === activeSections.length - 1;

        // Get filtered products for the current section
        const filteredProducts = filteredProductsForSections.find(
          (item) => item.sectionId === section.id
        )?.filteredProducts || [];        

        return (
          <div key={section.id} className="font-poppins" id={`${activeTitle.replace(/\s+/g, "")}-${section.id}`}>
            {/* First Part Main Agriculture */}
            <div>
              <div>
                <div
                  className={`lg:flex ${
                    isEven ? "flex-row" : "flex-row-reverse"
                  } item-center gap-28 below-1276:gap-20  justify-center lg:mx-10 hidden`}
                >
                  {/* First Left */}
                  <div
                    className={`flex ${
                      isEven ? "flex-row" : "flex-row-reverse"
                    } items-center ${
                      isEven ? "mb-[0px]" : "mb-[1px]"
                    } gap-5 relative`}
                    data-aos="fade-up"
                  >
                    <div className="flex flex-col items-center rounded-full">
                      <Image
                        src={section.plantImage}
                        alt="plant"
                        data-aos="zoom-in"
                        width={285}
                        height={285}
                        className="rounded-full"
                      />
                    </div>
                    <div className="flex-col space-y-5 max-w-[400px] min-h-[320px]">
                      <h2
                        className="text-[#000] font-bold text-[28px] font-poppinsSB below-1276:text-[20px]"
                        data-aos="fade-left"
                      >
                        {section.title}
                      </h2>
                      <p
                        className="text-[#000] font-extralight text-[18px] font-poppins below-1276:text-[16px]"
                        data-aos="fade-left"
                      >
                        {section.description}
                      </p>
                      {/* <button
                        className="px-7 py-3 border-2 border-[#193048] text-[#193048] font-poppinsSB rounded-md flex items-center space-x-2 group hover:bg-[#193048]  hover:text-[#E6CFB7]"
                        onClick={() => toggleCardVisibility(section.id)} // Pass section id to toggle visibility
                        data-aos="fade-down"
                      >
                        {translatedSeeProductsText || 'See products'}
                        <span className="border-2 border-[#193048] group hover:border-[#E6CFB7] rounded-full w-6 h-6 flex items-center justify-center ml-5">
                          {isEven ? ">" : "<"}
                        </span>
                      </button> */}
                      <button
  className="px-7 py-3 border-2 border-[#193048] text-[#193048] font-poppinsSB rounded-md flex items-center space-x-2 group hover:bg-[#193048] hover:text-[#E6CFB7]"
  onClick={() => toggleCardVisibility(section.id)} // Pass section id to toggle visibility
  data-aos="fade-down"
>
  {translatedSeeProductsText || "See products"}
  <span
    className="border-2 border-[#193048] rounded-full w-6 h-6 flex items-center justify-center ml-5 group-hover:border-[#E6CFB7] group-hover:bg-[#193048] group-hover:text-[#E6CFB7]"
  >
    {isEven ? ">" : "<"}
  </span>
</button>

                    </div>
                    <Image
                      src={section.plantSmallImage}
                      alt="small plant"
                      className={`absolute ${
                        isLastSection
                          ? isEven
                            ? "top-[120%] left-[105%]  " // Even, last section: move image down and to the right
                            : "top-[120%] right-[85%] below-1800:right-[75%] " // Odd, last section: move image down and further to the right
                          : isEven
                          ? "top-[95%] left-[105%]" // Even, not last section: default position
                          : "top-[95%] right-[100%]" // Odd, not last section: default position
                      } `}
                      width={50}
                      height={50}
                    />
                  </div>

{/* Right Part with Cards */}
<div
  className={`flex items-start xl:min-w-[22%] below-1800:min-w-[35%] below-2000:min-w-[28%] below-1356:max-w-[30%] below-1146:scale-80 ${isActive ? "opacity-100" : "opacity-0 pointer-events-none"}`}
>
  {/* Check if there are products available after filtering */}
  {(() => {
    // Filter the products based on the condition
    const filteredProducts = products.filter((product) =>
      product.applicationTitleSection?.some(
        (sectionItem) => `Agriculture-${activeTitle}-${section.id}` === sectionItem.generatedText
      )
    );

    // Only render if filtered products exist
    if (filteredProducts.length > 0) {
      const showButtons = filteredProducts.length > 2; // Only show buttons if more than 2 products

      return (
        <>
          {/* Prev Button */}
          {showButtons && (
            <button
              className="bg-[#1F3B59] h-10 w-10 rounded-full flex justify-center items-center text-white mr-4 mt-36"
              onClick={(e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                handlePrev(); // Update currentIndex for previous page
              }}
              disabled={currentIndex === 0}
            >
              &lt;
            </button>
          )}

          {/* Cards Container */}
          <div className="grid grid-cols-2 gap-4 max-w-[400px] min-h-[300px] below-1146:min-h-[100px] below-1146:max-w-[500px] rounded-2xl">
            {filteredProducts
              .slice(currentIndex, currentIndex + 2)
              .map((card) => (
                <div
                  key={card.id}
                  className={`max-w-[350px] flex flex-col h-full rounded-lg overflow-hidden shadow-2xl relative cursor-pointer ${filteredProducts.length === 1 ? (index % 2 === 0 ? "col-start-1" : "col-start-2") : ""}`}
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.6)",
                  }}
                  onMouseEnter={() => setHoveredCard(card.id)} // Set hover state on mouse enter
                  onMouseLeave={() => setHoveredCard(null)} // Reset hover state on mouse leave
                  onClick={() => handleProductClick(card.id)}
                >
                  {/* Image Container */}
                  <div className="relative w-full h-[200px] overflow-hidden">
                    <Image
                      width={200}
                      height={200}
                      src={
                        hoveredCard === card.id
                          ? card?.images[1] // Show the second image on hover
                          : card?.images[0] // Show the first image by default
                      }
                      alt={card.name}
                      className="w-full h-full object-cover transition-all duration-300"
                    />
                  </div>

                  {/* Text Section with Gradient Applied Below Image */}
                  <div
                    className="relative p-3 pt-3 text-white flex-grow rounded-b"
                    style={{
                      background: `linear-gradient(
                        0deg,
                        rgba(49, 94, 140, 1) 12%,
                        rgba(62, 115, 169, 0.93) 76%,
                        rgba(62, 115, 169, 0.70) 87%,
                        rgba(62, 115, 169, 0.0) 100%
                      )`,
                      marginTop: "-20px", // Ensures the gradient overlaps the image
                    }}
                  >
                    {/* Text Content */}
                    <h2 className="text-[18px] font-poppinsSB">{card.name}</h2>
                    <p className="text-[12px] font-poppins line-clamp-4">{card.description}</p>
                  </div>
                </div>
              ))}
          </div>

          {/* Next Button */}
          {showButtons && (
            <button
              className="bg-[#1F3B59] h-10 w-10 rounded-full flex justify-center items-center text-white ml-2 mt-36"
              onClick={(e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                handleNext(); // Update currentIndex for next page
              }}
              disabled={currentIndex + 2 >= filteredProducts.length}
            >
              &gt;
            </button>
          )}
        </>
      );
    } else {
      return null; // Return null if no products match the filter
    }
  })()}
</div>

                </div>

                {/* Animation Line */}
                {!isLastSection && (
                  <div className="lg:flex hidden items-center justify-center scale-110  below-1276:scale-90 below-1146:scale-75">
                    <Player
                      src={isEven ? animationLineRight : animationLineLeft}
                      autoplay
                      loop={false}
                      speed={0.4}
                      ref={players.current[index]} // Use refs for each index
                    />
                  </div>
                )}
              </div>

              {isLastSection && (
                <div className="pb-36 font-poppins  hidden lg:block">
                  <div className="lg:flex hidden items-center justify-center ml-[-240px] mt-[40px] below-1276:scale-90 below-1146:scale-75 ">
                    {" "}
                    {/* <Image src={linefirst} alt="horizontal line" /> */}
                    <Player
                      src={animationLineFinal}
                      autoplay
                      loop={false}
                      speed={0.4}
                      ref={players.current[index]} // Use refs for each index
                      className="scale-120 pt-[21px]"
                      style={{
                        transform: "scale(1.2)", // This will override the Tailwind scale-120
                      }}
                    />
                    <div className="relative">
                      <button
                        className="w-[300px] mt-[26px] py-5 bg-[#1F3B59] absolute text-2xl rounded-2xl font-poppinsSB text-[#E6CFB7]"
                        onClick={handleNextTitle}
                      >
                        {translatedNextTitle || nextTitle}{" "}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile responsive code */}
            <div
              className={`lg:hidden flex ${
                isEven ? "flex-row" : "flex-row-reverse"
              } justify-center items-center gap-5 pb-5 mx-5 font-poppins`}
            >
              <div
                className="flex items-center justify-center"
                data-aos="fade-up"
              >
                <Image
                  src={section.plantImage}
                  alt="plant"
                  className="max-w-[150px]"
                  width={150}
                  height={150}
                />
              </div>
              <div
                className="max-w-[350px] text-left flex flex-col items-left justify-center"
                data-aos="fade-up"
              >
                <h1 className="font-extrabold text-[#000] text-[18px] text-left font-poppinsSB">
                  {section.title}
                </h1>
                <p className="font-extralight text-[#000] text-[14px] text-left font-poppins mt-2">
                  {section.description}
                </p>
                <button
                  className="px-4 sm:px-7 py-2 sm:py-3 border-2 border-[#193048] font-poppinsSB text-[#193048] rounded-md flex items-center justify-center space-x-2 mt-3 sm:mt-0"
                  onClick={() => toggleCardVisibility(section.id)}
                  data-aos="fade-down"
                >
                  {translatedSeeProductsText || 'See products'}
                  <span className="border-2 border-[#193048] rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center ml-2 sm:ml-5">
                    {isEven ? ">" : ">"}
                  </span>
                </button>
              </div>

{/* Background Div */}
{visibleSection && (
  <div
    className="fixed inset-0 z-0 backdrop-filter backdrop-blur-md"
    onClick={handleBackgroundClick}
  />
)}

{/* Modal Content (Centered) */}
{isActive && filteredProducts.length > 0 && (
  <div className="fixed inset-0 z-10 flex items-center justify-center" onClick={handleBackgroundClick}>
    <div className="flex items-center justify-between w-full max-w-[600px]">
      {/* Prev Button */}
      {filteredProducts.length > 2 && (
        <button
          className="bg-[#1F3B59] h-10 w-10 rounded-full flex justify-center items-center text-white mx-2"
          onClick={(e) => {
            e.stopPropagation(); // Prevent event from bubbling up
            handlePrev(); // Update currentIndex for previous page
          }}
          disabled={currentIndex === 0}
        >
          &lt;
        </button>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-4 max-w-[400px] px-2 min-h-[300px] below-1146:min-h-[100px] below-1146:max-w-[500px] relative z-20">
        {filteredProducts
          .slice(currentIndex, currentIndex + 2)
          .map((card) => (
            <div
              key={card.id}
              className="max-w-[200px] flex flex-col h-full rounded-lg overflow-hidden shadow-2xl"
              data-aos="fade-left"
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.6)",
              }}
              onClick={() => handleProductClick(card.id)}
            >
              {/* Image Container */}
              <div className="relative w-full h-[150px] overflow-hidden">
                <Image
                  src={card.images[0]}
                  alt={card.name}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Section with Gradient Applied Below Image */}
              <div
                className="relative p-3 text-white flex-grow rounded-b"
                style={{
                  background: `linear-gradient(
                    0deg,
                    rgba(49, 94, 140, 1) 12%,
                    rgba(62, 115, 169, 0.93) 76%,
                    rgba(62, 115, 169, 0.70) 87%,
                    rgba(62, 115, 169, 0.0) 100%
                  )`,
                  marginTop: "-30px", // Ensures the gradient overlaps the image
                }}
              >
                {/* Text Content */}
                <h2 className="text-[18px] pt-5 font-poppinsSB">
                  {card.name}
                </h2>
                <p className="text-[12px] font-poppins line-clamp-4">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* Next Button */}
      {filteredProducts.length > 2 && (
        <button
          className="bg-[#1F3B59] h-10 w-10 rounded-full flex justify-center items-center text-white mx-2"
          onClick={(e) => {
            e.stopPropagation(); // Prevent event from bubbling up
            handleNext(); // Update currentIndex for next page
          }}
          disabled={currentIndex + 2 >= filteredProducts.length}
        >
          &gt;
        </button>
      )}
    </div>
  </div>
)}


            </div>

            <div className="lg:hidden flex justify-center mt-4 mb-8">
              {isLastSection ? (
                <button
                  className="px-7 mt-4 mb-24 py-2 border-2 border-[#193048] text-[#193048] rounded-md hover:bg-[#1F3B59] hover:text-white transition-colors duration-300"
                  onClick={handleNextTitle}
                >
                  {translatedNextTitle || nextTitle}
                </button>
              ) : (
                <Player
                  src={
                    isEven ? animationLineRightMobile : animationLineLeftMobile
                  }
                  autoplay
                  loop={false}
                  speed={0.4}
                  ref={playersMobile.current[index]} // Use refs for mobile animations
                />
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default AgricultureDynamic;
