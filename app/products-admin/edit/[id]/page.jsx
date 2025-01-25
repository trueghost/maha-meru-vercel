"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function EditProducts({ params }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [whyChooseList, setWhyChooseList] = useState([{ title: '', description: '' }]);
  const [applicationList, setApplicationList] = useState([
    { title: '', description: '', image: null, link: '', selectedCategory: '', selectedTitle: '', selectedItem: '' }
  ]);
  
  const [applicationTitleSections, setApplicationTitleSections] = useState([
    { selectedCategory: '', selectedTitle: '', selectedItem: '', generatedText: '' }
  ]);  

  const [categories] = useState(["Agriculture", "Animal", "Aqua"]);
  const [categoriesForList1] = useState(["Agriculture", "Animal", "Aqua"]);
  const [categoriesForList2] = useState(["Agriculture", "Animal", "Aqua"]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [titles, setTitles] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedItem, setSelectedItem] = useState("");

  // Form validation schema using Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Product Name is required'),
    price: Yup.string().optional(),
    quantity: Yup.string().optional(),
    description: Yup.string().required('Description is required'),
    packages: Yup.string().optional(),
    benefits: Yup.string().required('Benefits are required'),
    usage: Yup.string().required('Usage is required'),
    storage: Yup.string().required('Storage is required'),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState: { errors }, setValue } = useForm(formOptions);

  // Fetch data based on the selected category
  const fetchCategoryData = async (category) => {
    setIsLoading(true);
    try {
      const titlesResponse = await fetch(`/api/${category.toLowerCase()}-titles`);
      const itemsResponse = await fetch(`/api/${category.toLowerCase()}-admin`);

      if (!titlesResponse.ok || !itemsResponse.ok) throw new Error("Failed to fetch category data");

      const titlesData = await titlesResponse.json();
      const itemsData = await itemsResponse.json();

      setTitles(titlesData.data);
      setItems(itemsData.data);
    } catch (error) {
      toast.error(`Failed to load ${category} data`);
    } finally {
      setIsLoading(false);
    }
  };

// For the applicationList, fetch category data for each selected category
useEffect(() => {
  if (applicationList.length) {
    applicationList.forEach((appItem) => {
      const { selectedCategory } = appItem;
      if (selectedCategory) {
        fetchCategoryData(selectedCategory); // Fetch data based on selectedCategory for applicationList
      }
    });
  }
}, [applicationList]);

// For applicationTitleSections, fetch category data based on selectedCategory for each section
useEffect(() => {
  if (applicationTitleSections.length) {
    applicationTitleSections.forEach((sectionItem) => {
      const { selectedCategory } = sectionItem;
      if (selectedCategory) {
        fetchCategoryData(selectedCategory); // Fetch data based on selectedCategory for applicationTitleSections
      }
    });
  }
}, [applicationTitleSections]);

// Handle category change for items in applicationList
const handleApplicationSelectionChange = (index, field, value) => {
  const updatedList = [...applicationList];
  updatedList[index][field] = value;

  // If any of the selectedCategory, selectedTitle, or selectedItem changes, update the link
  if (field === 'selectedCategory' || field === 'selectedTitle' || field === 'selectedItem') {
    const { selectedCategory, selectedTitle, selectedItem } = updatedList[index];
    if (selectedCategory && selectedTitle && selectedItem) {
      const formattedTitle = selectedTitle.replace(/\s+/g, "");
      const formattedItem = selectedItem.replace(/\s+/g, "");
      const categoryName = selectedCategory.toLowerCase() === "aqua" ? "aquatic" : selectedCategory.toLowerCase();
      updatedList[index].link = `https://illusionsengineering.com/${categoryName}#${formattedTitle}-${formattedItem}`;
    }
  }

  setApplicationList(updatedList); // Update the list with the new link
};

// Handle category change for items in applicationTitleSections
const handleApplicationTitleSectionChange = (index, field, value) => {
  const updatedSections = [...applicationTitleSections];
  updatedSections[index][field] = value;

  // When category, title, or item change, update the generated text
  if (field === 'selectedCategory' || field === 'selectedTitle' || field === 'selectedItem') {
    const { selectedCategory, selectedTitle, selectedItem } = updatedSections[index];
    const generatedText = `${selectedCategory}-${selectedTitle}-${selectedItem}`;
    updatedSections[index].generatedText = generatedText;
  }

  setApplicationTitleSections(updatedSections); // Update the sections with the new generated text
};

  const handleAddApplicationTitleSection = () => {
    setApplicationTitleSections([
      ...applicationTitleSections,
      { selectedCategory: '', selectedTitle: '', selectedItem: '', generatedText: '' }
    ]);
  };

  // Handle image input separately for multiple images and certified images
  const handleImagesChange = (e) => {
    setValue('images', Array.from(e.target.files));
  };

  const handleCertifiedImagesChange = (e) => {
    setValue('certifiedImages', Array.from(e.target.files));
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }
        const data = await response.json();
        setProduct(data);
  
        // Set form values for non-array fields
        Object.entries(data).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            // For arrays, we need to handle them properly
            if (key === 'whyChoose') {
              setValue('whyChoose', value);  // Directly set 'whyChoose' as an array of objects
              setWhyChooseList(value);  // Update the local state for the 'whyChooseList'
            } else if (key === 'application') {
              setValue('application', value);  // Directly set 'application' as an array of objects
              setApplicationList(value);  // Update the local state for the 'applicationList'
            } else if (key === 'applicationTitleSection') {
              setValue('applicationTitleSection', value);  // Directly set 'applicationTitleSection' as an array of objects
              setApplicationTitleSections(value);  // Update the local state for the 'applicationTitleSections'
            }
          } else {
            // For non-array fields, directly set the form values
            setValue(key, value);
          }
        });
  
        // Set form values
        Object.entries(data).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            setValue(key, value.join(', ')); // Convert arrays to comma-separated strings
          } else {
            setValue(key, value);
          }
        });
  
      } catch (error) {
        toast.error(error.message);
      }
    };
  
    fetchProduct();
  }, [params.id, setValue]);  

// Handle adding new "Application" section
const handleAddApplication = () => {
  setApplicationList([
    ...applicationList,
    { title: '', description: '', image: null, link: '', selectedCategory: '', selectedTitle: '', selectedItem: '' }
  ]);
};

// Handle changes for title, description, image, and link of "Application" sections
const handleApplicationInputChange = (index, field, value) => {
  const updatedList = [...applicationList];
  updatedList[index][field] = value;

  // Generate the link when category, title, or item changes
  if (field === 'selectedCategory' || field === 'selectedTitle' || field === 'selectedItem') {
    const { selectedCategory, selectedTitle, selectedItem } = updatedList[index];

    if (selectedCategory && selectedTitle && selectedItem) {
      // Generate a unique link when all 3 values are selected
      const formattedTitle = selectedTitle.replace(/\s+/g, ""); // Remove whitespace and replace with hyphen
      const formattedItem = selectedItem.replace(/\s+/g, ""); // Same for item
      const categoryName = selectedCategory.toLowerCase() === "aqua" ? "aquatic" : selectedCategory.toLowerCase();

      // Create a unique link based on the category, title, and item
      updatedList[index].link = `https://illusionsengineering.com/${categoryName}#${formattedTitle}-${formattedItem}`;
    }
  }

  setApplicationList(updatedList); // Update the application list with the new link
};

const handleApplicationImageChange = (index, e) => {
  const updatedList = [...applicationList];
  updatedList[index].image = e.target.files[0]; // Capture the file object (not the event)
  setApplicationList(updatedList);
};  

// Form submit handler
const onSubmit = async (formData) => {
  setIsSubmitting(true);

  // Prepare product data for API (excluding file fields for now)
  const productData = {
    ...formData,
    packages: formData.packages ? formData.packages.split(',').map(item => item.trim()) : [],
    benefits: formData.benefits ? formData.benefits.split(',').map(item => item.trim()) : [],
    usage: formData.usage ? formData.usage.split(',').map(item => item.trim()) : [],
    storage: formData.storage ? formData.storage.split(',').map(item => item.trim()) : [],
    whyChoose: whyChooseList.map(item => ({ title: item.title, description: item.description })),
    applicationTitleSection: applicationTitleSections.map(item => ({
      generatedText: item.generatedText,
    }))
  };

  const formDataToSend = new FormData();

  applicationList.forEach((application, index) => {
    formDataToSend.append(`application[${index}][title]`, application.title);
    formDataToSend.append(`application[${index}][description]`, application.description);
    formDataToSend.append(`application[${index}][link]`, application.link);
    
    if (application.image) {
      formDataToSend.append(`application[${index}][image]`, application.image); // Correctly append the image file
    }
  });

  // Append regular non-array fields (like text data)
  Object.entries(productData).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        formDataToSend.append(key, JSON.stringify(item));  // Arrays will be serialized as JSON
      });
    } else {
      formDataToSend.append(key, value);  // Non-array fields are added directly
    }
  });

  // Handle regular product images (not part of the application)
  const selectedImages = formData.images ? Array.from(formData.images) : [];
  selectedImages.forEach((file) => {
    if (file instanceof File) {
      formDataToSend.append('images', file);
    }
  });

  // Handle certified images (if any)
  const selectedCertifiedImages = formData.certifiedImages ? Array.from(formData.certifiedImages) : [];
  selectedCertifiedImages.forEach((file) => {
    if (file instanceof File) {
      formDataToSend.append('certifiedImages', file);
    }
  });

  // Log the FormData for debugging before sending it
  // console.log('FormData before sending:');
  for (const [key, value] of formDataToSend.entries()) {
    if (value instanceof File) {
      // console.log(`${key}: File -> ${value.name}`);
    } else {
      // console.log(`${key}:`, value);
    }
  }

  // Make the API request to update the product
  try {
    const response = await fetch(`/api/products/${params.id}`, {
      method: 'PUT',
      body: formDataToSend,  // Send the FormData (with image included)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update product');
    }

    toast.success('Product updated successfully!');
    router.push('/products-admin');
  } catch (error) {
    toast.error(`Failed to update product: ${error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};

  // console.log(whyChooseList)

  // console.log(applicationList)

  // console.log(applicationTitleSections)
  
  // Handle adding new "Why Choose" section
  const handleAddWhyChoose = () => {
    setWhyChooseList([...whyChooseList, { title: '', description: '' }]);
  };

  // Handle changes for title or description of "Why Choose" sections
  const handleInputChange = (index, field, value) => {
    const updatedList = [...whyChooseList];
    updatedList[index][field] = value;
    setWhyChooseList(updatedList);
  };

  const handleRemoveWhyChoose = (index) => {
    const updatedWhyChooseList = whyChooseList.filter((_, i) => i !== index);
    setWhyChooseList(updatedWhyChooseList);
  };
  
  const handleRemoveApplication = (index) => {
    const updatedApplicationList = applicationList.filter((_, i) => i !== index);
    setApplicationList(updatedApplicationList);
  };

  const handleRemoveApplicationTitleSection = (index) => {
    const updatedApplicationTitleSections = applicationTitleSections.filter((_, i) => i !== index);
    setApplicationTitleSections(updatedApplicationTitleSections);
  };  

  if (!product) return <p>Loading...</p>; // Show loading state while fetching product

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Toaster />
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Edit Product</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              {...register('name')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="text"
              {...register('price')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter price"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="text"
              {...register('quantity')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter quantity"
            />
            {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagesChange}
              className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
            />
            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Certified Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleCertifiedImagesChange}
              className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
            />
            {errors.certifiedImages && <p className="text-red-500 text-sm mt-1">{errors.certifiedImages.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Package Options (comma-separated)</label>
            <input
              type="text"
              {...register('packageOptions')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.packageOptions ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter package options"
            />
            {errors.packageOptions && <p className="text-red-500 text-sm mt-1">{errors.packageOptions.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Benefits (comma-separated)</label>
            <input
              type="text"
              {...register('benefits')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.benefits ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter benefits"
            />
            {errors.benefits && <p className="text-red-500 text-sm mt-1">{errors.benefits.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Usage (comma-separated)</label>
            <input
              type="text"
              {...register('usage')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.usage ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter usage instructions"
            />
            {errors.usage && <p className="text-red-500 text-sm mt-1">{errors.usage.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Storage (comma-separated)</label>
            <input
              type="text"
              {...register('storage')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.storage ? 'border-red-500' : 'border-gray-300'} text-black rounded-md shadow-sm focus:outline-none sm:text-sm`}
              placeholder="Enter storage instructions"
            />
            {errors.storage && <p className="text-red-500 text-sm mt-1">{errors.storage.message}</p>}
          </div>

{/* Why Choose Section */}
<div>
            <label className="block text-sm font-medium text-gray-700">Why Choose</label>
            {whyChooseList.map((item, index) => (
              <div key={index} className="space-y-2 mb-4">
                <div>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                    placeholder="Enter title"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none sm:text-sm"
                  />
                </div>

                <div>
                  <textarea
                    value={item.description}
                    onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                    placeholder="Enter description"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none sm:text-sm"
                  />
                </div>

                <button
                type="button"
                onClick={() => handleRemoveWhyChoose(index)}
                className="text-red-500 text-sm mt-2"
              >
                Remove Why Choose
              </button>

              </div>
            ))}
            <button
              type="button"
              onClick={handleAddWhyChoose}
              className="mt-4 text-blue-500"
            >
              Add More Why Choose
            </button>
          </div>

           {/* Application Section */}
           <div>
           <label className="block text-sm font-medium text-gray-700">Application</label>
        {applicationList.map((item, index) => (
          <div key={index} className="space-y-2 mb-4">
            <div>
              <input
                type="text"
                value={item.title}
                onChange={(e) => handleApplicationInputChange(index, 'title', e.target.value)}
                placeholder="Enter application title"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none sm:text-sm"
              />
            </div>

            <div>
              <textarea
                value={item.description}
                onChange={(e) => handleApplicationInputChange(index, 'description', e.target.value)}
                placeholder="Enter application description"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none sm:text-sm"
              />
            </div>

            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleApplicationImageChange(index, e)}
                className="mt-1 block w-full text-sm text-gray-500"
              />
            </div>

            <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={item.selectedCategory}
                    onChange={(e) => handleApplicationSelectionChange(index, 'selectedCategory', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                  >
                    <option value="">Select a category</option>
                    {categoriesForList1.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {item.selectedCategory && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Select Title</label>
                      <select
                        value={item.selectedTitle}
                        onChange={(e) => handleApplicationSelectionChange(index, 'selectedTitle', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                      >
                        <option value="">Select a title</option>
                        {titles.map((title) => (
                          <option key={title.id} value={title.title}>{title.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Select Item</label>
                      <select
                        value={item.selectedItem}
                        onChange={(e) => handleApplicationSelectionChange(index, 'selectedItem', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                      >
                        <option value="">Select an item</option>
                        {items
          .filter((filteredItem) => filteredItem.section === item.selectedTitle)
          .map((filteredItem) => (
            <option key={filteredItem.id} value={filteredItem.id}>
              {filteredItem.title}
            </option>
          ))}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Link</label>
                  <input
                    type="text"
                    value={item.link} // Display the generated link
                    className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                  />
                </div>

                <button
                type="button"
                onClick={() => handleRemoveApplication(index)}
                className="text-red-500 text-sm mt-2"
              >
                Remove Application
              </button>

          </div>
        ))}
        <button
          type="button"
          onClick={handleAddApplication}
          className="mt-4 px-4 py-2 text-blue-500 rounded-md"
        >
          Add More Application
        </button>
      </div>

 {/* Loop over the applicationTitleSections */}
 {applicationTitleSections.map((item, index) => (
          <div key={index} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={item.selectedCategory}
                onChange={(e) => handleApplicationTitleSectionChange(index, 'selectedCategory', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              >
                <option value="">Select a category</option>
                {categoriesForList2.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {item.selectedCategory && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Select Title</label>
                  <select
                    value={item.selectedTitle}
                    onChange={(e) => handleApplicationTitleSectionChange(index, 'selectedTitle', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                  >
                    <option value="">Select a title</option>
                    {titles.map((title) => (
                          <option key={title.id} value={title.title}>{title.title}</option>
                        ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Select Item</label>
                  <select
                    value={item.selectedItem}
                    onChange={(e) => handleApplicationTitleSectionChange(index, 'selectedItem', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                  >
                    <option value="">Select an item</option>
                    {items
          .filter((filteredItem) => filteredItem.section === item.selectedTitle)
          .map((filteredItem) => (
            <option key={filteredItem.id} value={filteredItem.id}>
              {filteredItem.title}
            </option>
          ))}
                  </select>
                </div>
              </>
            )}

            {/* Generated Text for applicationTitleSection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Generated Text</label>
              <input
                type="text"
                value={item.generatedText}
                className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                placeholder="Generated text will appear here"
              />
            </div>

            <button
                type="button"
                onClick={() => handleRemoveApplicationTitleSection(index)}
                className="text-red-500 text-sm mt-2"
              >
                Remove Application Title Section
              </button>

          </div>
        ))}

        {/* Button to add more applicationTitleSection */}
        <button
          type="button"
          onClick={handleAddApplicationTitleSection}
          className="mt-4 px-4 py-2 text-blue-500 rounded-md"
        >
          Add More Application Title Section
        </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none"
          >
            {isSubmitting ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
