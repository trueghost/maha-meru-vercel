"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  default as StickyLogo
} from "../../public/images/circular-logo.webp";
import { useLanguage } from "../context/languageContext";

function MobilePizza() {
  const { language, changeLanguage } = useLanguage();
  const [currentPath, setCurrentPath] = useState("");
  const [isBannerOpen, setIsBannerOpen] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  // const menuItems = [
  //   { name: "Home", path: "/" },
  //   { name: "About", path: "/about" },
  //   { name: "Connect", path: "/connect" },
  //   { name: "Animal", path: "/animal" },
  //   { name: "Agriculture", path: "/agriculture" },
  //   { name: "Aqua", path: "/aquatic" },
  //   { name: "Products", path: "/products" },
  // ];

  const initialLabelData = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Connect", path: "/connect" },
    { name: "Animal", path: "/animal" },
    { name: "Agriculture", path: "/agriculture" },
    { name: "Aqua", path: "/aquatic" },
    { name: "Products", path: "/products" },
  ];
  
  const [menuItems, setMenuItems] = useState(initialLabelData);

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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const updateLabelData = async () => {
      if (language !== "ar" && language !== "hi") {
        // Use default names for unsupported languages
        setMenuItems(initialLabelData);
        return;
      }
  
      try {
        const translatedData = { ...initialLabelData };
  
        await Promise.all(
          Object.keys(translatedData).map(async key => {
            translatedData[key].name = await translateText(translatedData[key].name, language);
          })
        );
  
        setMenuItems(translatedData);
      } catch (error) {
        console.error("Error translating label data:", error.message);
      }
    };
  
    updateLabelData();
  }, [language]);    
  

  const navigateTo = (path) => {
    if (typeof window !== "undefined") {
      window.location.href = path;
    }
  };

  const handleCloseBanner = (e) => {
    setIsBannerOpen(false);
  };

  const handleBackgroundClick = (e) => {
    e.stopPropagation();
  };

  if (!isBannerOpen) {
    return null;
  }

   // Language options and their corresponding codes
   const languages = [
     { name: "English", code: "en" },
     { name: "Arabic", code: "ar" },
     { name: "Hindi", code: "hi" }
   ];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-start"
      onClick={handleCloseBanner}
    >
      <div
        className="w-full max-h-full bg-black bg-opacity-70 backdrop-filter backdrop-blur-md rounded-bl-[120px] rounded-br-[120px] overflow-hidden"
        style={{
          background:
            "linear-gradient(106deg, #121212 -2.96%, rgba(54, 54, 54, 0.00) 70.18%)",
        }}
        onClick={handleBackgroundClick}
      >
        {/* <div className="flex items-center justify-center pt-4">
          <div>
            <Image
              src={StickyLogo}
              alt="sticky-logo"
              className="fixed left-[5%] z-40 bg-transparent 2xl:h-[116px] 2xl:w-[116px] lg:w-[80px] lg:h-[80px] h-[40px] w-[40px] top-1 md:h-60px md:w-60px"
              onClick={handleCloseBanner}
            />
          </div>
          <div className="text-center">
            <span className="text-[#193048] font-bold text-xl">MAHAMERU</span>
            <br />
            <span className="text-[#193048] font-bold text-xl">INNOVATIONS</span>
          </div>
        </div> */}
        <div className="fixed left-[5%] top-1 z-50 flex items-center space-x-6">
        <Image
          src={StickyLogo}
          alt="sticky-logo"
          className="bg-transparent 2xl:h-[116px] 2xl:w-[116px] lg:w-[80px] lg:h-[60px] h-[80px] w-[80px] md:h-60px md:w-60px"
          onClick={handleCloseBanner}
        />

        {/* Text next to the sticky logo */}
        <div className="text-center" style={{ marginLeft: '40px' }}>
          <span className="text-[#193048] font-bold text-xl font-optimeB tracking-widest">MAHAMERU</span>
          <br />
          <span className="text-[#193048] font-bold text-xl font-optimeB tracking-widest">INNOVATIONS</span>
        </div>
      </div>

      <div className="flex flex-col items-center pt-20 pb-5">
        {/* Language Toggle */}
        <div className="flex flex-col items-center md:items-start text-white mt-6 md:mt-0">
      <div className="w-[68%] border border-gray-300 rounded flex justify-center mb-6">
        {languages.map(({ name, code }) => (
          <div
            key={name}
            onClick={() => {
              changeLanguage(code);  // Update language using context function
            }}
            className={`w-24 h-10 flex justify-center items-center rounded cursor-pointer font-semibold ${
              language === code  // Highlight selected language by comparing language code
                ? "bg-[#193048] text-[#E6CFB7]"  // Highlight selected language
                : "bg-transparent text-white"     // Default style for non-selected languages
            }`}
          >
            {name}
          </div>
        ))}
      </div>
    </div>

  {/* Menu Buttons */}
  <div className="flex flex-col items-center space-y-4 w-full font-poppins">
  {Object.values(menuItems).map((item) => (
  <button
    key={item.name}
    onClick={() => navigateTo(item.path)}
    className={`w-[70%] p-3 rounded font-poppins font-semibold ${
      currentPath === item.path
        ? "bg-[#193048] text-[#E6CFB7]"
        : "bg-transparent text-black"
    }`}
  >
    {item.name}
  </button>
))}

  </div>
</div>

      </div>
    </div>
  );
}

export default MobilePizza;
