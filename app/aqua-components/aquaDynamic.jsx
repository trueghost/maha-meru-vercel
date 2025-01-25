"use client";
import { Player } from "@lottiefiles/react-lottie-player";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react"; // Import createRef here
import animationLineFinal from "../../public/images/animationLineFinal.json";
import animationLineLeft from "../../public/images/animationLineLeft.json";
import animationLineLeftMobile from "../../public/images/animationLineLeftMobile.json";
import animationLineRight from "../../public/images/animationLineRight.json";
import animationLineRightMobile from "../../public/images/animationLineRightMobile.json";
// import { default as fish1, default as fish3, default as fish5 } from "../../public/images/aquaticpage/fish1.png";
// import { default as fish2, default as fish4 } from "../../public/images/aquaticpage/fish2.png";
import { useLanguage } from "../context/languageContext";

// Different arrays of sections based on active titles
// const sections = {
//   "Inland Fishery Support": [
//     {
//       id: 1,
//       title: "Fallow Land Rejuvenation 1",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwad",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: fish1, // Path to small plant image
//     },
//     {
//       id: 2,
//       title: "Fallow Land Rejuvenation 2",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwa",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: fish2, // Path to small plant image
//     },
//     {
//       id: 3,
//       title: "Fallow Land Rejuvenation 3",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwa",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: fish3, // Path to small plant image
//     },
//     {
//       id: 4,
//       title: "Fallow Land Rejuvenation 4",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwa",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: fish4, // Path to small plant image
//     },
//     {
//       id: 5,
//       title: "Fallow Land Rejuvenation 5",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwa",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: fish5, // Path to small plant image
//     },
//     // Add more details related to this title if needed
//   ],
//   "Inland water bodies support": [
//     {
//       id: 1,
//       title: "Fallow Land Rejuvenation 1",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwad",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: fish1, // Path to small plant image
//     },
//     {
//       id: 2,
//       title: "Fallow Land Rejuvenation 2",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwa",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: fish2, // Path to small plant image
//     },
//     {
//       id: 3,
//       title: "Fallow Land Rejuvenation 3",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwa",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: fish3, // Path to small plant image
//     },
//     {
//       id: 4,
//       title: "Fallow Land Rejuvenation 4",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwa",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: fish4, // Path to small plant image
//     },
//     {
//       id: 5,
//       title: "Fallow Land Rejuvenation 5",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwa",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: fish5, // Path to small plant image
//     },
//     // Add more details related to this title if needed
//   ],
//   "Climate Controlled Systems": [
//     {
//       id: 1,
//       title: "Fallow Land Rejuvenation 1",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwad",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: fish1, // Path to small plant image
//     },
//     {
//       id: 2,
//       title: "Fallow Land Rejuvenation 2",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwa",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: fish2, // Path to small plant image
//     },
//     {
//       id: 3,
//       title: "Fallow Land Rejuvenation 3",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwa",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: fish3, // Path to small plant image
//     },
//     {
//       id: 4,
//       title: "Fallow Land Rejuvenation 4",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwa",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: fish4, // Path to small plant image
//     },
//     {
//       id: 5,
//       title: "Fallow Land Rejuvenation 5",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwa",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: fish5, // Path to small plant image
//     },
//   ],
//   "Water Treatment": [
//     {
//       id: 1,
//       title: "Fallow Land Rejuvenation 1",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwad",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: fish1, // Path to small plant image
//     },
//     {
//       id: 2,
//       title: "Fallow Land Rejuvenation 2",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwa",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: fish2, // Path to small plant image
//     },
//     {
//       id: 3,
//       title: "Fallow Land Rejuvenation 3",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwa",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: fish3, // Path to small plant image
//     },
//     {
//       id: 4,
//       title: "Fallow Land Rejuvenation 4",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwa",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: fish4, // Path to small plant image
//     },
//     {
//       id: 5,
//       title: "Fallow Land Rejuvenation 5",
//       description:
//         "Fallow land rejuvenation helps restore nutrients in the soil, enhancing crop productivity. adwadada da dwwad awd adawd aw daw dwa daw aw da d awdw awdawd awdwa dawdadadwawd dw dwadawwadaw dawdwadawd wdawdawdawdawdaw dwwa",
//       plantImage: plant, // Path to the plant image
//       plantSmallImage: fish5, // Path to small plant image
//     },
//   ],
// };

const AquaDynamic = ({
  sections, 
  aquaTitlesItems,
  translatedSeeProductsText,
  translatedNextTitle, 
  products,
  activeTitle,
  nextTitle,
  setNextTitleActive,
  scrollToLargeComponent,
  setActiveTitle,
  isLoading
}) => {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState(null);
  const { language } = useLanguage(); // Get current language

  const players = useRef([]);
  const playersMobile = useRef([]);

  // Access the specific section array based on the activeTitle
  // const activeSections = sections[activeTitle] || [];
  const activeSections = sections.filter(
    (section) => section.section === activeTitle
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleSection, setVisibleSection] = useState(null); // Track the visible section

  const [hasScrolled, setHasScrolled] = useState(false); // Flag to track scroll completion

  // This effect will only run once both sections and titles are loaded
  useEffect(() => {
    const scrollToSection = () => {

      // Ensure we're running only on the client side
      if (typeof window === "undefined") return;      

      if (isLoading || !aquaTitlesItems.length || !sections.length || hasScrolled) {
        return;
      }
  
      const hash = window.location.hash; // Get the hash part of the URL
      if (hash) {
        const sectionId = hash.substring(1); // Remove the leading "#"
        const sectionName = sectionId.split("-")[0]; // Extract the part before the "-"
  
        // Find the corresponding title based on the section hash
        const matchedTitle = aquaTitlesItems.find((item) => {
          const titleString = item?.title || '';
          return titleString.replace(/\s+/g, "") === sectionName;
        });
  
        if (matchedTitle && !hasScrolled) {
          const titleWithSpaces = matchedTitle?.title || matchedTitle; // Ensure you're extracting the correct property for the title with spaces
          setActiveTitle(titleWithSpaces);
        }
  
        // Now find the section element to scroll to
        const element = document.getElementById(sectionId);
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
  
    // Ensure page is fully loaded before attempting scroll
    if (document.readyState === "complete") {
      scrollToSection();
    } else {
      window.addEventListener('load', scrollToSection); // Fallback if DOM is not yet ready
    }
  
    // Cleanup the event listener when the component unmounts or when the effect re-runs
    return () => {
      window.removeEventListener('load', scrollToSection);
    };
  }, [isLoading, sections, aquaTitlesItems, hasScrolled, setActiveTitle]);  

  // Create refs for each section's animation
  // const players = useRef(activeSections.map(() => createRef()));
  // const playersMobile = useRef(activeSections.map(() => createRef()));

  const playAnimation = (index) => {
    if (players.current[index]?.current) {
      players.current[index].current.play();
      setTimeout(() => {
        pauseAnimation(index);
      }, 8500);
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
    router.push(`/single-product/${productId}?category=aquatic`);
  };  

  useEffect(() => {

    // Ensure we're running only on the client side
    if (typeof window === "undefined") return;    

    // Check if screen width is < 1024px
    const isSmallScreen = window.innerWidth < 1024;
  
    // Disable scroll when modal is visible and screen width is <= 1024px
    if (visibleSection && isSmallScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  
    // Clean up by re-enabling scroll when the component unmounts or modal is hidden
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [visibleSection]);

  // Filter products for each section outside of the render method
  const filteredProductsForSections = useMemo(() => {
    return activeSections.map((section) => {
      return {
        sectionId: section.id,
        filteredProducts: products.filter((product) =>
          product.applicationTitleSection?.some(
            (sectionItem) => `Aqua-${activeTitle}-${section.id}` === sectionItem.generatedText
          )
        )
      };
    });
  }, [products, activeTitle, activeSections]);    

  return (
    <section className="mt-24 font-poppins" key={activeTitle}>
      {activeSections.map((section, index) => {
        const isEven = index % 2 === 0;
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
                  } item-center gap-28 below-1276:gap-20 justify-center lg:mx-10 hidden`}
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
                      <button
                        className="px-7 py-3 border-2 border-[#193048] text-[#193048] group hover:bg-[#193048] hover:text-[#E6CFB7] font-poppinsSB rounded-md flex items-center space-x-2 "
                        onClick={() => toggleCardVisibility(section.id)} // Pass section id to toggle visibility
                        data-aos="fade-down"
                      >
                        {translatedSeeProductsText || 'See products'}
                        <span className="border-2 border-[#193048]  rounded-full w-6 h-6 flex items-center justify-center ml-5 group-hover:border-[#E6CFB7] group-hover:bg-[#193048] group-hover:text-[#E6CFB7]">
                          {isEven ? ">" : "<"}
                        </span>
                      </button>
                    </div>
                    <Image
                      src={section.plantSmallImage}
                      alt="small plant"
                      className={`absolute
                    ${
                      isLastSection
                        ? isEven
                          ? "top-[115%] right-[-15%]" // Even, last section: move image down and to the right
                          : "top-[109%] right-[78%]" // Odd, last section: move image down and further to the right
                        : isEven
                        ? "top-[90%] left-[90%]" // Even, not last section: default position
                        : "top-[87%] right-[100%]" // Odd, not last section: default position
                    } 
                    `}
                      width={120}
                      height={60}
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
        (sectionItem) => `Aqua-${activeTitle}-${section.id}` === sectionItem.generatedText
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
                  <div className="lg:flex hidden items-center justify-center scale-110 below-1276:scale-90 below-1146:scale-75">
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
                  <div className="lg:flex hidden items-center justify-center ml-[-340px] mt-[40px] below-1276:scale-90 below-1146:scale-75">
                    {" "}
                    {/* <Image src={linefirst} alt="horizontal line" /> */}
                    <Player
                      src={animationLineFinal}
                      autoplay
                      loop={false}
                      speed={0.4}
                      ref={players.current[index]} // Use refs for each index
                      className="scale-120 pt-[21px]"
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

export default AquaDynamic;
