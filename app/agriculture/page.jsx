"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import dynamic from 'next/dynamic';
import { useLanguage } from "../context/languageContext";
import {
  default as bannerLogo,
  default as StickyLogo,
} from "../../public/images/circular-logo.svg";

// Static Imports
import Loader from '../loader';
import PizzaNavigator from '../common-components/pizzaNavigator';
import Banner from '../common-components/banner';
import Agriculture from '../agriculture-components/agriculture';
import Secondtext from '../agriculture-components/secondText';
// Dynamically import AgricultureDynamic component
const AgricultureDynamic = dynamic(() => import('../agriculture-components/agricultureDynamic'), { ssr: false });

// Dynamically import Largecomponent with SSR disabled
const Largecomponent = dynamic(() => import('../agriculture-components/largeComponent'), { ssr: false });
const Footer = dynamic(() => import('../common-components/footer'));

const Page = () => {

  const [showStickyLogo, setShowStickyLogo] = useState(false);
  const [showPizzaNavigator, setShowPizzaNavigator] = useState(false);

  const [hoveredKey, setHoveredKey] = useState(null);

  // State to hold the active button title
  const [activeTitle, setActiveTitle] = useState("Land Rejuvenation");
  const [nextTitle, setNextTitle] = useState("");
  const [prevNextTitle, setPrevNextTitle] = useState(nextTitle);
  const [nextTitleActive, setNextTitleActive] = useState("");
  const [title1, setTitle1] = useState("");
  const [title2, setTitle2] = useState("");
  const [subtext, setSubText] = useState("");
  const { language } = useLanguage(); // Get the current language
  const [agricultureItems, setAgricultureItems] = useState([]);
  const [buttonTitles, setButtonTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [agricultureTitlesItems, setAgricultureTitlesItems] = useState([]);
  const [translatedSeeProductsText, setTranslatedSeeProductsText] = useState('');
  const [translatedNextTitle, setTranslatedNextTitle] = useState('');
  const [products, setProducts] = useState([]);
  const [bannerItems, setBannerItems] = useState([]);
  const [title3, setTitle3] = useState('');
  const [title4, setTitle4] = useState('');
  const [title5, setTitle5] = useState('');
  const [title6, setTitle6] = useState('');
  const [footerItems, setFooterItems] = useState([]);

  const handleHover = (key) => {
    setHoveredKey(key);
  };

  // console.log(nextTitleActive)

  const bannerRef = useRef(null);
  const secondSectionRef = useRef(null);
  const logoRef = useRef(null);
  const bingScrollTo = useRef(null);
  const largeComponentRef = useRef(null);

  // Scroll to the about-section after a delay for screens 1024px and larger
  useEffect(() => {
    const scrollToSection = () => {
      if (secondSectionRef.current) {
        secondSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // Set a timeout to scroll after 1 second, but only if there's no ID in the URL
    const handleResize = () => {
      if (window.innerWidth >= 1024 && !window.location.hash) {
        const timer = setTimeout(() => {
          scrollToSection();
        }, 1000); // Adjust the delay as needed

        return () => clearTimeout(timer); // Cleanup the timer
      }
    };

    // Call handleResize initially and add a resize event listener
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isLoading]); // Empty dependency array, so it runs only on mount

  const scrollToLargeComponent = () => {
    if (largeComponentRef.current) {
      largeComponentRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error("largeComponentRef is not defined");
    }
  };  

  useEffect(() => {
    if (nextTitleActive) { // Check nextTitleActive instead of nextTitle
      scrollToLargeComponent();
      setActiveTitle(nextTitleActive); // Update active title with nextTitle
    }
  }, [nextTitleActive, nextTitle]);

  useEffect(() => {

    if (isLoading) return; 

    const bannerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.boundingClientRect.bottom < 0) {
          // Banner has been scrolled past
          setShowStickyLogo(true);
        } else {
          // Banner is still in view
          setShowStickyLogo(false);
        }
      },
      {
        root: null,
        threshold: 0,
      }
    );

    const secondSectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.boundingClientRect.top <= 0) {
          // SecondSection is at the top of the viewport
          setShowStickyLogo(true);
        } else {
          // SecondSection is not at the top of the viewport
          setShowStickyLogo(false);
        }
      },
      {
        root: null,
        threshold: 0,
      }
    );

    if (bannerRef.current) {
      bannerObserver.observe(bannerRef.current);
    }

    if (secondSectionRef.current) {
      secondSectionObserver.observe(secondSectionRef.current);
    }

    return () => {
      if (bannerRef.current) {
        bannerObserver.unobserve(bannerRef.current);
      }
      if (secondSectionRef.current) {
        secondSectionObserver.unobserve(secondSectionRef.current);
      }
    };
    
  }, [isLoading]);

  const handleLogoHover = () => {
    setShowPizzaNavigator(true);
  };

  const handlePizzaNavigatorLeave = () => {
    setShowPizzaNavigator(false);
    setHoveredKey(null);
  };

  // console.log(activeTitle)

  useEffect(() => {
    if (logoRef.current) {
      if (showStickyLogo && !showPizzaNavigator) {
        gsap.fromTo(
          logoRef.current,
          { y: -100, opacity: 0 },
          { y: 5, opacity: 1, duration: 1 }
        );
      } else {
        gsap.to(logoRef.current, { y: -100, opacity: 0, duration: 0.5 });
      }
    }
  }, [showStickyLogo, showPizzaNavigator]);

  const bannerLogoElement = (
    <Image
      id="banner-logo"
      src={bannerLogo}
      alt="logo"
      className="absolute lg:top-[calc(56%)] lg:left-[calc(55%)] above-1900:top-[calc(66%)] xl:top-[calc(58%)] xl:left-[calc(52%)] transform -translate-x-1/2 -translate-y-1/2 z-10 scale-50 xl:scale-70 lg:scale-60 md:scale-50"
    />
  );

    // Fetch translations for the given language
    const translateText = async (text, targetLanguage) => {
      try {
        const response = await fetch(`/api/translate?text=${encodeURIComponent(text)}&targetLanguage=${targetLanguage}`);
        if (!response.ok) {
          throw new Error("Failed to fetch translation");
        }
        const data = await response.json();
        return data.translatedText;
      } catch (error) {
        console.error("Error fetching translation:", error.message);
        return text; // Fallback to original text if translation fails
      }
    };

    const translateIfNeeded = async (text, language) => {
      if (language === 'ar' || language === 'hi') {
          return await translateText(text, language);
      }
      return text; // Return the text as is if translation isn't needed
    };          
  
    useEffect(() => {
      const fetchTitlesAndSubtext = async () => {
        try {
          // Fetch titles and subtext
          const titleResponse = await fetch("/api/title-subtext");
          if (!titleResponse.ok) throw new Error("Failed to fetch title and subtext");
          const titleData = await titleResponse.json();
    
          // Helper function to fetch and translate title/subtext
          const setTitleAndSubtext = async (pageName, setTitle, setSubText) => {
            const entry = titleData.entries.find(entry => entry.page_name === pageName);
            if (entry) {
              const translatedTitle = language === 'ar' || language === 'hi' ? await translateText(entry.title, language) : entry.title;
              const translatedSubText = entry.subtext && language === 'ar' || language === 'hi' ? await translateText(entry.subtext, language) : entry.subtext;
    
              setTitle(translatedTitle);
              if (setSubText) setSubText(translatedSubText);
            }
          };
    
          await Promise.all([
            setTitleAndSubtext("Agriculture First", setTitle1),
            setTitleAndSubtext("Agriculture Second", setTitle2, setSubText),
          ]);
        } catch (error) {
          console.error("Error fetching titles or subtext:", error);
        }
      };
    
      const fetchAgricultureItemsAndTitles = async () => {
        try {
          // Fetch agriculture titles
          const titleResponse = await fetch("/api/agriculture-titles");
          if (!titleResponse.ok) throw new Error("Failed to fetch agriculture titles");
          const titleData = await titleResponse.json();
          setAgricultureTitlesItems(titleData.data);
    
          const originalTitles = titleData.data.map(item => item.title);
          const translatedTitles = language === 'ar' || language === 'hi' ? await Promise.all(originalTitles.map(title => translateText(title, language))) : originalTitles;
          
          const titlesWithTranslations = titleData.data.map((item, index) => ({
            original: item.title,
            translated: translatedTitles[index]
          }));
          setButtonTitles(titlesWithTranslations);
    
          // Fetch agriculture items
          const itemsResponse = await fetch("/api/agriculture-admin");
          if (!itemsResponse.ok) throw new Error("Failed to fetch agriculture items");
          const itemsData = await itemsResponse.json();
          setAgricultureItems(itemsData.data);
    
          const translatedSections = language === 'ar' || language === 'hi' ? await Promise.all(itemsData.data.map(async section => ({
            ...section,
            title: await translateText(section.title, language),
            description: await translateText(section.description, language)
          }))) : itemsData.data;
    
          setSections(translatedSections);

        } catch (error) {
          console.error("Error fetching agriculture items:", error);
        }
      };
    
      // Helper function to process images or certifiedImages
      const processImages = (images) => {
        if (!images) return [];
        if (typeof images === 'string') {
            return images.split(',').map(item => item.trim());
        }
        if (Array.isArray(images)) {
            return images.flatMap(image => typeof image === 'string' ? image.split(',').map(item => item.trim()) : [image]);
        }
        return [];
      };

      const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();

            const processedProducts = await Promise.all(data.products.map(async (product) => {
                // Process images and certified images
                const images = processImages(product.images);
                const certifiedImages = processImages(product.certifiedImages);

                // Translate product details if language is provided
                const translatedName = language === 'ar' || language === 'hi' ? await translateText(product.name, language) : product.name;
                const translatedDescription = language === 'ar' || language === 'hi' ? await translateText(product.description, language) : product.description;

                return {
                    ...product,
                    name: translatedName,
                    description: translatedDescription,
                    images,
                    certifiedImages,
                };
            }));

            setProducts(processedProducts);

        } catch (error) {
            console.error('Error fetching products:', error);
        }
      };
    
      const fetchTranslation = async () => {
        try {
          // Fetch the translations
          const seeProductsTranslation = language === 'ar' || language === 'hi' ? await translateText("See products", language) : "See products";
          const nextTitleTranslation = language === 'ar' || language === 'hi' ? await translateText(nextTitle, language) : nextTitle;
    
          setTranslatedSeeProductsText(seeProductsTranslation);
          setTranslatedNextTitle(nextTitleTranslation);
        } catch (error) {
          console.error("Error fetching translations:", error);
        }
      };

      const fetchTitle = async () => {
        try {
            const titleResponse = await fetch('/api/title-subtext');
            if (!titleResponse.ok) {
                throw new Error('Failed to fetch title and subtext');
            }
            const titleData = await titleResponse.json();

            // Find and translate each title if needed
            const titleEntries = [
                { pageName: "Home Page Title 1", setter: setTitle3 },
                { pageName: "Home Page Title 2", setter: setTitle6 },
                { pageName: "Home Banner Title 1", setter: setTitle4 },
                { pageName: "Home Banner Title 2", setter: setTitle5 },
            ];

            await Promise.all(
                titleEntries.map(async ({ pageName, setter }) => {
                    const entry = titleData.entries.find((entry) => entry.page_name === pageName);
                    if (entry) {
                        setter(await translateIfNeeded(entry.title, language));
                    }
                })
            );
        } catch (error) {
            console.error('Error fetching title data:', error);
        } finally {
            setIsLoading(false);
        }
      };

      const fetchBannerItems = async () => {
        try {
            const response = await fetch('/api/banner-admin');
            if (!response.ok) {
                throw new Error('Failed to fetch banner items');
            }
            const data = await response.json();

            // Translate banner items in parallel and only if necessary
            const translatedBannerItems = await Promise.all(
                data.data.map(async (item) => ({
                    ...item,
                    title: await translateIfNeeded(item.title, language),
                    description: await translateIfNeeded(item.description, language),
                }))
            );

            setBannerItems(translatedBannerItems);
        } catch (error) {
            console.error('Error fetching or translating banner items:', error);
        } finally {
            setIsLoading(false);
        }
    };      

    const fetchFooterItems = async () => {
      try {
          const response = await fetch("/api/footer-admin");
          if (!response.ok) {
              throw new Error("Failed to fetch footer items");
          }
          const data = await response.json();
          const footerData = data.data[0]; // Assuming the first object from the array
  
          // Initialize translated footer data with original values
          let translatedFooterData = { ...footerData };
  
          // Translate dynamic footer data if necessary
          translatedFooterData.title = await translateIfNeeded(footerData.title, language);
          translatedFooterData.description = await translateIfNeeded(footerData.description, language);
  
          // Translate static text items
          const translatedStaticText = {
              exploreTitle: await translateIfNeeded("Explore", language),
              contact: await translateIfNeeded("Contact", language),
              home: await translateIfNeeded("Home", language),
              about: await translateIfNeeded("About", language),
              connect: await translateIfNeeded("Connect", language),
              agriculture: await translateIfNeeded("Agriculture", language),
              animal: await translateIfNeeded("Animal", language),
              aquatic: await translateIfNeeded("Aquatic", language),
              products: await translateIfNeeded("Our Products", language),
              place: await translateIfNeeded("UAE | India", language),
              privacyPolicy: await translateIfNeeded("Privacy Policy", language),
              copyrightText: await translateIfNeeded(
                  "Maha-Meru Innovations © All rights reserved Copyrights",
                  language
              ),
              imageTitle: await translateIfNeeded(
                  "M - Power Nature, Blossom Life",
                  language
              ),
              location: await translateIfNeeded(footerData.location, language),
          };
  
          // Assign translated static text values
          translatedFooterData.staticText = translatedStaticText;
  
          // Set the translated footer items
          setFooterItems(translatedFooterData);
      } catch (error) {
          console.error("Error fetching or translating footer items:", error);
      } finally {
          setIsLoading(false);
      }
  };
    
      const fetchAllData = async () => {
        setIsLoading(true);
        await Promise.all([
          fetchTitle(),             
          fetchBannerItems(),
          fetchTitlesAndSubtext(),
          fetchAgricultureItemsAndTitles(),
          fetchProducts(),
          fetchTranslation(),
          fetchFooterItems(),
        ]);
        setIsLoading(false);
      };
    
      fetchAllData();
    }, [language]); // Re-fetch data when language changes    

  return (
    <div className='overflow-x-hidden'>

      {isLoading && (
      <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-[#193048]"><Loader/></div>
      </div>
      )}

    {!isLoading && (
          <>
        {showPizzaNavigator && (
    <div
  className="fixed inset-0 z-40 hidden xl:flex"
  style={{
    background:
      "linear-gradient(106deg, #121212 -2.96%, rgba(54, 54, 54, 0.00) 102.18%)",
    backdropFilter: "blur(4px)",
  }}
/>
)}
<div
className="fixed 2xl:top-[-18%] 2xl:left-[-6%] 2xl:scale-100 xl:left-[-11%] xl:top-[-26%] z-50 xl:scale-80 lg:scale-80 lg:top-[-25%] lg:left-[-15%] hidden xl:flex"
onMouseLeave={handlePizzaNavigatorLeave}
>
{showPizzaNavigator && <PizzaNavigator onHover={handleHover} />}
</div>
<div className="custom-scrollbar font-poppins">
<div ref={bannerRef}>
  <Banner title3={title3} title4={title4} title5={title5} title6={title6} bannerItems={bannerItems} bannerLogo={bannerLogoElement} bingScrollTo={bingScrollTo} />
</div>
<Image
  src={StickyLogo}
  alt="sticky-logo"
  ref={logoRef}
  className="fixed top-10 left-[5%] z-50 bg-transparent 2xl:h-[116px] 2xl:w-[116px] lg:w-[80px] lg:h-[80px] hidden xl:flex"
  style={{
    visibility:
      showStickyLogo && !showPizzaNavigator ? "visible" : "hidden",
  }}
  onMouseEnter={handleLogoHover}
/>
<div ref={secondSectionRef} className="relative pt-20 xl:pt-0">
  <div
    ref={bingScrollTo}
    className="absolute bg-black z-50 top-0"
    style={{ width: "100%" }}
  ></div>
      <Secondtext title1={title1} title2={title2} subtext={subtext} />
      </div>
      <Agriculture title2={title2} subtext={subtext} />
      <Largecomponent buttonTitles={buttonTitles} agricultureItems={agricultureItems} setActiveButton={setActiveTitle} setNextTitle={setNextTitle} nextTitle={nextTitle} nextTitleActive={nextTitleActive} ref={largeComponentRef} activeTitle={activeTitle} setNextTitleActive={setNextTitleActive} />
      <AgricultureDynamic sections={sections} agricultureTitlesItems={agricultureTitlesItems} translatedSeeProductsText={translatedSeeProductsText} translatedNextTitle={translatedNextTitle} products={products}
       activeTitle={activeTitle} nextTitle={nextTitle} setNextTitleActive={setNextTitleActive} scrollToLargeComponent={scrollToLargeComponent} setActiveTitle={setActiveTitle} isLoading={isLoading} />
      <Footer footerItems={footerItems} />
      </div>
      </>
    )}
    </div>
  );
};

export default Page;
