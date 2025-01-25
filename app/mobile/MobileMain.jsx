"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import dynamic from 'next/dynamic';
import { useLanguage } from "../context/languageContext"; // Import useLanguage hook
import {
  default as bannerLogo,
  default as StickyLogo,
} from "../../public/images/circular-logo.svg";

import Loader from "../loader";
import Banner from '../common-components/banner';
import PizzaNavigator from '../common-components/pizzaNavigator';
import MobileCookiePopup from './MobComponent/mobile-components/mobileCookie';
import MobileSection from './MobComponent/mobile-components/mobileSection';

// Dynamically import components for lazy loading
const Trial = dynamic(() => import("./MobComponent/mobile-components/trails"));
const Agriculture = dynamic(() => import("../web/components/agriculture"));
const TrendingProducts = dynamic(() => import("../web/components/trendingProducts"));
const Certifications = dynamic(() => import("../web/components/certifications"));
const CustomerStories = dynamic(() => import("../web/components/customerStories"));
const Blog = dynamic(() => import("../web/components/blog"));
const Form = dynamic(() => import('../common-components/form'));
const Footer = dynamic(() => import('../common-components/footer'));

const MobileMain = () => {

  const [showStickyLogo, setShowStickyLogo] = useState(false);
  const [showPizzaNavigator, setShowPizzaNavigator] = useState(false);
  const { language } = useLanguage(); // Get the current language  
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title1, setTitle1] = useState("");
  const [title2, setTitle2] = useState("");
  const [subtext1, setSubtext1] = useState(""); 
  const [title3, setTitle3] = useState("");
  const [subtext3, setSubtext3] = useState(""); 
  const [missionMobileItems, setMissionMobileItems] = useState([]);
  const [translatedSeeProductsText, setTranslatedSeeProductsText] = useState('');
  const [title4, setTitle4] = useState("");
  const [products, setProducts] = useState([]);
  const [translatedLearnMoreText, setTranslatedLearnMoreText] = useState('');
  const [title5, setTitle5] = useState("");
  const [title6, setTitle6] = useState("");
  const [achievements, setAchievements] = useState([]);
  const [stories, setStories] = useState([]); // State to hold fetched stories
  const [title7, setTitle7] = useState("");
  const [blogPosts, setBlogPosts] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null);  
  const [title8, setTitle8] = useState("");
  const [bannerItems, setBannerItems] = useState([]);
  const [title9, setTitle9] = useState('');
  const [title10, setTitle10] = useState('');
  const [title11, setTitle11] = useState('');
  const [title12, setTitle12] = useState('');       
  const [footerItems, setFooterItems] = useState([]);

  const [hoveredKey, setHoveredKey] = useState(null);

  const handleHover = (key) => {
    setHoveredKey(key);
  };

  const bannerRef = useRef(null);
  const secondSectionRef = useRef(null);
  const logoRef = useRef(null);
  const bingScrollTo = useRef(null);

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
      className="absolute lg:top-[calc(56%)] lg:left-[calc(55%)] xl:top-[calc(58%)] above-1900:top-[calc(66%)] xl:left-[calc(52%)] transform -translate-x-1/2 -translate-y-1/2 z-10 scale-50 xl:scale-70 lg:scale-60 md:scale-50"
    />
  );

    // Fetch translations for the given language
    const translateText = async (text, targetLanguage) => {
      try {
        const response = await fetch(
          `/api/translate?text=${encodeURIComponent(text)}&targetLanguage=${targetLanguage}`
        );
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
  
  // Helper function to translate if needed (for languages 'ar' or 'hi')
  const translateIfNeeded = async (text, language) => {
    if (language === 'ar' || language === 'hi') {
      return await translateText(text, language);
    }
    return text; // Return the text as is if translation isn't needed
  };
  
  // Helper function to fetch and translate items
  const fetchAndTranslateItems = async (url, language, transformFunc) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch from ${url}`);
    }
    const data = await response.json();
    return Promise.all(
      data.data.map(async (item) => ({
        ...item,
        ...transformFunc(item, language),
      }))
    );
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
            { pageName: "Home Page Title 1", setter: setTitle9 },
            { pageName: "Home Page Title 2", setter: setTitle12 },
            { pageName: "Home Banner Title 1", setter: setTitle10 },
            { pageName: "Home Banner Title 2", setter: setTitle11 },
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
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set loading state at the start
  
      try {
        // Fetch all necessary data concurrently
        const agricultureItems = fetchAndTranslateItems(
          "/api/agriculture-home-items",
          language,
          (item, lang) => ({
            title: translateIfNeeded(item.title, lang),
            category: translateIfNeeded(item.category, lang),
            description: translateIfNeeded(item.description, lang),
          })
        );
  
        const missionItems = fetchAndTranslateItems(
          '/api/mission-mobile-admin',
          language,
          (item, lang) => ({
            pioneerTitle: translateIfNeeded(item.pioneerTitle, lang),
            pioneerSubtitle: translateIfNeeded(item.pioneerSubtitle, lang),
            imageTitle1: translateIfNeeded(item.imageTitle1, lang),
            imageTitle2: translateIfNeeded(item.imageTitle2, lang),
            imageTitle3: translateIfNeeded(item.imageTitle3, lang),
            imageTitle4: translateIfNeeded(item.imageTitle4, lang),
            imageTitle5: translateIfNeeded(item.imageTitle5, lang),
          })
        );
  
        // Wait for missionItems to resolve all promises
        const fetchedMissionItems = await missionItems;
  
        // Resolve all promises for the first item in the fetchedMissionItems array
        const firstMissionItem = fetchedMissionItems[0];
  
        const resolvedFirstMissionItem = {
          ...firstMissionItem,
          imageTitle1: await firstMissionItem.imageTitle1,
          imageTitle2: await firstMissionItem.imageTitle2,
          imageTitle3: await firstMissionItem.imageTitle3,
          imageTitle4: await firstMissionItem.imageTitle4,
          imageTitle5: await firstMissionItem.imageTitle5,
          pioneerSubtitle: await firstMissionItem.pioneerSubtitle,
          pioneerTitle: await firstMissionItem.pioneerTitle,
        };
  
        const trendingProducts = fetchAndTranslateItems(
          '/api/trending-products',
          language,
          (product, lang) => ({
            title: translateIfNeeded(product.title, lang),
            subtitle: translateIfNeeded(product.subtitle, lang),
            content: translateIfNeeded(product.content, lang),
          })
        );
  
        const blogPosts = fetchAndTranslateItems(
          '/api/blogs-admin',
          language,
          (post, lang) => ({
            title: translateIfNeeded(post.title, lang),
            description: translateIfNeeded(post.description, lang),
            category: translateIfNeeded(post.category, lang),
          })
        );
  
        const achievements = fetchAndTranslateItems(
          '/api/achievements-admin',
          language,
          (item, lang) => ({
            image: item.image, // No title or description, only image
          })
        );     
        
        // Fetch titles and subtexts concurrently
        const titleSubtextResponse = await fetch("/api/title-subtext");
        if (!titleSubtextResponse.ok) {
          throw new Error("Failed to fetch title and subtext");
        }
        const titleSubtextData = await titleSubtextResponse.json();
  
        const translateTitles = async (pageName, lang) => {
          const pageEntry = titleSubtextData.entries.find(entry => entry.page_name === pageName);
          if (pageEntry) {
            return {
              [pageName]: pageEntry.hide === 1 ? "" : await translateIfNeeded(pageEntry.title, lang),
            };
          }
          return {};
        };
  
        // Parallelize fetching and translating titles
        const titles = await Promise.all([
          translateTitles("Agriculture Home", language),
          translateTitles("Trending Home", language),
          translateTitles("Customer Home", language),
          translateTitles("Achievements Home", language),
          translateTitles("Blogs Home", language),
          translateTitles("Home Mobile First", language),
          translateTitles("Home Page Title 1", language),
          translateTitles("Home Page Title 2", language),
        ]);
  
        // Wait for all fetches and translations to complete
        const [fetchedAgricultureItems, fetchedTrendingProducts, fetchedBlogPosts, fetchedAchievements] = await Promise.all([
          agricultureItems,
          trendingProducts,
          blogPosts,
          achievements,
        ]);
  
        // Set state with the resolved first mission item only (as an object, not an array)
        setItems(fetchedAgricultureItems);
        setMissionMobileItems(resolvedFirstMissionItem); // Set the object directly, not an array
        setProducts(fetchedTrendingProducts);
        setBlogPosts(fetchedBlogPosts);
        setAchievements(fetchedAchievements);
  
        titles.forEach((titleData) => {
          Object.entries(titleData).forEach(async ([key, title]) => {
            if (key === "Agriculture Home") setTitle3(title);
            else if (key === "Trending Home") setTitle4(title);
            else if (key === "Customer Home") setTitle6(title);
            else if (key === "Achievements Home") setTitle5(title);
            else if (key === "Blogs Home") setTitle7(title);
            else if (key === "Home Mobile First") {
              setTitle1(title);
              
              // Translate and set the subtext
              const subtext = titleSubtextData.entries.find(entry => entry.page_name === "Home Mobile First")?.subtext || "";
              const translatedSubtext = await translateIfNeeded(subtext, language);
              setSubtext1(translatedSubtext);
            }
            else if (key === "Home Page Title 1") setTitle2(title);
            else if (key === "Home Page Title 2") setTitle8(title);
          });
        });        
  
        // Handle translation for other static text (like "Learn More" and "Read More")
        setTranslatedSeeProductsText(await translateText("Read More", language));
        setTranslatedLearnMoreText(await translateText("Learn More", language));

        // Fetch title and banner items after other data is fetched
        await fetchTitle();
        await fetchBannerItems();      
        await fetchFooterItems();         
  
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Set loading state back to false
      }
    };
  
    fetchData();
  }, [language]); // Re-fetch and translate data when the language changes

  return (
    <div className=''>
      {isLoading && (
      <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-[#193048]"><Loader/></div>
            </div>
          )}

      {!isLoading && (
            <>          
      <MobileCookiePopup/>
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
      <div className="custom-scrollbar">
        <div ref={bannerRef} className="overflow-x-hidden">
          <Banner title3={title9} title4={title10} title5={title11} title6={title12} bannerItems={bannerItems} bannerLogo={bannerLogoElement} bingScrollTo={bingScrollTo} />
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
        <div ref={secondSectionRef} className="relative overflow-x-hidden">
          <div
            ref={bingScrollTo}
            className="absolute bg-black z-50 top-0"
            style={{ width: "100%" }}
          ></div>
            <MobileSection title1={title1} subtext1={subtext1} title2={title2} title8={title8} />
        </div>
        {/* <AnimationComp/> */}
        <Trial missionMobileItems={missionMobileItems} translatedSeeProductsText={translatedSeeProductsText} />
        {/* <SecondMobile /> */}
        {/* <LogoAnimation /> */}
        <Agriculture title3={title3} subtext3={subtext3} items={items} />
        <TrendingProducts title4={title4} products={products} translatedLearnMoreText={translatedLearnMoreText} />
        <Certifications title5={title5} achievements={achievements} />
        <CustomerStories title6={title6} stories={stories} />
        {/* <HorizontalCards /> */}
        <Blog title7={title7} blogPosts={blogPosts} />
        <Form />
        <Footer footerItems={footerItems} />
      </div>
      </>
    )}      
    </div>
  );
};

export default MobileMain;
