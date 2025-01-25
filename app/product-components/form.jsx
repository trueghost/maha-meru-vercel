import { useLanguage } from "../context/languageContext";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import Image from "next/image";
import GroundImage from "../../public/images/products/product-ground.png";

function FormProduct({ title2, subtext }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkWindowSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    
    checkWindowSize(); // Check window size on mount
    window.addEventListener("resize", checkWindowSize);

    return () => {
      window.removeEventListener("resize", checkWindowSize);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setIsLoading(true);
      setError(null);
  
      const response = await fetch("/api/product-form-handle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }
  
      const result = await response.json();
  
      // Reset form data after successful submission
      setFormData({
        name: '',
        email: '',
      });
  
      // Show success toast with custom styles
      toast.success("Form submitted successfully!", {
        style: {
          backgroundColor: "#E6CFB7",
          color: "#193048", // Success text color
          border: "2px solid #193048", // Outline for toast
        },
      });
    } catch (error) {
      setError("Error submitting form: " + error.message);
      console.error("Error submitting form:", error);
  
      // Show error toast with custom styles
      toast.error("Error submitting form: " + error.message, {
        style: {
          backgroundColor: "#E6CFB7",
          color: "#DA1D21", // Error text color
          border: "2px solid #193048", // Outline for toast
        },
      });
    } finally {
      setIsLoading(false);
    }
  };  

  return (
    <div
      className={`flex flex-col lg:flex-row font-poppins justify-center bg-cover bg-no-repeat lg:p-0 p-6 pt-16 mb-52 ${
        isLargeScreen ? "bg-[#FFFFFF8C]" : "bg-form-ground"
      }`}
    >
      <div className="flex flex-col lg:w-1/2 w-full p-8 lg:text-left text-center lg:max-w-xl lg:mx-auto">
        {/* Title and Description */}
        <h1 className="lg:text-3xl font-bold lg:text-[#193048] mb-4 text-xl text-white font-poppinsSB">
          {title2}
        </h1>
        {/* Hide this paragraph on mobile */}
        <p className="mb-4 text-[#193048] hidden lg:block">
          {subtext}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="lg:flex lg:flex-row gap-4 mb-2 flex-col items-center lg:items-start">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className={`flex-1 border-2 rounded-lg px-6 py-3 font-semibold w-full ${
                isLargeScreen
                  ? "border-[#193048] text-[#193048] bg-transparent placeholder-[#193048] placeholder:opacity-100"
                  : "border-white text-white bg-transparent placeholder-white placeholder:opacity-100"
              }`}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className={`flex-1 border-2 rounded-lg px-6 py-3 lg:mt-0 mt-3 font-semibold w-full ${
                isLargeScreen
                  ? "border-[#193048] text-[#193048] bg-transparent placeholder-[#193048] placeholder:opacity-100"
                  : "border-white text-white bg-transparent placeholder-white placeholder:opacity-100"
              }`}
            />
          </div>

          {/* Submit Button */}
          <div className="flex lg:justify-start mt-8 justify-center">
            <button className="flex justify-center relative" type="submit" disabled={isLoading}>
              <div
                className={`cursor-pointer w-[200px] font-poppinsSB h-[55px] absolute z-20 mr-[0px] flex justify-center items-center ${
                  isHovered ? "lg:bg-[#193048] bg-[#E6CFB7]" : "lg:bg-[#193048] bg-[#E6CFB7]"
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <h4
                  className={`cursor-pointer lg:text-lg z-10 font-semibold ${
                    isHovered ? "lg:text-[#E6CFB7] text-[#193048]" : "lg:text-[#E6CFB7] text-[#193048]"
                  }`}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </h4>
              </div>
              <div
                className={`w-[195px] h-[60px] border-2 relative z-10 ml-8 mt-[6px] ${
                  isHovered ? "lg:border-[#193048] border-[#E6CFB7]" : "lg:border-[#193048] border-[#E6CFB7]"
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              ></div>
            </button>
          </div>
        </form>
      </div>

      {/* Right Side - Background Image for Mobile */}
      <div className="hidden lg:flex lg:w-1/2 w-full items-center justify-center">
        <Image
          src={GroundImage}
          alt="Ground"
          width={719}
          height={440}
          className="object-cover"
        />
      </div>
      <Toaster />
    </div>
  );
}

export default FormProduct;
