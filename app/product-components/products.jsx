'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ShoppingCartImage from '../../public/images/products/cart-shopping.png';
import { useLanguage } from "../context/languageContext";

function Products({ title3, products, tabs }) {
  const router = useRouter();
  const { language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [titles, setTitles] = useState([]);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const productsPerPage = 9;

  const [selectedCategories, setSelectedCategories] = useState([]);  // Track selected categories
  const [openCategories, setOpenCategories] = useState({});  // Track open state of category accordions
  const [titlesData, setTitlesData] = useState({});  // Store titles data by category
  const [itemsData, setItemsData] = useState({});  // Store items data for titles
  const [selectedItems, setSelectedItems] = useState({});  // Track selected items per title
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedTab, setSelectedTab] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // State to track the open state of the main accordion
  const [openAccordions, setOpenAccordions] = useState(true);
  const [openTitleItems, setOpenTitleItems] = useState({});

  const toggleAccordion = () => {
    setOpenAccordions((prev) => !prev); // Toggle the main accordion state
  };

  const toggleItemsAccordion = (category, titleId) => {
    setOpenTitleItems(prev => ({
      ...prev,
      [`${category}-${titleId}`]: !prev[`${category}-${titleId}`],
    }));
  };  

  const [categories] = useState(["Agriculture", "Animal", "Aqua"]);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]); // Set filtered products to the products prop when it changes

  // Fetch Titles and Items for each category
  const fetchTitlesAndItems = async (category) => {
    try {
      if (typeof category !== 'string') {
        console.error('Category must be a string:', category);
        return;
      }
      setIsLoading(true);
      const titlesResponse = await fetch(`/api/${category.toLowerCase()}-titles`);
      const itemsResponse = await fetch(`/api/${category.toLowerCase()}-admin`);
      if (!titlesResponse.ok || !itemsResponse.ok) throw new Error("Failed to fetch titles and items");
  
      const titlesData = await titlesResponse.json();
      const itemsData = await itemsResponse.json();
  
      // console.log(titlesData)
      // console.log(itemsData)
  
      setTitlesData((prev) => ({ ...prev, [category]: titlesData.data }));
      setItemsData((prev) => ({ ...prev, [category]: itemsData.data }));
    } catch (error) {
      console.error("Error fetching titles or items:", error);
    } finally {
      setIsLoading(false);
    }
  };  

  const translateText = async (text, targetLanguage) => {
    try {
      const response = await fetch(`/api/translate?text=${encodeURIComponent(text)}&targetLanguage=${targetLanguage}`);
      if (!response.ok) {
        throw new Error('Failed to fetch translation');
      }
      const data = await response.json();
      return data.translatedText;
    } catch (error) {
      // console.error("Error during translation:", error.message);
      return text; // If translation fails, return the original text
    }
  };

  // UseEffect to automatically translate product names based on selected language
  const translateProducts = async (products) => {
    return Promise.all(
      products.map(async (product) => {
        const translatedName = await translateText(product.name, language);
        const translatedDescription = await translateText(product.description, language);

        return {
          ...product,
          name: translatedName,
          description: translatedDescription,
        };
      })
    );
  };

// Check if "All Products" checkbox should be checked
const isAllProductsChecked = selectedCategories.length === 0 && Object.keys(selectedItems).length === 0;

// Function to handle toggling "All Products"
const handleCategoryToggle = (e) => {
  const isChecked = e.target.checked;

  if (isChecked) {
    // If "All Products" is checked, clear all selected categories and items
    setSelectedCategories([]);
    setSelectedItems({});
  } else {
    // If "All Products" is unchecked, do nothing or maintain the previous state
    // console.log("All Products checkbox unchecked");
  }

  // Reset filtered products to show all products
  if (isChecked) {
    setFilteredProducts(products);
  } else {
    filterProducts(); // Reapply existing filters if unchecking "All Products"
  }
};

// Automatically trigger "All Products" when no category or item is selected
useEffect(() => {
  // console.log(selectedCategories)
  // console.log(selectedItems)
  if (selectedCategories.length === 0 && Object.keys(selectedItems).length === 0) {
    // Simulate the "All Products" checkbox being checked
    setFilteredProducts(products);
  } else {
    filterProducts(); // Apply filters if categories or items are selected
  }
}, [selectedCategories, selectedItems, products]);

  // This will translate products when the language changes
  useEffect(() => {
    if (language) {
      const translateProductsList = async () => {
        const translatedProducts = await translateProducts(products);
        setFilteredProducts(translatedProducts);
      };

      translateProductsList();
    }
  }, [language, products]);  

  useEffect(() => {
    selectedCategories.forEach((category) => {
      if (!titlesData[category]) {
        fetchTitlesAndItems(category);
      }
    });
  }, [selectedCategories]);
  
  // Handle Category Accordion Toggle
  const toggleCategoryAccordion = (category) => {
    setOpenCategories((prev) => {
      const newState = { ...prev, [category]: !prev[category] };
      // console.log('New openCategories state:', newState); // Debugging accordion toggle
      return newState;
    });
  };
  
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      const updatedCategories = prev.includes(category)
        ? prev.filter((item) => item !== category) // Remove category if already selected
        : [...prev, category]; // Add category if not selected
  
      // Update selected items to reflect the change in category
      setSelectedItems((prevSelectedItems) => {
        const updatedSelectedItems = { ...prevSelectedItems };
  
        if (updatedCategories.includes(category)) {
          // Select all titles and items for this category
          if (titlesData[category]) {
            updatedSelectedItems[category] = {};
            titlesData[category].forEach((title) => {
              updatedSelectedItems[category][title.title] = itemsData[category]
                .filter((item) => item.section === title.title)
                .map((item) => item.id);
            });
          } else {
            console.warn(`No titles found for category: ${category}`);
          }
        } else {
          // Deselect all titles and items for this category, ensuring the category is removed from selectedItems
          delete updatedSelectedItems[category];
        }
  
        return updatedSelectedItems;
      });
  
      return updatedCategories;
    });
  };  
  
  const handleTitleChange = (checked, category, titleId, title) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = { ...prevSelectedItems };
  
      if (!updatedSelectedItems[category]) {
        updatedSelectedItems[category] = {};
      }
  
      if (checked) {
        // Select all items for this title
        updatedSelectedItems[category][title] = itemsData[category]
          .filter((item) => item.section === title)
          .map((item) => item.id);
      } else {
        // Deselect all items for this title
        updatedSelectedItems[category][title] = [];
      }
  
      return updatedSelectedItems;
    });
  };  
  
  const handleItemChange = (checked, category, titleId, title, itemId) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = { ...prevSelectedItems };
  
      if (!updatedSelectedItems[category]) {
        updatedSelectedItems[category] = {};
      }
  
      if (!updatedSelectedItems[category][title]) {
        updatedSelectedItems[category][title] = [];
      }
  
      if (checked) {
        updatedSelectedItems[category][title].push(itemId);
      } else {
        updatedSelectedItems[category][title] = updatedSelectedItems[category][title].filter(id => id !== itemId);
      }
  
      return updatedSelectedItems;
    });
  };  
  
  // useEffect to watch for changes in selectedCategories, selectedItems (including titles and items)
  useEffect(() => {
    filterProducts(); // Trigger filterProducts whenever selectedCategories or selectedItems changes
  }, [selectedCategories, selectedItems]);  // Watch for both selectedCategories and selectedItems state changes
  
  const filterProducts = () => {
    let filteredProducts = products;
  
    // If no categories or items are selected, show all products
    if (selectedCategories.length === 0 && Object.keys(selectedItems).length === 0) {
      setFilteredProducts(products);
      return;
    }
  
    // Filter by categories
    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        return product.applicationTitleSection?.some((entry) => {
          const generatedText = entry.generatedText || '';
          const productCategory = generatedText.split('-')[0]?.trim();
          return selectedCategories.some((category) =>
            productCategory.toLowerCase() === category.trim().toLowerCase()
          );
        });
      });
    }
  
    // Filter by selected items (titles and items within them)
    if (Object.keys(selectedItems).length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        return product.applicationTitleSection?.some((entry) => {
          const generatedText = entry.generatedText || '';
          const splitText = generatedText.split('-').map((part) => part.trim());
  
          const [productCategory, productTitle, productId] = splitText;
  
          // Check if productId from generatedText matches the selected product ID
          const selectedProductIds = [
            ...new Set(
              selectedItems[productCategory]?.[productTitle] || []
            ),
          ];
  
          return selectedProductIds.includes(Number(productId));
        });
      });
    }
  
    setFilteredProducts(filteredProducts);
  };  
  
  const handleProductClick = (productId) => {
    router.push(`/single-product/${productId}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTabClick = (tab) => {
    // If the clicked tab is the currently active tab, deselect it
    if (selectedTab?.tabTitle === tab.tabTitle) {
      setSelectedTab(null); // Deselect the tab
      setFilteredProducts(products); // Reset filtered products to show all
      // console.log('Tab Deselected'); // Optional logging for debugging
    } else {
      setSelectedTab(tab); // Set selected tab
      // console.log('Selected Tab:', tab); // Optional logging
      const filtered = products.filter((product) => tab.productIds.includes(product.id.toString()));
      setFilteredProducts(filtered); // Update filtered products
    }
  };  

// Filter products based on search query, ignoring spaces
const searchFilteredProducts = filteredProducts.filter(product => {
  // Remove spaces from product name and search query
  const productNameWithoutSpaces = product.name.replace(/\s+/g, '').toLowerCase();
  const searchQueryWithoutSpaces = searchQuery.replace(/\s+/g, '').toLowerCase();

  // Check if the search query (without spaces) is included in the product name (also without spaces)
  return productNameWithoutSpaces.includes(searchQueryWithoutSpaces);
});

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = searchFilteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(searchFilteredProducts.length / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
  };

//   console.log('Items Data:', itemsData);
// console.log('Selected Items:', selectedItems);
// console.log('Titles Data:', titlesData);

  return (
    <div className="container mx-auto my-24 p-8 font-poppins">
      {/* Heading */}
      <h1 className="text-4xl lg:text-5xl font-poppinsSB font-bold text-center mb-10 text-[#193048]"
       style={{
        fontFamily: "PoppinsSB",
        color: "#193048",
         // Equivalent to text-3xl in Tailwind
        fontWeight: "400", // Equivalent to font-semibold in Tailwind
      }}
      >{title3}</h1>

      <div className="flex flex-col-reverse lg:flex-row lg:justify-between lg:gap-10">
        {/* Left section (Products) */}
        <div className="w-full lg:w-3/4 lg:pr-4">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Dynamically rendering products */}
          {searchFilteredProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div key={product.id} className="border border-[#193048] pt-0 pr-0 pb-4 pl-0  cursor-pointer max-w-[300px] lg:max-w-[280px]" onClick={() => handleProductClick(product.id)}>
                {product.images && product.images[0] && (
                  <Image
                    src={product.images[0]}
                    width={300}
                    height={300}
                    alt={`${product.name}`}
                    className="object-cover w-[200px] h-[150px] lg:w-[300px] lg:h-[250px] mb-4"
                  />
                )}
                <h2 className="text-sm lg:text-xl font-semibold pl-4 mb-2 font-poppinsSB text-[#193048]">{product.name}</h2>
                <p className="text-sm lg:text-lg mb-2 pl-4 font-poppinsSB text-[#193048]">{product?.price}</p>
                <div className="flex flex-col pl-4 lg:flex-row justify-between lg:items-center items-start flex-wrap lg:flex-nowrap">
                  <p className="text-[#193048] text-sm lg:text-lg">{product.quantity}</p>
                  <button className="bg-[#193048]  text-white px-4 py-2 mt-2 mr-4 lg:mt-0 rounded hover:bg-opacity-90 scale-75 lg:scale-100">
                    <Image src={ShoppingCartImage} alt="cart" className="w-full h-5 object-contain" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[#193048]">No products found</p>
          )}
        </div>

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="mt-8 flex justify-start ">
              {/* <button
                className="px-4 py-2 bg-gray-200 rounded-l text-[#193048] border border-[#193048]"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button> */}
              {[...Array(totalPages).keys()].map((page) => (
                <button
                key={page + 1}
                className={`px-4 py-2 mx-3 ${
                    currentPage === page + 1 ? 'bg-[#193048] text-[#E6CFB7] font-poppinsSB font-bold' : 'bg-transparent text-[#193048] border border-[#193048]'
                }`}
                onClick={() => handlePageChange(page + 1)}
                >
                {page + 1}
                </button>
              ))}
              {/* <button
                className="px-4 py-2 bg-gray-200 rounded-r text-[#193048] border border-[#193048]"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button> */}
            </div>
          )}
        </div>

        {/* Right section (Filters) */}
        <div className="w-full lg:w-1/4 lg:pl-4"> {/* Hide on mobile screens */}
          {/* Search Bar */}
          <div className="mb-6 hidden lg:block">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 border border-[#193048] rounded text-[#193048] bg-transparent placeholder-[#193048] font-semibold text-xl"
            />
          </div>

          {/* Product Categories */}
          <div className="hidden lg:block mb-6">
            <h3 className="text-2xl font-semibold  font-poppinsSB mb-4 text-[#193048] uppercase">Product Categories</h3>
            <div className="flex flex-col space-y-2 text-[#193048] text-xl font-semibold">
            <label className="cursor-pointer text-[#193048] font-semibold text-xl font-poppinsSB flex items-center justify-start">
              <input
                type="checkbox"
                name="category"
                value="All Products"
                checked={isAllProductsChecked} // This ensures the checkbox reflects the selected state
                onChange={handleCategoryToggle} // This toggles the checkbox based on the selection
                className="mr-2 w-[15px] h-[15px]"
              />
              All Products
            </label>
            </div>
          </div>

          {/* Product Categories (Accordion on lg and below) */}
          <div className="mb-6 lg:hidden">
            <h3
              className="text-2xl font-semibold mb-4 text-[#193048] uppercase flex items-center justify-between cursor-pointer"
              onClick={toggleAccordion}
            >
              Product Categories
              <span className="text-2xl">
                {openAccordions ? '▲' : '▼'}
              </span>
            </h3>
            </div>

            {openAccordions && (
            <><div className="flex flex-col space-y-2 text-[#193048] text-xl font-semibold mb-4 lg:hidden">
              <label className="cursor-pointer text-[#193048] font-semibold text-xl font-poppinsSB flex items-center justify-start">
                <input
                  type="checkbox"
                  name="category"
                  value="All Products"
                  checked={isAllProductsChecked} // This ensures the checkbox reflects the selected state
                  onChange={handleCategoryToggle} // This toggles the checkbox based on the selection
                  className="mr-2 w-[15px] h-[15px]" />
                All Products
              </label>
            </div><div className="w-full lg:w-1/4 lg:pl-4">
                {/* Categories Accordion */}
                <div className="mb-6">
                  {/* Categories Accordion */}
                  {categories.map((category) => (
                    <div key={category} className="mb-4">
                    <div
                      className="cursor-pointer text-[#193048] font-semibold text-xl font-poppinsSB flex items-center justify-start"
                      onClick={() => {
                        toggleCategoryAccordion(category); // Toggle the accordion
                        handleCategoryChange(category);    // Toggle the checkbox (select/deselect)
                        // Log active category
                        // if (selectedCategories.includes(category)) {
                        //   console.log("Active Category:", category);
                        // }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        readOnly  // Prevent the checkbox from being manually changed outside of the div click
                        className="mr-2 w-[15px] h-[15px]" />
                      {category}
                    </div>
                      {openCategories[category] && (
                        <div className="pl-4 min-w-[400px]">
                          {/* Titles Accordion */}
                          {titlesData[category]?.map((title) => (
                            <div key={title.id} className="mb-4">
                            <div
                              className="cursor-pointer text-[#193048] font-semibold text-xl font-poppinsSB flex items-center justify-start"
                              onClick={() => {
                                const isChecked = !(openTitleItems[`${category}-${title.id}`] || false);  // Toggle checkbox state
                                handleTitleChange(isChecked, category, title.id, title.title);  // Handle title change with the checked value
                                toggleItemsAccordion(category, title.id);  // Toggle accordion

                                // Log active title
                                // if (isChecked) {
                                //   console.log("Active Title:", title.title);
                                // }

                              }}
                            >
                              <input
                                type="checkbox"
                                checked={openTitleItems[`${category}-${title.id}`] || false}
                                readOnly  // Prevent manual checkbox changes outside of the div click
                                className="mr-2 w-[15px] h-[15px]" />
                              <label className="text-[#193048] font-semibold font-poppinsSB text-lg flex items-center">
                                {title.title}
                              </label>
                            </div>
                              {/* Items Accordion */}
                              <div className="pl-4">
                                {/* Toggle items visibility when title is clicked */}
                                {/* <button
                              onClick={() => toggleItemsAccordion(category, title.id)}
                              className="text-blue-500 text-sm"
                            >
                              {openTitleItems[`${category}-${title.id}`] ? 'Hide Items' : 'Show Items'}
                            </button> */}

                              {openTitleItems[`${category}-${title.id}`] && (
                                <div>
                                  {itemsData[category]?.filter((item) => item.section === title.title).map((item) => {
                                    const isChecked = selectedItems[category]?.[title.title]?.includes(item.id) || false;

                                    return (
                                      <div
                                        key={item.id}
                                        className="cursor-pointer text-[#193048] font-semibold text-xl font-poppinsSB flex items-center justify-start"
                                        onClick={() => handleItemChange(!isChecked, category, title.id, title.title, item.id)}  // Toggle the checked state
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          readOnly  // Prevent manual checkbox changes outside of the div click
                                          className="mr-2 w-[15px] h-[15px]" />
                                        <label className="text-[#193048] text-lg font-semibold font-poppinsSB flex items-center">
                                          {item.title}
                                        </label>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                </div>
              </div>

          {/* Accordion for Sub Categories */}
          {/* {categories.map((category, index) => (
            <div className="hidden lg:block mb-6" key={index}>
              <h3
                className="text-xl font-semibold font-poppinsSB mb-4 text-[#193048] cursor-pointer flex items-center"
                onClick={() => toggleAccordion(category)}
              > */}
                {/* Conditionally render + or - based on the accordion's open state */}
                {/* <span className="mr-2 text-2xl">
                  {openAccordions[category] ? '-' : '+'}
                </span>
                {category}
              </h3> */}
              {/* {openAccordions[title] && (
                <ul className="pl-4 space-y-2">
                  {subCategories.map((subCategory, index) => (
                    <li key={index} className="text-[#193048] font-semibold font-poppinsSB flex items-center">
                      <input
                        type="checkbox"
                        id={`checkbox-${title}-${index}`}
                        className="mr-2"
                      />
                      <label htmlFor={`checkbox-${title}-${index}`}>
                        {subCategory}
                      </label>
                    </li>
                  ))}
                </ul>
              )} */}
            {/* </div>
          ))} */}

          {/* Tags Section */}
          <div className="block mb-6">
            <h3 className="text-2xl font-semibold font-poppinsSB mb-4 text-[#193048] uppercase">Tags</h3>
            <div className="flex flex-wrap gap-4 text-lg font-medium">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className={`px-4 py-2 transition-colors uppercase 
                    ${selectedTab?.tabTitle === tab.tabTitle ? 'bg-[#193048] text-white' : 'bg-white text-[#193048]'}
                  `}
                >
                  {tab.tabTitle}
                </button>
              ))}
            </div>
          </div>
          </>
 )}
          
        </div>
      </div>
    </div>
  );
}

export default Products;
