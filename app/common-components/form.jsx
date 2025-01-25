"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import sun from "../../public/images/form-image.webp";
import { useLanguage } from "../context/languageContext"; // Import useLanguage hook

function Form() {
  const [isHovered, setIsHovered] = useState(false);
  const [title, setTitle] = useState("");
  const [form, setForm] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [translations, setTranslations] = useState({});
  const { language } = useLanguage(); // Get the current language
  const [translatedSeeProductsText, setTranslatedSeeProductsText] = useState('');
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    interests: [], // Array to hold selected interests
    description: "",
    countryCode: "+971",  // Default country code
  });

  const translateText = async (text, targetLanguage) => {
    try {
      const response = await fetch(
        `/api/translate?text=${encodeURIComponent(text)}&targetLanguage=${targetLanguage}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch translation");
      }
      const data = await response.json();
      return data.translatedText;
    } catch (error) {
      console.error("Error fetching translation:", error.message);
      return text; // Fallback to original text if translation fails
    }
  };

  const translateIfNeeded = async (text, language) => {
    if (language === 'ar' || language === 'hi') {
      return await translateText(text, language);
    }
    return text; // Return the text as is if translation isn't needed
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch title and subtext
        const titleResponse = await fetch("/api/title-subtext");
        if (!titleResponse.ok) throw new Error("Failed to fetch title and subtext");
        const titleData = await titleResponse.json();
        const pageEntry = titleData.entries.find((entry) => entry.page_name === "Form Home");
  
        if (pageEntry) {
          const translatedTitle = await translateIfNeeded(pageEntry.title, language);
          setTitle(translatedTitle); // Set translated title if necessary
        }
  
        // Fetch translation for 'Submit' text
        const translatedSubmitText = await translateIfNeeded('Submit', language);
        setTranslatedSeeProductsText(translatedSubmitText); // Set translated 'Submit' text
  
        // Fetch forms data
        const formResponse = await fetch("/api/form-admin/1");
        if (!formResponse.ok) throw new Error("Failed to fetch forms");
        const formData = await formResponse.json();
        setForm(formData.data);
  
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData(); // Call the fetchData function when language changes
  
  }, [language]);  

  const countryCodes = [
    { code: "+971", country: "UAE" },       // United Arab Emirates
    { code: "+91", country: "IN" },         // India
    { code: "+1", country: "US" },          // United States
    { code: "+44", country: "UK" },         // United Kingdom
    { code: "+86", country: "CN" },         // China
    { code: "+81", country: "JP" },         // Japan
    { code: "+49", country: "DE" },         // Germany
    { code: "+33", country: "FR" },         // France
    { code: "+61", country: "AU" },         // Australia
    { code: "+55", country: "BR" },         // Brazil
    { code: "+7", country: "RU" },          // Russia
    { code: "+82", country: "KR" },         // South Korea
    { code: "+34", country: "ES" },         // Spain
    { code: "+39", country: "IT" },         // Italy
    { code: "+52", country: "MX" },         // Mexico
    { code: "+27", country: "ZA" },         // South Africa
    { code: "+62", country: "ID" },         // Indonesia
    { code: "+60", country: "MY" },         // Malaysia
    { code: "+92", country: "PK" },         // Pakistan
    { code: "+90", country: "TR" },         // Turkey
    { code: "+63", country: "PH" },         // Philippines
    { code: "+234", country: "NG" },        // Nigeria
    { code: "+66", country: "TH" },         // Thailand
    { code: "+46", country: "SE" },         // Sweden
    { code: "+47", country: "NO" },         // Norway
    { code: "+45", country: "DK" },         // Denmark
    { code: "+351", country: "PT" },        // Portugal
    { code: "+64", country: "NZ" },         // New Zealand
    { code: "+94", country: "LK" },         // Sri Lanka
  ];
  
  const [selectedCode, setSelectedCode] = useState(countryCodes[0].code);

  const handleSelectChange = (e) => {
    setSelectedCode(e.target.value);
    setFormData({ ...formData, countryCode: e.target.value });
  };


const countryCodeMapping = {
  "+971": 12,
  "+91": 10,
  "+1": 10,
  "+44": 10,
  "+86": 11,
  "+81": 10,
  "+49": 10,
  "+33": 10,
  "+61": 9,
  "+55": 11,
  "+7": 11,
  "+82": 11,
  "+34": 9,
  "+39": 10,
  "+52": 10,
  "+27": 9,
  "+62": 12,
  "+60": 10,
  "+92": 10,
  "+90": 10,
  "+63": 10,
  "+234": 10,
  "+66": 9,
  "+46": 9,
  "+47": 8,
  "+45": 8,
  "+351": 9,
  "+64": 9,
  "+94": 10,

};
const handleInputChanges = (e) => {
  // Allow only numbers in the input
  const value = e.target.value.replace(/[^0-9]/g, "");
  setFormData({
    ...formData,
    number: value,
  });
};

const PhoneNumberForm = () => {
  const [formData, setFormData] = useState({
    countryCode: "+971", // Default country code
    number: "", // Phone number input
  });

  const handleSelectChange = (e) => {
    setFormData({
      ...formData,
      countryCode: e.target.value,
      number: "", // Reset phone number on country code change
    });
  };
 
 
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Limit the description field to 200 characters
    if (name === "description" && value.length > 200) {
      return; // Do nothing if character limit exceeded
    }
    setFormData({ ...formData, [name]: value });
  };
  

  const charCount = formData.description.length;

  

  const handleInterestChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const updatedInterests = checked
        ? [...prevData.interests, value]
        : prevData.interests.filter((interest) => interest !== value);
      return { ...prevData, interests: updatedInterests };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form data (basic example)
    const { name, email, number, description } = formData;
  
    if (!name || !email || !number || !description) {
      toast.error("Please fill in all required fields.", {
        style: {
          backgroundColor: "#E6CFB7",
          color: "#DA1D21", // Error text color
          border: "2px solid #193048", // Outline for toast
        },
      });
      return;
    }
  
    if (!validatePhoneNumber(number)) {
      toast.error("Please enter a valid phone number.", {
        style: {
          backgroundColor: "#E6CFB7",
          color: "#DA1D21",
          border: "2px solid #193048",
        },
      });
      return;
    }
  
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.", {
        style: {
          backgroundColor: "#E6CFB7",
          color: "#DA1D21",
          border: "2px solid #193048",
        },
      });
      return;
    }
  
    // Proceed with form submission if validation passes
    try {
      setIsLoading(true);
      setError(null);
  
      const response = await fetch("/api/form-handle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          number: `${formData.countryCode}${number}`,
          interests: formData.interests,
          description,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }
  
      const result = await response.json();
      toast.success("Form submitted successfully!", {
        style: {
          backgroundColor: "#E6CFB7",
          color: "#193048", // Success text color
          border: "2px solid #193048", // Outline for toast
        },
      });
  
      // Reset form data
      setFormData({
        name: '',
        email: '',
        number: '',
        countryCode: '',
        interests: [],
        description: '',
      });
    } catch (error) {
      setError("Error submitting form: " + error.message);
      toast.error("Error submitting form: " + error.message, {
        style: {
          backgroundColor: "#E6CFB7",
          color: "#DA1D21",
          border: "2px solid #193048",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Example of email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  
  // Example of phone number validation function
  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[0-9]{10,12}$/; // Adjust as per your requirements
    return phoneRegex.test(number);
  };

  return (
    <div className="object-cover bg-no-repeat pb-16  w-screen flex justify-center items-center  font-poppins">
      <div className="flex flex-col items-center gap-7">
        <div className="text-center">
        <h1
        className="text-[#193048] text-3xl font-poppinsSB font-bold mx-8"
        style={{ fontFamily: "PoppinsSB", fontWeight: "400" }}
      >
        {title}
      </h1>
        </div>
        <div className="text-center border border-neutral-border rounded-md bg-white-30 backdrop-blur-custom mx-5 font-poppins">
          <div className="flex justify-center flex-col-reverse xl:flex-row">
            <div className="bg-[#193048] rounded-md">
              <div className="text-start p-4 xl:p-10">
                {/* <h1 className='text-white lg:text-2xl font-bold'>
                  Contact Information
                </h1>
                <h3 className='text-[#797D80] lg:text-base font-normal mt-2'>
                  Say something to start a live chat
                </h3> */}
                <div className="mt-20 flex flex-col items-start gap-10">
                  <div className="flex items-center justify-start gap-6">
                    <svg
                      width="21"
                      height="22"
                      viewBox="0 0 21 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.4085 16.0547L19.4522 20.0792C19.3326 20.6769 18.8545 21.0754 18.2568 21.0754C8.21543 21.0355 0.046875 12.867 0.046875 2.82563C0.046875 2.22793 0.405494 1.74978 1.00319 1.63024L5.0277 0.673917C5.58555 0.554377 6.18325 0.87315 6.42233 1.39116L8.29512 5.73444C8.49436 6.25244 8.37482 6.85014 7.9365 7.16891L5.78479 8.92217C7.13957 11.6716 9.37098 13.903 12.1602 15.2578L13.9135 13.1061C14.2323 12.7076 14.83 12.5482 15.348 12.7474L19.6913 14.6202C20.2093 14.8992 20.528 15.4969 20.4085 16.0547Z"
                        fill="#E6CFB7"
                      />
                    </svg>
                    <p className="lg:text-lg font-medium text-[#E6CFB7] font-poppins">
                      +{form?.mobile_number_1}
                    </p>
                    <p className="text-[#E6CFB7] lg:text-lg font-medium font-poppins">
                      +{form?.mobile_number_2}
                    </p>
                  </div>
                  <div className="flex items-center justify-start gap-6">
                    <svg
                      width="21"
                      height="16"
                      viewBox="0 0 21 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.2476 11.9814C9.57021 11.9814 8.89282 11.7821 8.33497 11.3438L0.046875 4.88867V13.894C0.046875 14.9699 0.883654 15.8066 1.95951 15.8066H18.5357C19.5717 15.8066 20.4483 14.9699 20.4483 13.894V4.88867L12.1204 11.3438C11.5625 11.7821 10.8852 11.9814 10.2476 11.9814ZM0.684421 3.77296L9.1319 10.3477C9.76945 10.8258 10.6859 10.8258 11.3235 10.3477L19.7709 3.77296C20.1694 3.45419 20.4483 2.93619 20.4483 2.41818C20.4483 1.38217 19.5717 0.505542 18.5357 0.505542H1.95951C0.883654 0.505542 0.046875 1.38217 0.046875 2.41818C0.046875 2.93619 0.285955 3.45419 0.684421 3.77296Z"
                        fill="#E6CFB7"
                      />
                    </svg>
                    <p className="text-[#E6CFB7] lg:text-lg font-medium font-poppins">
                      {form?.mail}
                    </p>
                  </div>
                  <div className="flex items-center justify-start gap-6">
                    <svg
                      width="18"
                      height="25"
                      viewBox="0 0 18 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.05457 23.4774C5.70412 20.5393 0.46082 13.5332 0.46082 9.55552C0.46082 4.76423 4.3029 0.876954 9.13939 0.876954C13.9307 0.876954 17.818 4.76423 17.818 9.55552C17.818 13.5332 12.5295 20.5393 10.179 23.4774C9.6366 24.1554 8.59698 24.1554 8.05457 23.4774ZM9.13939 12.4484C10.7214 12.4484 12.0322 11.1828 12.0322 9.55552C12.0322 7.97349 10.7214 6.66267 9.13939 6.66267C7.51216 6.66267 6.24653 7.97349 6.24653 9.55552C6.24653 11.1828 7.51216 12.4484 9.13939 12.4484Z"
                        fill="#E6CFB7"
                      />
                    </svg>
                    <p className="text-[#E6CFB7] lg:text-lg font-medium">
                      {form?.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-5">
                    <svg className="cursor-pointer"
                      onClick={() => window.open(form?.facebook_url, "_blank")}
                      width="14"
                      height="21"
                      viewBox="0 0 14 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_2_11973)">
                        <path
                          d="M11.1484 12.5713H8.21875V21.3213H4.3125V12.5713H1.10938V8.97754H4.3125V6.2041C4.3125 3.0791 6.1875 1.32129 9.03906 1.32129C10.4062 1.32129 11.8516 1.59473 11.8516 1.59473V4.68066H10.25C8.6875 4.68066 8.21875 5.61816 8.21875 6.63379V8.97754H11.6953L11.1484 12.5713Z"
                          fill="#E6CFB7"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_2_11973">
                          <rect
                            width="13"
                            height="20"
                            fill="white"
                            transform="translate(0.25 0.821289)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    <svg className="cursor-pointer"
                      onClick={() => window.open(form?.x_url, "_blank")}
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M20.0565 19.4072L12.3873 8.22894L12.4004 8.23942L19.3153 0.227539H17.0046L11.3715 6.74863L6.89808 0.227539H0.837705L7.99767 10.6639L7.99681 10.663L0.445312 19.4072H2.75611L9.0188 12.1521L13.9962 19.4072H20.0565ZM5.98249 1.97114L16.7429 17.6636H14.9118L4.14261 1.97114H5.98249Z"
                        fill="#E6CFB7"
                      />
                    </svg>
                    <svg className="cursor-pointer"
                      onClick={() => window.open(form?.instagram_url, "_blank")}
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 4.8291C11.4609 4.8291 13.4922 6.86035 13.4922 9.32129C13.4922 11.8213 11.4609 13.8135 9 13.8135C6.5 13.8135 4.50781 11.8213 4.50781 9.32129C4.50781 6.86035 6.5 4.8291 9 4.8291ZM9 12.251C10.6016 12.251 11.8906 10.9619 11.8906 9.32129C11.8906 7.71973 10.6016 6.43066 9 6.43066C7.35938 6.43066 6.07031 7.71973 6.07031 9.32129C6.07031 10.9619 7.39844 12.251 9 12.251ZM14.7031 4.67285C14.7031 4.08691 14.2344 3.61816 13.6484 3.61816C13.0625 3.61816 12.5938 4.08691 12.5938 4.67285C12.5938 5.25879 13.0625 5.72754 13.6484 5.72754C14.2344 5.72754 14.7031 5.25879 14.7031 4.67285ZM17.6719 5.72754C17.75 7.17285 17.75 11.5088 17.6719 12.9541C17.5938 14.3604 17.2812 15.5713 16.2656 16.626C15.25 17.6416 14 17.9541 12.5938 18.0322C11.1484 18.1104 6.8125 18.1104 5.36719 18.0322C3.96094 17.9541 2.75 17.6416 1.69531 16.626C0.679688 15.5713 0.367188 14.3604 0.289062 12.9541C0.210938 11.5088 0.210938 7.17285 0.289062 5.72754C0.367188 4.32129 0.679688 3.07129 1.69531 2.05566C2.75 1.04004 3.96094 0.727539 5.36719 0.649414C6.8125 0.571289 11.1484 0.571289 12.5938 0.649414C14 0.727539 15.25 1.04004 16.2656 2.05566C17.2812 3.07129 17.5938 4.32129 17.6719 5.72754ZM15.7969 14.4775C16.2656 13.3447 16.1484 10.6104 16.1484 9.32129C16.1484 8.07129 16.2656 5.33691 15.7969 4.16504C15.4844 3.42285 14.8984 2.79785 14.1562 2.52441C12.9844 2.05566 10.25 2.17285 9 2.17285C7.71094 2.17285 4.97656 2.05566 3.84375 2.52441C3.0625 2.83691 2.47656 3.42285 2.16406 4.16504C1.69531 5.33691 1.8125 8.07129 1.8125 9.32129C1.8125 10.6104 1.69531 13.3447 2.16406 14.4775C2.47656 15.2588 3.0625 15.8447 3.84375 16.1572C4.97656 16.626 7.71094 16.5088 9 16.5088C10.25 16.5088 12.9844 16.626 14.1562 16.1572C14.8984 15.8447 15.5234 15.2588 15.7969 14.4775Z"
                        fill="#E6CFB7"
                      />
                    </svg>
                    <svg className="cursor-pointer"
                      onClick={() => window.open(form?.linkedin_url, "_blank")}
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.7186 2.82143H3.77859C3.58817 2.81878 3.39909 2.85368 3.22216 2.92411C3.04522 2.99455 2.8839 3.09915 2.74739 3.23194C2.61089 3.36473 2.50188 3.52311 2.42659 3.69804C2.3513 3.87296 2.3112 4.06101 2.30859 4.25143V21.3914C2.3112 21.5819 2.3513 21.7699 2.42659 21.9448C2.50188 22.1197 2.61089 22.2781 2.74739 22.4109C2.8839 22.5437 3.04522 22.6483 3.22216 22.7187C3.39909 22.7892 3.58817 22.8241 3.77859 22.8214H20.7186C20.909 22.8241 21.0981 22.7892 21.275 22.7187C21.452 22.6483 21.6133 22.5437 21.7498 22.4109C21.8863 22.2781 21.9953 22.1197 22.0706 21.9448C22.1459 21.7699 22.186 21.5819 22.1886 21.3914V4.25143C22.186 4.06101 22.1459 3.87296 22.0706 3.69804C21.9953 3.52311 21.8863 3.36473 21.7498 3.23194C21.6133 3.09915 21.452 2.99455 21.275 2.92411C21.0981 2.85368 20.909 2.81878 20.7186 2.82143ZM8.33859 19.5614H5.33859V10.5614H8.33859V19.5614ZM6.83859 9.30143C6.42486 9.30143 6.02806 9.13707 5.73551 8.84452C5.44295 8.55196 5.27859 8.15517 5.27859 7.74143C5.27859 7.32769 5.44295 6.9309 5.73551 6.63834C6.02806 6.34579 6.42486 6.18143 6.83859 6.18143C7.05829 6.15651 7.28077 6.17828 7.49147 6.24531C7.70217 6.31234 7.89633 6.42312 8.06125 6.57039C8.22617 6.71766 8.35812 6.89811 8.44846 7.09991C8.53881 7.30171 8.58551 7.52033 8.58551 7.74143C8.58551 7.96253 8.53881 8.18114 8.44846 8.38295C8.35812 8.58475 8.22617 8.7652 8.06125 8.91247C7.89633 9.05974 7.70217 9.17052 7.49147 9.23755C7.28077 9.30457 7.05829 9.32634 6.83859 9.30143ZM19.1586 19.5614H16.1586V14.7314C16.1586 13.5214 15.7286 12.7314 14.6386 12.7314C14.3013 12.7339 13.9728 12.8397 13.6974 13.0346C13.4221 13.2295 13.2131 13.5041 13.0986 13.8214C13.0203 14.0565 12.9864 14.304 12.9986 14.5514V19.5514H9.99859V10.5514H12.9986V11.8214C13.2711 11.3485 13.6675 10.9589 14.145 10.6946C14.6226 10.4303 15.1632 10.3013 15.7086 10.3214C17.7086 10.3214 19.1586 11.6114 19.1586 14.3814V19.5614Z"
                        fill="#E6CFB7"
                      />
                    </svg>
                  </div>
                  <div className="cursor-pointer">
                    <svg
                      onClick={() => window.open(form?.whatsapp_url, "_blank")}
                      width="148"
                      height="37"
                      viewBox="0 0 148 37"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.25"
                        y="0.740234"
                        width="147"
                        height="36"
                        rx="18"
                        fill="#0B7300"
                      />
                      <path
                        d="M27.1834 10.1845C29.0501 12.0512 30.2057 14.4957 30.2057 17.1624C30.2057 22.5846 25.6723 27.0291 20.2056 27.0291C18.5611 27.0291 16.9611 26.5847 15.4944 25.8291L10.2943 27.1625L11.6721 22.0513C10.8277 20.5846 10.3388 18.8957 10.3388 17.1179C10.3388 11.6956 14.7833 7.25114 20.2056 7.25114C22.8723 7.25114 25.3612 8.31782 27.1834 10.1845ZM20.2056 25.3402C24.7389 25.3402 28.5168 21.6513 28.5168 17.1624C28.5168 14.9401 27.5834 12.8956 26.0278 11.3401C24.4723 9.7845 22.4278 8.94005 20.25 8.94005C15.7166 8.94005 12.0277 12.629 12.0277 17.1179C12.0277 18.6735 12.4721 20.1846 13.2721 21.518L13.4944 21.8291L12.6499 24.8513L15.7611 24.0069L16.0277 24.1847C17.3166 24.9402 18.7389 25.3402 20.2056 25.3402ZM24.7389 19.2068C24.9612 19.3402 25.1389 19.3846 25.1834 19.5179C25.2723 19.6068 25.2723 20.0957 25.0501 20.6735C24.8278 21.2513 23.85 21.7846 23.4056 21.8291C22.6056 21.9624 21.9834 21.918 20.4278 21.2069C17.9389 20.1402 16.3388 17.6513 16.2055 17.5179C16.0722 17.3401 15.2277 16.1846 15.2277 14.9401C15.2277 13.7401 15.85 13.1623 16.0722 12.8956C16.2944 12.629 16.5611 12.5845 16.7388 12.5845C16.8722 12.5845 17.05 12.5845 17.1833 12.5845C17.3611 12.5845 17.5389 12.5401 17.7611 13.029C17.9389 13.5179 18.4722 14.7179 18.5166 14.8512C18.5611 14.9846 18.6055 15.1179 18.5166 15.2957C18.0722 16.229 17.5389 16.1846 17.8055 16.629C18.7833 18.2735 19.7167 18.8513 21.1833 19.5624C21.4056 19.6957 21.5389 19.6513 21.7167 19.5179C21.85 19.3402 22.3389 18.7624 22.4722 18.5402C22.65 18.2735 22.8278 18.3179 23.05 18.4068C23.2723 18.4957 24.4723 19.0735 24.7389 19.2068Z"
                        fill="#F2F2F7"
                      />
                      <path
                        d="M49.0951 13.2123L45.9746 23.7402H44.0205L41.8089 15.7724L39.4609 23.7402L37.522 23.7554L34.5378 13.2123H36.3707L38.552 21.7861L40.9151 13.2123H42.8541L45.0506 21.7407L47.247 13.2123H49.0951ZM54.8366 15.2573C55.4728 15.2573 56.0383 15.3937 56.5331 15.6663C57.0381 15.939 57.4319 16.3429 57.7147 16.8782C58.0075 17.4134 58.154 18.0597 58.154 18.8171V23.7402H56.4423V19.0746C56.4423 18.3273 56.2554 17.7568 55.8818 17.3629C55.5081 16.959 54.9981 16.757 54.3518 16.757C53.7055 16.757 53.1905 16.959 52.8067 17.3629C52.4331 17.7568 52.2462 18.3273 52.2462 19.0746V23.7402H50.5194V12.5307H52.2462V16.3631C52.5391 16.0097 52.9077 15.737 53.352 15.5451C53.8065 15.3533 54.3013 15.2573 54.8366 15.2573ZM59.7811 19.5291C59.7811 18.6909 59.9528 17.9486 60.2961 17.3023C60.6496 16.656 61.1242 16.1561 61.72 15.8027C62.326 15.4391 62.9925 15.2573 63.7196 15.2573C64.376 15.2573 64.9466 15.3886 65.4313 15.6512C65.9262 15.9036 66.32 16.2218 66.6129 16.6055V15.3937H68.3549V23.7402H66.6129V22.4981C66.32 22.8919 65.9211 23.2202 65.4162 23.4827C64.9112 23.7453 64.3356 23.8766 63.6893 23.8766C62.9723 23.8766 62.3159 23.6948 61.72 23.3312C61.1242 22.9576 60.6496 22.4426 60.2961 21.7861C59.9528 21.1196 59.7811 20.3673 59.7811 19.5291ZM66.6129 19.5594C66.6129 18.9837 66.4917 18.4839 66.2493 18.0597C66.017 17.6356 65.709 17.3124 65.3253 17.0902C64.9415 16.8681 64.5275 16.757 64.0831 16.757C63.6388 16.757 63.2248 16.8681 62.841 17.0902C62.4572 17.3023 62.1442 17.6204 61.9018 18.0446C61.6696 18.4586 61.5534 18.9534 61.5534 19.5291C61.5534 20.1047 61.6696 20.6096 61.9018 21.0439C62.1442 21.4781 62.4572 21.8114 62.841 22.0437C63.2348 22.2658 63.6489 22.3769 64.0831 22.3769C64.5275 22.3769 64.9415 22.2658 65.3253 22.0437C65.709 21.8215 66.017 21.4983 66.2493 21.0742C66.4917 20.6399 66.6129 20.135 66.6129 19.5594ZM72.6378 16.8024V21.4226C72.6378 21.7356 72.7085 21.9629 72.8498 22.1042C73.0013 22.2355 73.2538 22.3012 73.6072 22.3012H74.6676V23.7402H73.3043C72.5267 23.7402 71.9309 23.5585 71.5168 23.1949C71.1028 22.8314 70.8957 22.2406 70.8957 21.4226V16.8024H69.9111V15.3937H70.8957V13.3184H72.6378V15.3937H74.6676V16.8024H72.6378ZM79.2888 23.8766C78.6324 23.8766 78.0416 23.7604 77.5165 23.5282C77.0015 23.2858 76.5925 22.9626 76.2895 22.5587C75.9866 22.1446 75.825 21.6851 75.8048 21.1802H77.5922C77.6225 21.5337 77.7892 21.8316 78.0921 22.0739C78.4052 22.3062 78.794 22.4224 79.2585 22.4224C79.7433 22.4224 80.1169 22.3315 80.3795 22.1497C80.6522 21.9578 80.7885 21.7154 80.7885 21.4226C80.7885 21.1095 80.637 20.8773 80.334 20.7258C80.0412 20.5743 79.5716 20.4077 78.9253 20.2259C78.2992 20.0542 77.7892 19.8876 77.3953 19.726C77.0015 19.5644 76.6581 19.317 76.3653 18.9837C76.0825 18.6505 75.9411 18.2112 75.9411 17.6659C75.9411 17.2215 76.0724 16.8176 76.335 16.454C76.5975 16.0804 76.9712 15.7875 77.4559 15.5754C77.9507 15.3634 78.5163 15.2573 79.1525 15.2573C80.1018 15.2573 80.8642 15.4997 81.4398 15.9844C82.0256 16.4591 82.3386 17.1104 82.379 17.9385H80.6522C80.6219 17.5649 80.4704 17.267 80.1977 17.0448C79.925 16.8226 79.5564 16.7115 79.0919 16.7115C78.6375 16.7115 78.2891 16.7974 78.0467 16.9691C77.8043 17.1407 77.6831 17.368 77.6831 17.6507C77.6831 17.8729 77.7639 18.0597 77.9255 18.2112C78.0871 18.3627 78.284 18.4839 78.5163 18.5747C78.7485 18.6555 79.0919 18.7616 79.5463 18.8929C80.1523 19.0544 80.6471 19.2211 81.0309 19.3927C81.4247 19.5543 81.763 19.7967 82.0458 20.1199C82.3285 20.443 82.475 20.8722 82.4851 21.4074C82.4851 21.8821 82.3538 22.3062 82.0912 22.6799C81.8286 23.0535 81.455 23.3464 80.9703 23.5585C80.4956 23.7705 79.9351 23.8766 79.2888 23.8766ZM83.7754 19.5291C83.7754 18.6909 83.947 17.9486 84.2904 17.3023C84.6439 16.656 85.1185 16.1561 85.7143 15.8027C86.3202 15.4391 86.9868 15.2573 87.7139 15.2573C88.3703 15.2573 88.9409 15.3886 89.4256 15.6512C89.9204 15.9036 90.3143 16.2218 90.6071 16.6055V15.3937H92.3492V23.7402H90.6071V22.4981C90.3143 22.8919 89.9154 23.2202 89.4104 23.4827C88.9055 23.7453 88.3299 23.8766 87.6836 23.8766C86.9666 23.8766 86.3101 23.6948 85.7143 23.3312C85.1185 22.9576 84.6439 22.4426 84.2904 21.7861C83.947 21.1196 83.7754 20.3673 83.7754 19.5291ZM90.6071 19.5594C90.6071 18.9837 90.486 18.4839 90.2436 18.0597C90.0113 17.6356 89.7033 17.3124 89.3196 17.0902C88.9358 16.8681 88.5218 16.757 88.0774 16.757C87.6331 16.757 87.219 16.8681 86.8353 17.0902C86.4515 17.3023 86.1385 17.6204 85.8961 18.0446C85.6638 18.4586 85.5477 18.9534 85.5477 19.5291C85.5477 20.1047 85.6638 20.6096 85.8961 21.0439C86.1385 21.4781 86.4515 21.8114 86.8353 22.0437C87.2291 22.2658 87.6432 22.3769 88.0774 22.3769C88.5218 22.3769 88.9358 22.2658 89.3196 22.0437C89.7033 21.8215 90.0113 21.4983 90.2436 21.0742C90.486 20.6399 90.6071 20.135 90.6071 19.5594ZM96.3442 16.6206C96.6371 16.2369 97.036 15.9137 97.5409 15.6512C98.0459 15.3886 98.6164 15.2573 99.2527 15.2573C99.9798 15.2573 100.641 15.4391 101.237 15.8027C101.843 16.1561 102.318 16.656 102.661 17.3023C103.004 17.9486 103.176 18.6909 103.176 19.5291C103.176 20.3673 103.004 21.1196 102.661 21.7861C102.318 22.4426 101.843 22.9576 101.237 23.3312C100.641 23.6948 99.9798 23.8766 99.2527 23.8766C98.6164 23.8766 98.0509 23.7503 97.5561 23.4979C97.0612 23.2353 96.6573 22.9121 96.3442 22.5284V27.709H94.6174V15.3937H96.3442V16.6206ZM101.419 19.5291C101.419 18.9534 101.298 18.4586 101.055 18.0446C100.823 17.6204 100.51 17.3023 100.116 17.0902C99.7323 16.8681 99.3183 16.757 98.874 16.757C98.4397 16.757 98.0257 16.8681 97.6318 17.0902C97.2481 17.3124 96.935 17.6356 96.6926 18.0597C96.4604 18.4839 96.3442 18.9837 96.3442 19.5594C96.3442 20.135 96.4604 20.6399 96.6926 21.0742C96.935 21.4983 97.2481 21.8215 97.6318 22.0437C98.0257 22.2658 98.4397 22.3769 98.874 22.3769C99.3183 22.3769 99.7323 22.2658 100.116 22.0437C100.51 21.8114 100.823 21.4781 101.055 21.0439C101.298 20.6096 101.419 20.1047 101.419 19.5291ZM106.611 16.6206C106.903 16.2369 107.302 15.9137 107.807 15.6512C108.312 15.3886 108.883 15.2573 109.519 15.2573C110.246 15.2573 110.908 15.4391 111.503 15.8027C112.109 16.1561 112.584 16.656 112.927 17.3023C113.271 17.9486 113.442 18.6909 113.442 19.5291C113.442 20.3673 113.271 21.1196 112.927 21.7861C112.584 22.4426 112.109 22.9576 111.503 23.3312C110.908 23.6948 110.246 23.8766 109.519 23.8766C108.883 23.8766 108.317 23.7503 107.822 23.4979C107.328 23.2353 106.924 22.9121 106.611 22.5284V27.709H104.884V15.3937H106.611V16.6206ZM111.685 19.5291C111.685 18.9534 111.564 18.4586 111.322 18.0446C111.089 17.6204 110.776 17.3023 110.382 17.0902C109.999 16.8681 109.585 16.757 109.14 16.757C108.706 16.757 108.292 16.8681 107.898 17.0902C107.514 17.3124 107.201 17.6356 106.959 18.0597C106.727 18.4839 106.611 18.9837 106.611 19.5594C106.611 20.135 106.727 20.6399 106.959 21.0742C107.201 21.4983 107.514 21.8215 107.898 22.0437C108.292 22.2658 108.706 22.3769 109.14 22.3769C109.585 22.3769 109.999 22.2658 110.382 22.0437C110.776 21.8114 111.089 21.4781 111.322 21.0439C111.564 20.6096 111.685 20.1047 111.685 19.5291ZM120.797 13.2123V19.9229C120.797 20.7207 121.004 21.3216 121.418 21.7255C121.842 22.1295 122.428 22.3315 123.175 22.3315C123.932 22.3315 124.518 22.1295 124.932 21.7255C125.356 21.3216 125.568 20.7207 125.568 19.9229V13.2123H127.295V19.8926C127.295 20.751 127.108 21.4781 126.735 22.0739C126.361 22.6698 125.861 23.1141 125.235 23.407C124.609 23.6998 123.917 23.8463 123.16 23.8463C122.402 23.8463 121.711 23.6998 121.085 23.407C120.469 23.1141 119.979 22.6698 119.615 22.0739C119.252 21.4781 119.07 20.751 119.07 19.8926V13.2123H120.797ZM132.573 23.8766C131.917 23.8766 131.326 23.7604 130.801 23.5282C130.286 23.2858 129.877 22.9626 129.574 22.5587C129.271 22.1446 129.109 21.6851 129.089 21.1802H130.877C130.907 21.5337 131.074 21.8316 131.377 22.0739C131.69 22.3062 132.078 22.4224 132.543 22.4224C133.028 22.4224 133.401 22.3315 133.664 22.1497C133.937 21.9578 134.073 21.7154 134.073 21.4226C134.073 21.1095 133.921 20.8773 133.618 20.7258C133.326 20.5743 132.856 20.4077 132.21 20.2259C131.584 20.0542 131.074 19.8876 130.68 19.726C130.286 19.5644 129.943 19.317 129.65 18.9837C129.367 18.6505 129.226 18.2112 129.226 17.6659C129.226 17.2215 129.357 16.8176 129.619 16.454C129.882 16.0804 130.256 15.7875 130.74 15.5754C131.235 15.3634 131.801 15.2573 132.437 15.2573C133.386 15.2573 134.149 15.4997 134.724 15.9844C135.31 16.4591 135.623 17.1104 135.663 17.9385H133.937C133.906 17.5649 133.755 17.267 133.482 17.0448C133.21 16.8226 132.841 16.7115 132.376 16.7115C131.922 16.7115 131.574 16.7974 131.331 16.9691C131.089 17.1407 130.968 17.368 130.968 17.6507C130.968 17.8729 131.048 18.0597 131.21 18.2112C131.372 18.3627 131.568 18.4839 131.801 18.5747C132.033 18.6555 132.376 18.7616 132.831 18.8929C133.437 19.0544 133.932 19.2211 134.315 19.3927C134.709 19.5543 135.047 19.7967 135.33 20.1199C135.613 20.443 135.759 20.8722 135.77 21.4074C135.77 21.8821 135.638 22.3062 135.376 22.6799C135.113 23.0535 134.739 23.3464 134.255 23.5585C133.78 23.7705 133.22 23.8766 132.573 23.8766Z"
                        fill="#F2F2F7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <Image src={sun} className="" alt="sun" />
              </div>
            </div>
            <form onSubmit={handleSubmit} className="xl:p-12 p-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={form?.placeholder_1}
                className="border-b-2 border-gray-300 text-[#193048] bg-transparent placeholder-[#193048] rounded-b-none p-2 flex-1 font-normal xl:w-full mt-12 w-[90%]"
              />
              <div className="xl:flex-row gap-8 flex-col justify-center items-center">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={form?.placeholder_2}
                  className="border-b-2 border-gray-300 text-[#193048] bg-transparent placeholder-[#193048] rounded-b-none p-2 xl:w-full mt-14 xl:mb-16 font-normal mb-6 w-[90%]"
                />
                {/* <div className="flex gap-2 items-center justify-center">
                  <div className="flex items-center bg-transparent border-b-2 border-gray-300 text-[#193048] p-2 xl:mt-0 mb-16 mt-6 max-w-[100px]">
                    <select
                      value={formData.countryCode}
                      onChange={handleSelectChange}
                      className="bg-transparent outline-none text-[#193048] appearance-none"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.code} - {country.country}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="tel"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    placeholder={form?.placeholder_3 || "Contact Number"}
                    title="Please enter a valid UAE contact number starting with +971"
                    maxLength={12}
                    className="border-b-2 border-gray-300 text-[#193048] bg-transparent placeholder-[#193048] rounded-b-none p-2 xl:mt-0 xl:w-full mb-16 font-normal mt-6 w-[75%]"
                    required
                  />
                </div> */}
               <div className="flex gap-2 items-center justify-center">
      {/* Dropdown for Country Code */}
      <div className="flex items-center bg-transparent border-b-2 border-gray-300 text-[#193048] p-2 xl:mt-0 mb-16 mt-6 max-w-[100px]">
        <select
          value={formData.countryCode}
          onChange={handleSelectChange}
          className="bg-transparent outline-none text-[#193048] appearance-none"
        >
          {countryCodes.map((country) => (
            <option key={country.code} value={country.code}>
              {country.code} - {country.country}
            </option>
          ))}
        </select>
      </div>

      {/* Input for Phone Number */}
      <input
        type="tel"
        name="number"
        value={formData.number}
        onChange={handleInputChanges}
        placeholder={`Enter a ${countryCodeMapping[formData.countryCode] || 10}-digit number`}
        title={`Please enter a valid ${formData.countryCode} contact number`}
        maxLength={countryCodeMapping[formData.countryCode] || 10}
        className="border-b-2 border-gray-300 text-[#193048] bg-transparent placeholder-[#193048] rounded-b-none p-2 xl:mt-0 xl:w-full mb-16 font-normal mt-6 w-[75%]"
        required
      />
    </div>
              </div>

              <h1 className="xl:text-start mb-4 text-[#193048] lg:text-base font-bold text-center">
              {form?.placeholder_4}
              </h1>

              <div className="xl:flex gap-6 mb-14 flex justify-center items-center">
                <div className="grid grid-cols-2 xl:flex gap-6">
                  <label className="flex items-center text-[#193048] lg:text-base font-bold">
                    <input
                      type="checkbox"
                      value="animalCare"
                      checked={formData.interests.includes("animalCare")}
                      onChange={handleInterestChange}
                      className="mr-2 w-4 h-4 accent-[#414141]"
                    />
                    {form?.placeholder_5}
                  </label>
                  <label className="flex items-center text-[#193048] lg:text-base font-bold">
                    <input
                      type="checkbox"
                      value="agriculture"
                      checked={formData.interests.includes("agriculture")}
                      onChange={handleInterestChange}
                      className="mr-2 w-4 h-4 accent-[#414141]"
                    />
                    {form?.placeholder_6}
                  </label>
                  <label className="flex items-center text-[#193048] lg:text-base font-bold">
                    <input
                      type="checkbox"
                      value="aqua"
                      checked={formData.interests.includes("aqua")}
                      onChange={handleInterestChange}
                      className="mr-2 w-4 h-4 accent-[#414141]"
                    />
                    {form?.placeholder_7}
                  </label>
                  <label className="flex items-center text-[#193048] lg:text-base font-bold">
                    <input
                      type="checkbox"
                      value="bulkSupply"
                      checked={formData.interests.includes("bulkSupply")}
                      onChange={handleInterestChange}
                      className="mr-2 w-4 h-4 accent-[#414141]"
                    />
                    {form?.placeholder_8}
                  </label>
                </div>
              </div>

              {/* <h1 className='text-start mb-2 text-[#939393] lg:text-sm font-bold'>
                Message
              </h1> */}

              {/* <textarea
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={form?.placeholder_9 || "What would you like to talk about ?"}
                className="border-b-2 border-gray-300 text-[#193048] bg-white bg-opacity-70 placeholder-[#193048] rounded-b-none p-2 flex-1 font-normal xl:w-full w-[90%]"
              /> */}

              <div>
      <textarea
        rows="4"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="What would you like to talk about?"
        className="border-b-2 border-gray-300 text-[#193048] bg-white bg-opacity-70 placeholder-[#193048] rounded-b-none p-2 flex-1 font-normal xl:w-full w-[90%]"
      />
      <div className="text-sm text-gray-500 mt-1 lg:ml-96  ">
        {charCount}/200
      </div>
    </div>

              {/* Button */}
              <div className="flex xl:justify-end mt-10 justify-center">
                <button className="flex justify-end mt-4 cursor-pointer" type="submit" disabled={isLoading}>
                  <div
                    className={`cursor-pointer w-[175px] h-[55px] rounded-sm absolute z-20 mr-[10px] flex justify-center items-center ${
                      isHovered ? "bg-[#E6CFB7]" : "bg-[#193048]"
                    }`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <h4
                      className={`cursor-pointer lg:text-lg z-10 font-medium font-poppinsSB ${
                        isHovered ? "text-[#193048]" : "text-[#E6CFB7]"
                      }`}
                    >
                     {isLoading ? "Submitting..." : translatedSeeProductsText || "Submit"}
                    </h4>
                  </div>
                  <div
                    className={`w-[175px] h-[60px] rounded-sm border-2 relative z-10 ml-8 mt-[6px] ${
                      isHovered ? "border-[#E6CFB7]" : "border-[#193048]"
                    }`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  ></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Form;
