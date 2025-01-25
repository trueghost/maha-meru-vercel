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

// Dynamically import components for lazy loading
const Products = dynamic(() => import("../product-components/products"));
const Supply = dynamic(() => import("../product-components/supply"));
const FormProduct = dynamic(() => import("../product-components/form"));
const Footer = dynamic(() => import('../common-components/footer'));

const ProductsPage = () => {

  const [showStickyLogo, setShowStickyLogo] = useState(false);
  const [showPizzaNavigator, setShowPizzaNavigator] = useState(false);

  const [hoveredKey, setHoveredKey] = useState(null);

  const handleHover = (key) => {
    setHoveredKey(key);
  };

  const [products, setProducts] = useState([]);
  const [tabs, setTabs] = useState([]);
  const { language } = useLanguage(); // Get current language
  const [title1, setTitle1] = useState("");
  const [supplyItems, setSupplyItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [translatedSeeProductsText, setTranslatedSeeProductsText] = useState('');  
  const [title2, setTitle2] = useState("");
  const [subtext, setSubText] = useState("");
  const [title3, setTitle3] = useState("");
  const [bannerItems, setBannerItems] = useState([]);
  const [title9, setTitle9] = useState('');
  const [title10, setTitle10] = useState('');
  const [title11, setTitle11] = useState('');
  const [title12, setTitle12] = useState('');   
  const [footerItems, setFooterItems] = useState([]); 

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
      className="absolute lg:top-[calc(56%)] lg:left-[calc(55%)] above-1900:top-[calc(66%)] xl:top-[calc(58%)] xl:left-[calc(52%)] transform -translate-x-1/2 -translate-y-1/2 z-10 scale-50 xl:scale-70 lg:scale-60 md:scale-50"
    />
  );

    // Translation function
    const translateText = async (text, targetLanguage) => {
      try {
        const response = await fetch(`/api/translate?text=${encodeURIComponent(text)}&targetLanguage=${targetLanguage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch translation');
        }
        const data = await response.json();
        return data.translatedText;
      } catch (error) {
        console.error("Error during translation:", error.message);
        return text; // If translation fails, return the original text
      }
    };

    // Translate text conditionally based on language change
    const translateIfNeeded = async (text, language) => {
      if (language === 'ar' || language === 'hi') {
        return await translateText(text, language);
      }
      return text;  // Return as is if translation isn't needed
    };    

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await fetch('/api/products');
          if (!response.ok) throw new Error('Failed to fetch products');
          const data = await response.json();
      
          const products = await Promise.all(data.products.map(async (product) => {
            let images = [];
            if (product.images) {
              if (typeof product.images === 'string') {
                images = product.images.split(',').map(item => item.trim());
              } else if (Array.isArray(product.images)) {
                images = product.images.flatMap(image =>
                  typeof image === 'string' ? image.split(',').map(item => item.trim()) : [image]
                );
              }
            }
    
            // Translate product details if language is 'ar' or 'hi'
            if (language === 'ar' || language === 'hi') {
              const translatedName = await translateText(product.name, language);
              const translatedPrice = await translateText(product.price, language); // Assuming price is text
              const translatedQuantity = await translateText(product.quantity, language); // Assuming quantity is text
    
              return { 
                ...product, 
                name: translatedName, 
                price: translatedPrice, 
                quantity: translatedQuantity,
                images
              };
            }
    
            // If no translation is needed, return the original product
            return { ...product, images };
          }));
    
          setProducts(products);
    
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
    
      const fetchTabs = async () => {
        try {
          const tabsResponse = await fetch('/api/tabs-admin');
          if (!tabsResponse.ok) throw new Error('Failed to fetch tabs');
          const tabsData = await tabsResponse.json();
          setTabs(tabsData.data);
        } catch (error) {
          console.error('Error fetching tabs:', error);
        }
      };
    
      const fetchTitleAndSubtext = async (pageName, setTitle, setSubText) => {
        try {
          const titleResponse = await fetch('/api/title-subtext');
          if (!titleResponse.ok) throw new Error('Failed to fetch title and subtext');
          const titleData = await titleResponse.json();
          const pageEntry = titleData.entries.find(entry => entry.page_name === pageName);
          if (pageEntry) {
            let translatedTitle = pageEntry.title;
            let translatedSubText = pageName === 'Product Third' ? pageEntry.subtext : null;
    
            // Only translate if the language is 'ar' (Arabic) or 'hi' (Hindi)
            if (language === 'ar' || language === 'hi') {
              translatedTitle = await translateText(pageEntry.title, language);
              if (pageName === 'Product Third') {
                translatedSubText = await translateText(pageEntry.subtext, language);
              }
            }
    
            setTitle(translatedTitle);
            // Check if setSubText is a function before calling it
            if (typeof setSubText === 'function') {
              setSubText(translatedSubText || pageEntry.subtext);
            }            
          }
        } catch (error) {
          console.error("Error fetching title/subtext:", error);
        }
      };
    
      const fetchProductSupplyItems = async () => {
        try {
          const response = await fetch('/api/product-supply');
          if (!response.ok) throw new Error('Failed to fetch product supply items');
          const data = await response.json();
    
          const titlesOnly = data.data.map(item => item.title);
          let translatedItems = titlesOnly;
    
          // Only translate if the language is 'ar' (Arabic) or 'hi' (Hindi)
          if (language === 'ar' || language === 'hi') {
            translatedItems = await Promise.all(titlesOnly.map(item => translateText(item, language)));
          }
          setSupplyItems(translatedItems);
    
        } catch (error) {
          console.error('Error fetching product supply items:', error);
        }
      };
    
      const fetchTranslation = async () => {
        try {
          let translation = 'Send Enquiry';
          let translation1 = 'Our Products'; 
          
          // Only translate if the language is 'ar' (Arabic) or 'hi' (Hindi)
          if (language === 'ar' || language === 'hi') {
            translation = await translateText('Send Enquiry', language);
            translation1 = await translateText('Our Products', language);
          }
          
          setTitle3(translation1)
          setTranslatedSeeProductsText(translation);
    
        } catch (error) {
          console.error('Error fetching translation:', error);
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
    
      // Initiate all async calls in parallel
      const fetchData = async () => {
        await Promise.all([
          fetchTitle(),             
          fetchBannerItems(),
          fetchProducts(),
          fetchTabs(),
          fetchTitleAndSubtext("Product Second", setTitle1, null),
          fetchTitleAndSubtext("Product Third", setTitle2, setSubText),
          fetchProductSupplyItems(),
          fetchTranslation(),
          fetchFooterItems()
        ]);
      };
    
      setIsLoading(true);  // Indicating loading state at the start
      fetchData().finally(() => setIsLoading(false));
    
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
        <div ref={secondSectionRef} className="relative pt-12 xl:pt-0">
          <div
            ref={bingScrollTo}
            className="absolute bg-black z-50 top-0"
            style={{ width: "100%" }}
          ></div>
                <Products title3={title3} products={products} tabs={tabs} />
        </div>
      <Supply title1={title1} supplyItems={supplyItems} translatedSeeProductsText={translatedSeeProductsText} />
      <FormProduct title2={title2} subtext={subtext} />
      <Footer footerItems={footerItems} />
      </div>
      </>
    )}
    </div>
  );
};

export default ProductsPage;
