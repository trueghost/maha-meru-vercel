'use client'; // Ensure it's a client-side component

import { useSearchParams, usePathname } from 'next/navigation'; // Updated import for Next.js 13+ App Router
import { useEffect, useState } from 'react';
import { useLanguage } from "../context/languageContext";

function LineNav({ id, productName }) {
  const pathname = usePathname(); // Get the current path (e.g., /single-product/1)
  const searchParams = useSearchParams(); // Get the query params, e.g., category=agriculture
  const category = searchParams.get('category') || 'products'; // Get the 'category' query parameter from the URL

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { language } = useLanguage();
  const [translations, setTranslations] = useState({
    home: '',
    products: '',
    singleProduct: '',
    category: category, // Initialize category with the value from the URL
  });

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

  // Fetch translations when the language changes
  useEffect(() => {
    const fetchTranslations = async () => {
      const translatedTexts = {
        home: await translateText('Home', language),
        products: await translateText('Products', language),
        singleProduct: await translateText('SINGLE PRODUCT', language),
        category: category ? await translateText(category, language) : 'products', // Translate the category name if available
      };
      setTranslations(translatedTexts);
    };

    fetchTranslations();
  }, [language, category]); // Re-fetch translations when language or category changes

  return (
    <div className="w-full bg-[#193048] h-14 flex justify-start items-center">
      <div className="flex items-center pl-2 flex-wrap justify-center space-x-2 lg:pl-36 lg:justify-start">
        {/* Home Button */}
        <button
          onClick={() => window.location.href = '/'} // Use window.location for navigation if needed
          className="text-white font-medium uppercase"
        >
          {translations.home || 'Home'}
        </button>
        <span className="text-white px-4">-</span>

        {/* Product Button */}
        <button
          onClick={() => window.location.href = `/${category}`}
          className="text-white font-medium uppercase"
        >
          {translations.category || category || 'Products'}
        </button>
        <span className="text-white px-4">-</span>

        {/* Single Product Button */}
        <button
          onClick={() => window.location.href = pathname} // Use window.location to reload the current page
          className="text-[#E6CFB7] font-medium uppercase"
        >
          {productName || 'SINGLE PRODUCT'}
        </button>
      </div>
    </div>
  );
}

export default LineNav;
