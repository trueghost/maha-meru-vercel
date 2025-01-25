'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ShoppingCartImage from '../../public/images/products/cart-shopping.png';
import productImage from '../../public/images/products/product-image.png';

function SingleProduct({ id, product, products, tabTitles, tabContent }) {

  const router = useRouter();
  // State for hover effect, selected package, quantity, and active tab
  const [isHovered, setIsHovered] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('2kg'); // Preselected package
  const [quantity, setQuantity] = useState(1); // Initial quantity
  const [activeTab, setActiveTab] = useState('Benefits'); // Initial active tab
  const [selectedImage, setSelectedImage] = useState(null);

  // Navigate to product details page
  const handleProductClick = (productId) => {
    router.push(`/single-product/${productId}`);
  };  
  
  const handleRedirect = () => {
    router.push('/connect#connect-form'); // Redirect to the form page
  };

  return (
    <div className="container mx-auto p-8 my-24 font-poppins">
      <div className="flex flex-col lg:flex-row">
        {/* Product Image and Thumbnail Images */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">

        <h1 className="lg:hidden flex text-5xl text-center font-bold font-poppinsSB mb-4 text-[#193048]">{product?.name}</h1>

          {/* <Image
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full"
            width={500}
            height={500}
          /> */}
        <Image
          src={selectedImage || productImage}
          alt="Selected product image"
          className="object-contain lg:w-[500px] lg:h-[500px] w-[300px] h-[300px]"
          width={200}
          height={200}
        />        
      
      <div className="flex space-x-6 mt-6">
      {product?.images?.map((img, index) => (
          <Image
            key={index}
            src={img || productImage}
            alt="Product thumbnail"
            className={`object-cover w-20 h-20 lg:w-36 lg:h-36 cursor-pointer ${
              selectedImage === img ? 'border-2 border-blue-500' : 'opacity-75'
            }`}
            width={100}
            height={100}
            onClick={() => setSelectedImage(img)} // Swap the selected image when clicked
          />
        ))}
            {/* <Image src={product.image} alt={product.name} className="object-cover w-20 h-20 lg:w-36 lg:h-36" width={100} height={100} />
            <Image src={product.image} alt={product.name} className="object-cover w-20 h-20 lg:w-36 lg:h-36" width={100} height={100} />
            <Image src={product.image} alt={product.name} className="object-cover w-20 h-20 lg:w-36 lg:h-36" width={100} height={100} /> */}
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2 lg:pl-10 mt-6 lg:mt-0">
          <h1 className="hidden lg:flex text-5xl font-bold font-poppinsSB mb-4 text-[#193048]">{product?.name}</h1>
          <p className="text-xl mb-6 text-[#193048] mt-5 lg:mt-0 text-center lg:text-start">{product?.description}</p>

          {/* Enquiry Button */}
          <div className='flex my-7 mx-5 lg:mx-0 justify-center lg:justify-start mb-5 lg:mb-0'>
            <button className='flex justify-end  font-poppinsSB mt-4 cursor-pointer' onClick={handleRedirect}>
              <div
                className={`cursor-pointer w-[200px] lg:w-[430px] h-[55px] absolute z-20 mr-[10px] flex justify-center items-center ${isHovered ? 'bg-[#E6CFB7]' : 'bg-[#193048]'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <h4 className={`cursor-pointer lg:text-lg z-10 font-medium ${isHovered ? 'text-[#193048]' : 'text-[#E6CFB7]'}`}>
                {product?.sendEnquiry}
                </h4>
              </div>
              <div
                className={`w-[200px] lg:w-[430px] h-[60px] border-2 relative z-10 ml-8 mt-[6px] ${isHovered ? 'border-[#E6CFB7]' : 'border-[#193048]'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              ></div>
            </button>
          </div>

{/* Available Package Options */}
{product?.packageOptions && product.packageOptions.some(pkg => pkg.trim() !== '') && (
  <div className="flex justify-start items-center mt-10 gap-8 lg:gap-20">
    <h3 className="text-lg lg:text-xl font-semibold font-poppinsSB text-[#193048]">
      {product?.availablePackage}
    </h3>
    <div className="flex space-x-4 mt-2">
      {product.packageOptions.map((pkg, index) => {
        // Split the package option if it's a single string with commas
        let options = [];
        if (typeof pkg === 'string' && pkg.includes(',')) {
          options = pkg.split(',').map(option => option.trim());
        } else {
          options = [pkg];  // If already an array or a single value, wrap it in an array
        }

        return options.map((option, optionIndex) => (
          <button
            key={`${index}-${optionIndex}`} // Use both index and optionIndex to ensure unique keys
            className={`px-2 lg:px-4 py-2 bg-transparent font-medium ${selectedPackage === option ? 'border border-[#193048] text-[#193048]' : 'border border-[#798076] text-[#798076]'}`}
            onClick={() => setSelectedPackage(option)}
          >
            {option}
          </button>
        ));
      })}
    </div>
  </div>
)}

          {product?.quantity?.trim() !== "" && (
          <div className="flex justify-start items-center mt-6 gap-8 lg:gap-20">
            <h3 className="text-xl font-semibold font-poppinsSB text-[#193048] uppercase">{product?.quantityTitle}</h3>
            <div className="flex items-center mt-4">
              <button
                className="bg-white font-poppinsSB text-[#193048] px-2 lg:px-4 py-1 lg:py-2 text-xl"
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
              >
                -
              </button>
              <span className="mx-6 py-2 px-6 text-lg text-black border border-[#E2E9E0]">{quantity}</span>
              <button
                className="bg-[#193048] text-white text-xl px-2 lg:px-4 py-1 lg:py-2"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>
          </div>
          )}

          {/* Tag Images */}
          <div className="flex lg:space-x-12 mt-12 space-x-6 pt-5 flex-wrap lg:flex-nowrap lg:justify-start justify-center">
          {product?.certifiedImages?.map((img, index) => (
              <Image
                  key={index}
                  src={img}
                  alt="tag-image"
                  className="object-contain max-w-[120px] max-h-[120px]"
                  width={100}
                  height={100}
              />
          ))}
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className='flex justify-center items-center mt-20'>
        <h1 className='text-3xl lg:text-5xl font-bold font-poppinsSB mb-4 text-[#193048]'>{product?.productDetails}</h1>
      </div>

      {/* Tabs for Benefits, Usage, and Storage */}
      <div className="mt-8">
        <div className="flex space-x-3 lg:space-x-40 border-b justify-center items-center ">
        {['Benefits', 'Usage', 'Storage'].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 lg:px-6 font-semibold text-lg lg:text-2xl ${activeTab === tab ? 'border-b-2 border-[#193048] text-[#193048]' : 'text-gray-500'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tabTitles[tab] || tab}
          </button>
        ))}
        </div>

        {/* Dynamic content based on active tab */}
        <div className="mt-6 flex justify-center  items-center">
        <ul className="list-disc list-inside  lg:text-xl text-lg text-[#193048] p-4 font-poppins">
          {tabContent[activeTab].map((item, index) => (
            <li className="mb-2" key={index}>{item}</li>
          ))}
        </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-col flex-wrap justify-center items-center">
      {/* Dynamic "Why Choose Product?" Section */}
      <div className=' lg:max-w-[55%]'>
      {product?.whyChoose && product.whyChoose.map((item, index) => (
      <div key={index}>
      <h3 className="font-medium text-xl mb-3 text-[#193048] mt-6">{item.title || "Why Choose Product?"}</h3>
      <p className='text-[#193048] text-lg'>{item.description || 'No description available.'}</p>
      </div>
      ))}
      </div>
    </div>

    <div className='flex justify-center items-center'>
      <div className="applications mt-16">
        <h2 className="text-2xl font-bold font-poppinsSB mb-8 text-[#193048]">{product?.applicationsTitle}</h2>
        <div className="flex flex-row align-center justify-start overflow-x-auto overflow-y-hidden scrollbar-hide lg:grid lg:grid-cols-4 gap-10 max-w-[400px] lg:max-w-none">
        {product?.application && product?.application.map((app, index) => (
        <div key={index} className="application-item text-center flex justify-start items-center gap-5 cursor-pointer min-w-[250px]" onClick={() => (window.location.href = app?.link)}>
          
          {/* Conditionally render the image */}
          {app?.image ? (
            <Image 
              src={app?.image} // Ensure the path is correct
              alt={app.title || "Application image"} // Fallback alt text
              className="w-[120px] h-[120px] rounded-full lg:w-[180px] lg:h-[180px] mb-2"
              width={180}
              height={180}
            />
          ) : (
            <div className="w-[120px] h-[120px] lg:w-[200px] lg:h-[200px] bg-gray-300 flex items-center justify-center mb-2">
              <span>No Image</span> {/* Fallback when image is missing */}
            </div>
          )}
          
          <div className="flex flex-col justify-center items-center">
            {/* Conditionally render the title */}
            <p className="text-lg text-[#193048] font-semibold font-poppinsSB">
              {app?.title || "No Title"} {/* Fallback title if empty */}
            </p>

            {/* Conditionally render the description */}
            <p className="text-lg text-[#193048] font-semibold font-poppinsSB">
              {app?.description} {/* Fallback description if empty */}
            </p>
          </div>
        </div>
        ))}
        </div>
      </div>
    </div>

      {/* Other Relevant Products */}
      <div className='flex justify-center items-center mt-24 lg:mb-8 mb-3'>
        <h1 className='text-2xl lg:text-4xl font-bold font-poppinsSB mb-4 text-[#193048]'>{product?.otherRelevantProducts}</h1>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-20">
        {products.length > 0 ? (
          products
            // Filter out the current product by its ID
            .filter((product) => product.id !== parseInt(id))
            .slice(0, 4)
            .map((product) => (
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
          <p className="text-[#193048]">No relevant products found</p>
        )}
      </div>

    </div>
  );
}

export default SingleProduct;
