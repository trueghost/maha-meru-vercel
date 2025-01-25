"use client";
import 'aos/dist/aos.css'; //AOS
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import birds from "../../public/images/birds.svg";
import clouds from '../../public/images/card-images-banner/cloud.webp';
import {
  default as StickyLogo
} from "../../public/images/circular-logo.webp";
import man from '../../public/images/man.webp';
import mobileBanner from "../../public/images/Mobile_banner.webp";
import tracktor from "../../public/images/tracktor.webp";
import tree2 from '../../public/images/tree1.webp';
import treebig from '../../public/images/tree3.webp';
import treesm2 from '../../public/images/treesm1.webp';
import treesm from '../../public/images/treesm2.webp';
import banners from "../../public/mobile-images/banner/Land.webp";
import { useLanguage } from "../context/languageContext";
import '../web/components/AnimationTrial.css';
import MobilePizza from "./mobilePizza";
import Pizza from "./pizza";

const Banner = ({ title3, title4, title5, title6, bannerItems, bannerLogo, bingScrollTo }) => {
  const [TG1, setTG1] = useState("");
  const [TG2, setTG2] = useState("");
  const [TGC, setTGC] = useState("");
  const [fadeOut, setFadeOut] = useState(false);
  const [showTheSection, setShowTheSection] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [hoveredKey, setHoveredKey] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false); // New state for screen size
  const [showPizzaNavigator, setShowPizzaNavigator] = useState(false);
  const { language, changeLanguage } = useLanguage();

  useEffect(() => {
    const tagLineFetch = async () => {
      const response = await fetch("/api/banner");
      const data = await response.json();
      setTG1(data.tagLine1);
      setTG2(data.tagLine2);
      setTGC(data.tagColor);
    };
    tagLineFetch();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1024);
    };

    // Set initial value
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleHover = (key) => {
    setHoveredKey(key);
  };

  const handleMouseLeave = () => {
    setHoveredKey(null);
    setFadeOut(true);
  };

  // const titles = {
  //   0: {
  //     image: Careers,
  //     title: "Career",
  //     subtitle:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus.",
  //   },
  //   1: { image: "", title: "", subtitle: "" },
  //   2: { image: "", title: "", subtitle: "" },
  //   3: {
  //     image: About,
  //     title: "About",
  //     subtitle:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
  //   },
  //   4: {
  //     image: Connect,
  //     title: "Connect",
  //     subtitle:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
  //   },
  //   5: {
  //     image: Agriculture,
  //     title: "Agriculture",
  //     subtitle:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
  //   },
  //   6: {
  //     image: Animal,
  //     title: "Animal",
  //     subtitle:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
  //   },
  //   7: {
  //     image: Aquatic,
  //     title: "Aquatic",
  //     subtitle:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
  //   },
  //   8: {
  //     image: Careers,
  //     title: "Career",
  //     subtitle:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus.",
  //   },
  // };


  const [isLoading, setIsLoading] = useState(true);

  // console.log(hoveredKey)
  // console.log(bannerItems)

  // Function to map hovered key to ID
  const getMappedIdFromHoveredKey = (key) => {
    // If hovered key is between 3 and 8, map it to corresponding IDs (1 to 6)
    if (key >= 3 && key <= 8) {
      return key - 2; // Maps 3 to 1, 4 to 2, ..., 8 to 6
    }
    return null; // Return null for keys outside the range
  };

  // Determine which item to display based on hoveredKey
  const currentItem = (() => {
    const mappedId = getMappedIdFromHoveredKey(hoveredKey);
    return mappedId !== null ? bannerItems.find(item => item.id === mappedId) : {};
  })();
  
  const currentImage = currentItem?.image || '';
  const currentTitle = currentItem?.title || '';
  const currentSubtitle = currentItem?.description || ''; 

  // const currentImage =
  //   hoveredKey !== null && titles[hoveredKey] ? titles[hoveredKey].image : "";
  // const currentTitle =
  //   hoveredKey !== null && titles[hoveredKey] ? titles[hoveredKey].title : "";
  // const currentSubtitle =
  //   hoveredKey !== null && titles[hoveredKey]
  //     ? titles[hoveredKey].subtitle
  //     : "";

  const rotateKeyframes = `
    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;

  const fanRotate = {
    transformOrigin: `${87.0567}px ${94.7895}px`,
    animation: "rotate 3s linear infinite",
  };

  const style = document.createElement("style");
  style.innerHTML = rotateKeyframes;
  document.head.appendChild(style);

  const handleLogoHover = () => {
    setShowPizzaNavigator(true);
  };

  const handlePizzaNavigatorLeave = () => {
    setShowPizzaNavigator(false);
    setHoveredKey(null);
  };

  const mobilePizzaRef = useRef(null); // Reference for MobilePizza

  const handleLogoClick = () => {
    setShowPizzaNavigator((prevState) => !prevState); // Toggle visibility
  };

  const handleClickOutside = (event) => {
    if (
      mobilePizzaRef.current &&
      !mobilePizzaRef.current.contains(event.target)
    ) {
      setShowPizzaNavigator(false); // Close MobilePizza when clicking outside
    }
  };

  useEffect(() => {
    if (showPizzaNavigator) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPizzaNavigator]);

  return (
    <>
      {/* {isSmallScreen ? ( */}

        {/* // New section for screens 1024px and below */}
        <div className="w-full flex lg:hidden h-[100px] bg-[#EDDDB8] fixed z-40">
          {/* Mobile Pizza Navigator */}
          {showPizzaNavigator && (
            <div
              className="fixed 2xl:top-[-18%] 2xl:left-[-6%] 2xl:scale-100 xl:left-[-11%] xl:top-[-26%] z-50 xl:scale-80 lg:scale-80 lg:top-[-25%] lg:left-[-15%]"
              ref={mobilePizzaRef}
            >
              <MobilePizza />
            </div>
          )}

          {/* Banner Image with matching height to the container */}
          <Image
            src={mobileBanner}
            alt="farm background"
            className="fixed w-full h-[128px] object-cover z-20"
            priority
            layout="responsive"
            width={1440} // Match image's original dimensions
            height={360} // Match image's original dimensions
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 1440px"
          />

          {/* Logo and Text Container */}
          <div className="fixed left-[5%] top-1 z-40 flex items-center space-x-2">
            <Image
              src={StickyLogo}
              alt="sticky-logo"
              className="bg-transparent max-h-[116px] w-[70px] md:w-[110px] md:max-h-[110px] 2xl:w-[116px] 2xl:max-h-[116px]"
              onClick={handleLogoClick}
              priority
              layout="intrinsic"
              width={116}
              height={116}
            />
          </div>
        </div>
      {/* ) : ( */}
        {/* // Original banner section for larger screens */}
        {/* showTheSection && ( */}
          <section className="object-contain hidden bg-no-repeat h-screen w-screen lg:flex relative overflow-hidden">


            <div className="w-[calc(55%)] h-full relative">

              
            <div
  className="w-full flex flex-col text-center absolute top-10 left-[40%] transform-translate-x-1/2"
>
          <h1 className='text-3xl text-[#193048] font-optima tracking-[10px]'>
              {title3 || "MAHAMERU"}
            </h1>
 <h1 className='text-3xl font-optima text-[#193048] tracking-[10px] '>
              {title6 || "INNOVATIONS"}
            </h1>
    
          </div>
              <div className="relative w-full h-full">
                <Link href={"/"} passHref className="cursor-pointer">
                {bannerLogo}
                </Link>
                <div className="absolute lg:top-[calc(56%)] lg:left-[calc(55%)] xl:top-[calc(58%)] xl:left-[calc(52%)] above-1900:top-[calc(66%)] transform -translate-x-1/2 -translate-y-1/2 scale-50 xl:scale-110 lg:scale-100 md:scale-50">
                  <Pizza
                    onHover={handleHover}
                    onMouseLeave={handleMouseLeave}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>

            <div className="w-[calc(40%)] h-full flex flex-col justify-center items-center z-50 ">
              {hoveredKey === null ? (
                <div className="h-full relative flex justify-center items-center ml-40 ">
                  <div className="flex flex-col text-center gap-2 xl:scale-100 lg:scale-70">
                  <span
                    className={`lg:text-5xl lg:font-extrabold whitespace-nowrap font-optimeB animate-slideUp ${
                      TGC ? `text-[${TGC}]` : "text-[#193048]"
                    }`}
                  >
                    {title4 && title4}
                  </span>
                  <span
                    className={`lg:text-5xl lg:font-extrabold whitespace-nowrap font-optimeB animate-slideUp ${
                      TGC ? `text-[${TGC}]` : "text-[#193048]"
                    }`}
                  >
                    {title5 && title5}
                  </span>

                  </div>
                  <Image
                    src={birds}
                    alt="Initial Image"
                    className="initial-image absolute lg:top-[calc(10%)] animate-flyIn"
                  />
                  <Image src={clouds} alt="image of clouds" className="absolute top-[56%] right-[-50px] w-[180px] animate-driftIn" />
                  
                </div>
              ) : (
                <div
      className={`lg:h-2/5 lg:w-[calc(78%)] ml-20 z-40 ${
        fadeOut ? "animate-collapseDown" : "animate-expandUp"
      } backdrop-blur`}
      onAnimationEnd={() => setFadeOut(false)}
    >
      <div className="w-full h-[calc(40%)] relative">
        <Image
          src={currentImage}
          alt="Card Image"
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center font-optima">
          <div className="xl:text-4xl lg:text-3xl md:text-3xl sm:text-2xl uppercase font-black whitespace-nowrap font-optima text-white">
            {currentTitle}
          </div>
        </div>
      </div>

      <div className="bg-hover-card-bottom-bg w-full h-[calc(60%)] text-center lg:p-5 rounded-b-lg">
        <p
          className={`text-[15px]  text-left font-optima ${
            TGC ? `text-[${TGC}]` : "text-[#193048]"
          } overflow-hidden max-h-full`}
        >
          {currentSubtitle}
        </p>
      </div>
    </div>
              )}
            </div>

            <div className="absolute w-full bottom-0 z-20">
              <Image
                src={banners}
                alt="farm image"
                className="farm-image h-full w-screen"
                priority
                layout="responsive"
                width={1920}  // Define width and height according to the image aspect ratio
                height={1080}
              />
          <div className="relative">
                <Image src={man} className="absolute bottom-[5%] above-1900:right-[6%] right-[-10%] below-1356:right-[-15%] below-1276:right-[-20%] above-1440:right-[-8%] below-1146:right-[-25%]" alt="image of man"/>
          </div>
               <div className="absolute bottom-[65%] right-[25%] below-1146:hidden">
            <Image src={treesm} alt="image of small tree"/>
          </div>
          <div className="absolute bottom-[73%] right-[18%] ">
            <Image src={treebig} alt="image of small tree"/>
          </div>
          <div className="absolute bottom-[55%] right-[10%] below-1146">
            <Image src={treesm2} alt="image of small tree"/>
          </div>
          <div className="absolute bottom-[45%] right-[2%] ">
            <Image src={tree2} alt="image of small tree"/>
          </div>

         
              {/* <div className="absolute bottom-[70%] left-[47%] xl:scale-100 xl:bottom-[70%] xl:left-[47%] lg:scale-90 lg:bottom-[40%] lg:left-[30%] md:bottom-[70%] md:left-[47%] scale-[0.3]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 181 189"
                  fill="none"
                  className="w-full h-full"
                  style={fanRotate}
                >

                </svg>
              </div> */}
              
              <div className='absolute bottom-[65%] left-[48%] 2xl:bottom-[85%]'>
                
          <div className='windmill relative w-40 h-80'>
            <div className='absolute lg:top-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20'>
              <svg
                width='200'
                height='307'
                viewBox='0 0 166 307'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                {/* start */}
                <g style={fanRotate}>
                  <path
                    d='M105.528 74.6794L89.5307 95.6745C89.268 96.0247 88.8496 96.2193 88.4312 96.2193C88.256 96.2193 88.0809 96.1901 87.9154 96.122C87.3413 95.8885 86.9911 95.2951 87.0592 94.6821L98.405 0'
                    fill='#193048'
                  />
<path
                    d='M99.3467 15.3135L90.4141 89.9734L103.025 73.4148'
                    fill='#193048'
                  />
                  <path
                    d='M0 131.214L61.4874 90.3432C61.7598 90.1583 62.1004 90.0805 62.4313 90.1194L88.6161 93.4662C89.2292 93.544 89.7254 94.0304 89.8032 94.6434C89.8908 95.2563 89.5503 95.8595 88.9762 96.1027L1.30392 133.627'
                    fill='#193048'
                  />
                  <path
                    d='M14.0938 125.153L83.2293 95.5677L62.5811 92.9214L14.0938 125.153Z'
                    fill='#193048'
                  />
                  <path
                    d='M164.157 153.231L98.0089 120.425C97.7073 120.279 97.4737 120.026 97.3472 119.725L87.1594 95.373C86.9161 94.799 87.0913 94.1374 87.5875 93.7483C88.0838 93.3689 88.7649 93.3591 89.2611 93.7288L165.597 150.886'
                    fill='#193048'
                  />
                  <path
                    d='M151.861 144.057L91.6677 98.9824L99.6954 118.187L151.861 144.057Z'
                    fill='#193048'
                  />
                </g>
                {/* end */}
                <g id='windmill-fan'>
                  <path
                    d='M79.1361 306.355C79.1361 306.355 79.0971 306.355 79.0777 306.355C78.3187 306.326 77.7251 305.674 77.764 304.915L87.0567 94.7895C87.0859 94.0306 87.7573 93.4663 88.4968 93.4761C89.2558 93.5053 89.8494 94.1571 89.8104 94.916L80.5178 305.042C80.4886 305.781 79.8756 306.365 79.1361 306.365V306.355Z'
                    fill='#193048'
                  />
                  <path
                    d='M97.6839 305.343C96.9541 305.343 96.3411 304.769 96.3022 304.02L87.0484 94.9059C87.0192 94.1471 87.603 93.4952 88.362 93.4661C89.1113 93.4466 89.7729 94.0206 89.8021 94.7795L99.0559 303.893C99.0851 304.652 98.5013 305.294 97.7423 305.333C97.7228 305.333 97.7034 305.333 97.6839 305.333V305.343Z'
                    fill='#193048'
                  />
                </g>
              </svg>
            </div>
          </div>
        
        
         
        </div>
       


          <div className="absolute lg:top-[-268%] xl:top-[-280%] left-10 " >
          <div className="flex flex-col items-center md:items-start text-white mt-6 md:mt-0">
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-transparent border border-[#193048] text-[#193048] border-none cursor-pointer py-2 px-3"
            >
              <option value="en">English</option>
              <option value="ar">Arabic</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
          </div>

          <div className="absolute bottom-[75%] 2xl:bottom-[92.5%] above-1440:right-[44.5%] right-[43%] above-1440:bottom-[78%]  2xl:right-[55%] above-1900:bottom-[89%] above-1900:right-[52%]">
                <Image src={tracktor} alt="image of tracktor"/>
          </div>

          {/* <div className="w-full flex flex-col text-center absolute top-[-250%] ">
            <h1 className="text-[#193048] font-bold text-2xl font-optimeB ">MAHAMERU
             INNOVATIONS</h1>
    
          </div> */}
            </div>
          </section>
        {/* )
      )} */}
    </>
  );
};

export default Banner;
