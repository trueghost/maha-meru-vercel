"use client"
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

const Smallform = ({ title3, subtext3 }) => {

  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
      setError(null);
  
      const response = await fetch("/api/connect-form-handle", {
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
  
      // Reset form data to initial values after successful submission
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
      setLoading(false);
    }
  };  

  return (
    <section className="bg-[#193048] p-5 py-10 flex flex-col items-center font-poppins">
      {/* Heading */}
      <div className="text-center px-4 md:px-20 lg:px-40 mt-4">
        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl  font-PoppinsSB font-semibold text-white">
          {title3}
        </h3>
      </div>

      {/* Description */}
      <div className="px-4 md:px-10 text-center font-thin mt-4 md:mt-7">
        <p className="text-sm sm:text-base md:text-lg lg:text-lg font-poppins text-white leading-relaxed">
          {subtext3}
        </p>
      </div>

      {/* Form Inputs */}
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row justify-center gap-4 mt-6 md:mt-10 w-full px-4 md:px-0">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
          className="w-full md:w-40 px-4 py-2 sm:py-3 md:py-4 border rounded-2xl border-white bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E6CFB7]"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="w-full md:w-64 px-4 py-2 sm:py-3 md:py-4 border rounded-2xl border-white bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E6CFB7]"
        />
        
        {/* Submit Button */}
        <div className='flex justify-center max-[1024px]:justify-center'>
          <button className='flex justify-center cursor-pointer' type="submit" disabled={loading}>
            <div
              className={`cursor-pointer w-[200px] h-[55px] absolute z-20 mr-[10px] flex justify-center items-center  ${
                isHovered ? 'bg-[#E6CFB7]' : 'bg-[#E6CFB7]'
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <h4
                className={`cursor-pointer lg:text-lg z-10 font-semibold font-poppinsSB ${
                  isHovered ? 'text-[#193048]' : 'text-[#193048]'
                }`}
                style={{
                  fontFamily: "PoppinsSB",
                  color: "#193048",
                  fontWeight: "400", // Equivalent to font-semibold in Tailwind
                }}
              >
                {loading ? "Submitting..." : "Submit"}
              </h4>
            </div>
            <div
              className={`w-[195px] h-[60px] border-2 relative z-10 ml-8 mt-[6px]  ${
                isHovered ? 'border-[#E6CFB7]' : 'border-[#E6CFB7]'
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            ></div>
          </button>
        </div>
      </form>
      <Toaster />
    </section>
  );
};

export default Smallform;
