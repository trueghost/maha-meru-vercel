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
import SecondConnect from '../connect-components/secondConnect';
import ThirdComponent from '../connect-components/thirdComponent';

// Dynamically import components
const Smallform = dynamic(() => import('../connect-components/smallform'));
const FourthComponent = dynamic(() => import('../connect-components/fourthComponent'));
const Questions = dynamic(() => import('../connect-components/questions'));
const Form = dynamic(() => import('../common-components/form'));
const Blogs = dynamic(() => import('../connect-components/blogs'));
const Socialmedia = dynamic(() => import('../connect-components/socialMedia'));
const Footer = dynamic(() => import('../common-components/footer'));

const Page = () => {

  const [showStickyLogo, setShowStickyLogo] = useState(false);
  const [showPizzaNavigator, setShowPizzaNavigator] = useState(false);

  const [hoveredKey, setHoveredKey] = useState(null);
  
  const { language } = useLanguage(); // Get the current language
  const [title1, setTitle1] = useState('');
  const [title2, setTitle2] = useState('');
  const [description1, setDescription1] = useState('');
  const [imageUrl1, setImageUrl1] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connect, setConnect] = useState([]);
  const [title3, setTitle3] = useState('');
  const [subtext3, setSubtext3] = useState('');
  const [title4, setTitle4] = useState('');
  const [title5, setTitle5] = useState('');
  const [subtext4, setSubtext4] = useState('');
  const [translatedSeeProductsText, setTranslatedSeeProductsText] = useState('');
  const [aboutPartnerFormItems, setAboutPartnerFormItems] = useState([]); // Store partner items  
  const [title6, setTitle6] = useState('');
  const [subtext6, setSubText6] = useState('');
  const [questions, setQuestions] = useState([]);
  const [title7, setTitle7] = useState("");
  const [blogPosts, setBlogPosts] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null);
  const [title8, setTitle8] = useState("");
  const [cardData, setCardData] = useState([]); // Initialize as an empty array
  const [bannerItems, setBannerItems] = useState([]);
  const [title9, setTitle9] = useState('');
  const [title10, setTitle10] = useState('');
  const [title11, setTitle11] = useState('');
  const [title12, setTitle12] = useState('');  
  const [footerItems, setFooterItems] = useState([]);

  const handleHover = (key) => {
    setHoveredKey(key);
  };

  // Scroll to the about-section after a delay for screens 1024px and larger
  useEffect(() => {
    const scrollToSection = () => {
      if (secondSectionRef.current) {
        secondSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    // Check if the current URL contains the #connect-form hash
    const urlHash = window.location.hash;
    if (urlHash === "#connect-form") {
      scrollToSection();
      
      // Optionally, remove the hash after scrolling, but add a delay to ensure scrolling happens first
      setTimeout(() => {
        window.history.replaceState(null, "", window.location.pathname);
      }, 300);  // Adjust timing as necessary
    }

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
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isLoading]);

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

  // Fetch data for titles/subtexts, combining similar logic into one function
const fetchTitleSubtext = async (pageName) => {
  try {
    const titleResponse = await fetch('/api/title-subtext');
    if (!titleResponse.ok) {
      throw new Error('Failed to fetch title and subtext');
    }
    const titleData = await titleResponse.json();
    return titleData.entries.find(entry => entry.page_name === pageName);
  } catch (error) {
    console.error(`Error fetching ${pageName}:`, error);
    return null;
  }
};

// Translate text conditionally based on language change
const translateIfNeeded = async (text, language) => {
  if (language === 'ar' || language === 'hi') {
    return await translateText(text, language);
  }
  return text;  // Return as is if translation isn't needed
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
    try {
      setIsLoading(true);  // Set loading state before data fetching starts

      // Fetch titles and subtexts
      const [title1Data, title2Data, title3Data, title4Data, title5Data, title6Data, title7Data, title8Data] = await Promise.all([
        fetchTitleSubtext("Connect First"),
        fetchTitleSubtext("Connect Second"),
        fetchTitleSubtext("Connect Third"),
        fetchTitleSubtext("Connect Fourth"),
        fetchTitleSubtext("Connect Fifth"),
        fetchTitleSubtext("Connect Sixth"),
        fetchTitleSubtext("Blogs Connect"),
        fetchTitleSubtext("Social Connect"),
      ]);

      // Set titles and translated titles for each section
      if (title1Data) {
        setTitle1(await translateIfNeeded(title1Data.title, language));
      }
      if (title2Data) {
        setTitle2(await translateIfNeeded(title2Data.title, language));
      }
      if (title3Data) {
        setTitle3(await translateIfNeeded(title3Data.title, language));
        setSubtext3(await translateIfNeeded(title3Data.subtext, language));
      }
      if (title4Data) {
        setTitle4(await translateIfNeeded(title4Data.title, language));
        setSubtext4(await translateIfNeeded(title4Data.subtext, language));
      }
      if (title5Data) {
        setTitle5(await translateIfNeeded(title5Data.title, language));
      }
      if (title6Data) {
        setTitle6(await translateIfNeeded(title6Data.title, language));
        setSubText6(await translateIfNeeded(title6Data.subtext, language));
      }
      if (title7Data && title7Data.hide !== 1) {
        setTitle7(await translateIfNeeded(title7Data.title, language));
      }
      if (title8Data && title8Data.hide !== 1) {
        setTitle8(await translateIfNeeded(title8Data.title, language));
      }

      // Fetch content and translated content
      const [connectFirstContent, connectSecondContent, aboutPartnerFormItems, connectQuestions, socialPosts] = await Promise.all([
        fetch('/api/connect-first').then(res => res.json()),
        fetch('/api/connect-second').then(res => res.json()),
        fetch('/api/about-partner-form').then(res => res.json()),
        fetch('/api/connect-questions').then(res => res.json()),
        fetch('/api/connect-socials').then(res => res.json()),
      ]);

      if (connectFirstContent.success && connectFirstContent.data.length > 0) {
        const entry = connectFirstContent.data[0];
        setDescription1(await translateIfNeeded(entry.description, language));
        setImageUrl1(entry.image || defaultImage.src);
      }

      if (connectSecondContent.success && connectSecondContent.data.length > 0) {
        const initial = await Promise.all(
          connectSecondContent.data.map(async (card) => ({
            ...card,
            title: await translateIfNeeded(card.title, language),
            description: await translateIfNeeded(card.description, language),
          }))
        );
        setConnect(initial);
      }

      if (aboutPartnerFormItems.success) {
        setAboutPartnerFormItems(aboutPartnerFormItems.data);
      }

      if (connectQuestions.success) {
        const translatedQuestions = await Promise.all(
          connectQuestions.data.map(async (item) => ({
            title: await translateIfNeeded(item.title, language),
            description: await translateIfNeeded(item.description, language),
          }))
        );
        setQuestions(translatedQuestions);
      }

      if (socialPosts.success) {
        const translatedPosts = await Promise.all(
          socialPosts.data.map(async (post) => ({
            ...post,
            title: await translateIfNeeded(post.title, language),
            description: await translateIfNeeded(post.description, language),
            category: await translateIfNeeded(post.category, language),
          }))
        );
        setCardData(translatedPosts);
      }

      // Fetch the translated 'Partner Application' text
      const translation = await translateIfNeeded('Partner Application', language);
      setTranslatedSeeProductsText(translation); // Set the translated text     
      
      // Fetch title and banner items after other data is fetched
      await fetchTitle();
      await fetchBannerItems();      
      await fetchFooterItems();    

      setIsLoading(false);  // End loading state
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, [language]); // Re-fetch when language changes

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
        <div ref={secondSectionRef} className="relative pt-36 xl:pt-0">
          <div
            ref={bingScrollTo}
            className="absolute bg-black z-50 top-0"
            style={{ width: "100%" }}
          ></div>
                <SecondConnect title1={title1} description1={description1} imageUrl1={imageUrl1} />
        </div>
        <ThirdComponent title2={title2} connect={connect} />
      <Smallform title3={title3} subtext3={subtext3} />
      <FourthComponent title4={title4} subtext4={subtext4} title5={title5} translatedSeeProductsText={translatedSeeProductsText} aboutPartnerFormItems={aboutPartnerFormItems} />
      <Questions title6={title6} subtext6={subtext6} questions={questions} />
      <div id="connect-form">
      <Form/>
      </div>
      <Blogs title7={title7} blogPosts={blogPosts} />
      <Socialmedia title8={title8} cardData={cardData} />
      <Footer footerItems={footerItems} />
      </div>
      </>
    )}
    </div>
  );
};

export default Page;
