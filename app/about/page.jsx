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
import Loader from "../loader";
import Banner from '../common-components/banner';
import PizzaNavigator from '../common-components/pizzaNavigator';
import Description from '../about-components/description';

// Statically import components
const Aboutvideo = dynamic(() => import("../about-components/aboutVideo"));
const MahameruImpact = dynamic(() => import("../about-components/mahameruImpact"));
const Market = dynamic(() => import("../about-components/maket"));
const OurStory = dynamic(() => import("../about-components/ourStory"));
const Smallform = dynamic(() => import("../about-components/smallForm"));
const Trust = dynamic(() => import("../about-components/trust"));
const Footer = dynamic(() => import('../common-components/footer'));

const AboutPage = () => {

  const [showStickyLogo, setShowStickyLogo] = useState(false);
  const [showPizzaNavigator, setShowPizzaNavigator] = useState(false);
  const { language } = useLanguage(); // Get the current language
  const [isLoading, setIsLoading] = useState(true);
  const [title1, setTitle1] = useState('');
  const [title2, setTitle2] = useState('');
  const [title3, setTitle3] = useState('');
  const [title4, setTitle4] = useState('');
  const [title5, setTitle5] = useState('');
  const [title6, setTitle6] = useState('');
  const [title7, setTitle7] = useState('');
  const [title8, setTitle8] = useState('');
  const [subtext, setSubText] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [description1, setDescription1] = useState('');
  const [imageUrl1, setImageUrl1] = useState(null);
  const [translatedSeeProductsText, setTranslatedSeeProductsText] = useState('');
  const [translatedSeeProductsTexts, setTranslatedSeeProductsTexts] = useState('');
  const [marketSegments, setMarketSegments] = useState([]);
  const [trust, setTrust] = useState([]);
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

  // Scroll to the about-section after a delay for screens 1024px and larger
  useEffect(() => {
    const scrollToSection = () => {
      if (secondSectionRef.current) {
        secondSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // Set a timeout to scroll after 2 seconds, but only for larger screens
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
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
  }, [isLoading]);  

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
      className="absolute lg:top-[calc(56%)] lg:left-[calc(55%)] above-1900:top-[calc(66%)] xl:top-[calc(58%)] xl:left-[calc(52%)] transform -translate-x-1/2 -translate-y-1/2 z-10 scale-50 xl:scale-70 lg:scale-60 md:scale-50"
    />
  );

    // Function to fetch translations
    const translateText = async (text, targetLanguage) => {
      try {
        const response = await fetch(`/api/translate?text=${encodeURIComponent(text)}&targetLanguage=${targetLanguage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch translation');
        }
        const data = await response.json();
        return data.translatedText;
      } catch (error) {
        console.error('Error fetching translation:', error.message);
        return text; // Fallback to original text if translation fails
      }
    };

    const translateIfNeeded = async (text, language) => {
      if (language === 'ar' || language === 'hi') {
          return await translateText(text, language);
      }
      return text; // Return the text as is if translation isn't needed
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
        setIsLoading(true);
        try {
          // Fetch all the data concurrently
          const [
            titleResponse,
            contentResponse1,
            contentResponse2,
            contentResponse3,
            contentResponse4
          ] = await Promise.all([
            fetch('/api/title-subtext'),
            fetch('/api/about-first'),
            fetch('/api/about-market'),
            fetch('/api/about-story'),
            fetch('/api/about-trust')
          ]);
    
          if (!titleResponse.ok || !contentResponse1.ok || !contentResponse2.ok || !contentResponse3.ok || !contentResponse4.ok) {
            throw new Error('Failed to fetch data');
          }
    
          // Parse the responses concurrently
          const [
            titleData,
            descriptionData,
            marketData,
            storyData,
            trustData
          ] = await Promise.all([
            titleResponse.json(),
            contentResponse1.json(),
            contentResponse2.json(),
            contentResponse3.json(),
            contentResponse4.json()
          ]);
    
          const extractTitle = (pageName) => titleData.entries.find(entry => entry.page_name === pageName);
    
          // Extract titles and subtexts for all entries
          const titleEntries = [
            "About First Title", "About Second Title", "About Third Title", "About Story",
            "About Impact", "About Video", "About Video Link", "About Trust"
          ].map(pageName => extractTitle(pageName));
    
          // Set titles without translation
          const setTitles = () => {
            titleEntries.forEach((entry, index) => {
              const title = entry?.title || "";
              const subtext = entry?.subtext || "";
              const hide = entry?.hide === 1;
              switch (index) {
                case 0: setTitle1(title); break;
                case 1: setTitle2(title); break;
                case 2: setTitle3(title); break;
                case 3: setTitle4(title); break;
                case 4: setTitle5(title); break;
                case 5: setTitle6(title); break;
                case 6: setTitle7(title); break;
                case 7: setTitle8(hide ? "" : title); break;
                default: break;
              }
              if (index === 5) setSubText(subtext); // Handle subtext for Title 6
            });
          };
    
          setTitles();
    
          if (language === 'ar' || language === 'hi') {
            const translateEntries = async () => {
              const translatedTitles = await Promise.all(titleEntries.map(async (entry) => ({
                title: entry?.title ? await translateText(entry.title, language) : "",
                subtext: entry?.subtext ? await translateText(entry.subtext, language) : "",
                hide: entry?.hide === 1
              })));
    
              translatedTitles.forEach((entry, index) => {
                const { title, subtext, hide } = entry;
                switch (index) {
                  case 0: setTitle1(title); break;
                  case 1: setTitle2(title); break;
                  case 2: setTitle3(title); break;
                  case 3: setTitle4(title); break;
                  case 4: setTitle5(title); break;
                  case 5: setTitle6(title); setSubText(subtext); break;
                  case 6: setTitle7(title); break;
                  case 7: setTitle8(hide ? "" : title); break;
                  default: break;
                }
              });
            };
    
            await translateEntries();
          }
    
          // Handle description and image for "about-first"
          if (descriptionData.success && descriptionData.data.length > 0) {
            const { description, image } = descriptionData.data[0];
            setDescription(description);
            setImageUrl(image);
            if (language === 'ar' || language === 'hi') setDescription(await translateText(description, language));
          }
    
          // Handle market segments
          const translatedMarketSegments = marketData.data.map(async (segment) => ({
            ...segment,
            title: language === 'ar' || language === 'hi' ? await translateText(segment.title, language) : segment.title
          }));
          setMarketSegments(await Promise.all(translatedMarketSegments));
    
          // Handle story description and image
          if (storyData.success && storyData.data.length > 0) {
            const { description, image } = storyData.data[0];
            setDescription1(description);
            setImageUrl1(image);
            if (language === 'ar' || language === 'hi') setDescription1(await translateText(description, language));
          }
    
          // Set trust data
          setTrust(trustData.data);
    
          // Handle "Read More" and "Read Less" translations
          const translateReadMore = async () => {
            const [readMoreTranslation, readLessTranslation] = await Promise.all([
              translateText('Read More', language),
              translateText('Read Less', language)
            ]);
            setTranslatedSeeProductsText(readMoreTranslation);
            setTranslatedSeeProductsTexts(readLessTranslation);
          };
    
          if (language === 'ar' || language === 'hi') await translateReadMore();

          // Fetch title and banner items after other data is fetched
          await fetchTitle();
          await fetchBannerItems();
          await fetchFooterItems();          
    
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      };
    
      fetchData();
    }, [language]);
    
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
      <div className="custom-scrollbar">
        <div ref={bannerRef}>
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
        <div ref={secondSectionRef} className="relative pt-24 xl:pt-0">
          <div
            ref={bingScrollTo}
            className="absolute bg-black z-50 top-0"
            style={{ width: "100%" }}
          ></div>
                <Description title1={title1} imageUrl={imageUrl} description={description} translatedSeeProductsText={translatedSeeProductsText} translatedSeeProductsTexts={translatedSeeProductsTexts} />
        </div>
        <Smallform title2={title2} />
      {/* <MarketSegments /> */}
      <Market title3={title3} marketSegments={marketSegments} />
      <OurStory title4={title4} imageUrl1={imageUrl1} description1={description1} />
      <MahameruImpact title5={title5} />
      <Aboutvideo title6={title6} title7={title7} subtext={subtext} />
      <Trust title8={title8} trust={trust} />
      
      <Footer footerItems={footerItems} />
      </div>
      
      </>
    )}
    </div>
  );
};

export default AboutPage;
