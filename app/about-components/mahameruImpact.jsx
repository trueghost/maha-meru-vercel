"use client";
import { Player } from "@lottiefiles/react-lottie-player";
import Image from "next/image";
import { useEffect, useState } from "react";
import bee from "../../public/images/about/bee.webp";
import bio from "../../public/images/about/bio.webp";
import carbon from "../../public/images/about/carbon.webp";
import circle from "../../public/images/about/circle.webp";
import circular from "../../public/images/about/circular.webp";
import FAO from "../../public/images/about/FAO.webp";
import health from "../../public/images/about/health.webp";
import ChartArabic from "../../public/images/about/impact_arabic.webp";
import ChartEnglish from "../../public/images/about/impact_english.webp";
import ChartHindi from "../../public/images/about/impact_hindi.webp";
import animationleft from '../../public/images/about/leafline.webp';
import animationright from '../../public/images/about/leafline2.webp';
import plant from "../../public/images/about/plant.webp";
import sea from "../../public/images/about/sea.webp";
import loadingPlant from "../../public/images/plant.json";
import { useLanguage } from "../context/languageContext";

const MahameruImpact = ({ title5 }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage(); // Get the current language
  const [translatedItems, setTranslatedItems] = useState([]);

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

  useEffect(() => {
      const items = [
        { image: bee, textLight: "Protecting Biodiversity with", textBold: "Bee-Friendly Solutions", animation: animationleft },
        { image: plant, textLight: "Regenerative Agriculture", textBold: "Sustainability Boost", animation: animationright },
        { image: sea, textLight: "Enable integrated farming", textBold: "in Marginal Environments", animation: animationleft },
        { image: bio, textLight: "In food chain", textBold: "Reduce harmful bio-accumulative", animation: animationright },
        { image: circular, textLight: "Circular benefits for", textBold: "Agro, Animal & Fish farms", animation: animationleft },
        { image: carbon, textLight: "Enhancing", textBold: "Nature’s Carbon Sequestration", animation: animationright },
        { image: health, textLight: "Supporting", textBold: "healthier Gut Microbiome", animation: animationleft },
        { image: circle, textLight: "Implementing UN’s", textBold: "Sustainable Development Goals", animation: animationright },
        { image: FAO, textLight: "Following", textBold: "FAO’s Climate Smart Agricultural Practices", animation: null },
      ];

      const translateItems = async () => {
        if (language !== 'ar' && language !== 'hi') {
          // If language is not 'ar' or 'hi', just use the initial items
          setTranslatedItems(items);
          return;
        }
    
        const translated = await Promise.all(
          items.map(async item => ({
            ...item,
            textLight: await translateText(item.textLight, language),
            textBold: await translateText(item.textBold, language),
          }))
        );
        setTranslatedItems(translated);
      };
    
      translateItems();
  }, [language]);

  // Select chart image based on language
  const getChartImage = () => {
    switch (language) {
      case 'hi': // Hindi
        return ChartHindi;
      case 'ar': // Arabic
        return ChartArabic;
      default: // English
        return ChartEnglish;
    }
  };

  return (
    <section className="overflow-x-hidden flex flex-col justify-center items-center font-poppins">
      {/* Heading */}
      <h3 className="font-Poppins text-[#193048] font-semibold text-4xl font-poppinsSB text-center mt-16 mb-16"
        style={{
          fontFamily: "PoppinsSB",
          color: "#193048",
          fontSize: "1.875rem", // Equivalent to text-3xl in Tailwind
          fontWeight: "400", // Equivalent to font-semibold in Tailwind
        }}
      >
        {title5}
      </h3>

      {/* Chart Image (Hidden below 1024px) */}
      <div className="relative flex-1 hidden lg:block">
        <Image
          id="Chart"
          src={getChartImage()}
          alt={`Chart in ${language}`}
          className="hidden lg:block w-full h-auto"
        />
        <div className="absolute inset-0 flex items-center justify-center left-8 bottom-8">
          <Player
            src={loadingPlant}
            loop
            autoplay
            className="w-[300px] h-[150px] above-1440:h-[300px]"
          />
        </div>
      </div>

      {/* Title displayed below 1024px */}
      <div className="block p-5 lg:hidden mb-8">
        {translatedItems.map((item, index) => (
          <div key={index} className="flex-col items-center justify-center">
            <div className="flex items-center justify-around gap-14">
              {index % 2 === 0 ? (
                <>
                  <Image src={item.image} alt="image of friendly" className="" />
                  <div className="max-w-[200px]">
                    <p className="text-[#232323] text-[18px] font-extralight">
                      {item.textLight}
                    </p>
                    <p className="text-[#232323] text-[18px] font-poppinsSB font-bold">
                      {item.textBold}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="max-w-[200px]">
                    <p className="text-[#232323] text-[18px] font-extralight">
                      {item.textLight}
                    </p>
                    <p className="text-[#232323] text-[18px] font-poppinsSB font-bold">
                      {item.textBold}
                    </p>
                  </div>
                  <Image src={item.image} alt="image of friendly" className="" />
                </>
              )}
            </div>
            {/* Include animation if available */}
            {item.animation && (
              <div className="flex justify-center mt-4">
                <Image src={item.animation} alt="leaf animation" className="w-[300px]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default MahameruImpact;
