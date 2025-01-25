import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import cow from "../../public/images/footer/cows.webp";
import facebook from "../../public/images/footer/facebook.svg";
import instagram from "../../public/images/footer/instagram.svg";
import location from "../../public/images/footer/location.svg";
import mail from "../../public/images/footer/mail.svg";
import phone from "../../public/images/footer/phone.svg";
import twitter from "../../public/images/footer/twitter.svg";
import whatsapp from "../../public/images/footer/whatsapp.svg";
import { useLanguage } from "../context/languageContext";

const Footer = ({ footerItems }) => {
  
  const { language, changeLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [subtext, setSubtext] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAgree = () => {
    console.log("User agreed!");
    setIsModalOpen(false); // Close the modal
  };

  const handleDecline = () => {
    console.log("User declined!");
    setIsModalOpen(false); // Close the modal
  };

  const translateText = async (text, targetLanguage) => {
    try {
      const response = await fetch(
        `/api/translate?text=${encodeURIComponent(
          text
        )}&targetLanguage=${targetLanguage}`
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

  // useEffect(() => {
  //   const fetchFooterItems = async () => {
  //     try {
  //       const response = await fetch("/api/footer-admin");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch footer items");
  //       }
  //       const data = await response.json();
  //       const footerData = data.data[0]; // Assuming the first object from the array

  //       // Initialize translated footer data
  //       let translatedFooterData = { ...footerData };

  //       // Check if the language is 'ar' or 'hi'
  //       if (language === "ar" || language === "hi") {
  //         // Translate dynamic footer data
  //         translatedFooterData = {
  //           ...footerData,
  //           title: await translateText(footerData.title, language),
  //           description: await translateText(footerData.description, language),
  //         };

  //         // Translate static text
  //         const translatedStaticText = {
  //           exploreTitle: await translateText("Explore", language),
  //           exploreTitles: await translateText("Contact", language),
  //           home: await translateText("Home", language),
  //           about: await translateText("About", language),
  //           connect: await translateText("Connect", language),
  //           agriculture: await translateText("Agriculture", language),
  //           animal: await translateText("Animal", language),
  //           aquatic: await translateText("Aquatic", language),
  //           products: await translateText("Our Products", language),
  //           place: await translateText("UAE | India", language),

  //           privacyPolicy: await translateText("Privacy Policy", language),
  //           copyrightText: await translateText(
  //             "Maha-Meru Innovations © All rights reserved Copyrights",
  //             language
  //           ),

  //           imageTitle: await translateText(
  //             "M - Power Nature, Blossom Life",
  //             language
  //           ),
  //         };

  //         // Combine dynamic and static translations
  //         setFooterItems({
  //           ...translatedFooterData,
  //           staticText: translatedStaticText,
  //         });
  //       } else {
  //         // Set untranslated footer and static text
  //         setFooterItems({
  //           ...footerData,
  //           staticText: {
  //             exploreTitle: "Explore",
  //             home: "Home",
  //             about: "About",
  //             connect: "Connect",
  //             agriculture: "Agriculture",
  //             animal: "Animal",
  //             aquatic: "Aquatic",
  //             products: "Our Products",
  //             place: "UAE | India",
  //           },
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error fetching footer items:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchFooterItems();
  // }, [language]);

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const titleResponse = await fetch("/api/title-subtext");
        if (!titleResponse.ok) {
          throw new Error("Failed to fetch title and subtext");
        }
        const titleData = await titleResponse.json();
        const pageEntry = titleData.entries.find(
          (entry) => entry.page_name === "Privacy Policy Page"
        );
        if (pageEntry) {
          setTitle(pageEntry.title);
          setSubtext(pageEntry.subtext);
          // Translate the title
          const translatedTitle = await translateText(
            pageEntry.title,
            language
          );
          const translatedSubtext = await translateText(
            pageEntry.subtext,
            language
          );
          setTitle(translatedTitle);
          setSubtext(translatedSubtext);
        }
      } catch (error) {
        console.error("Error fetching title:", error);
      }
    };

    const fetchData = async () => {
      await fetchTitle();
    };

    fetchData();
  }, [language]);

  return (
    <section className="bg-[#193048] w-screen px-5 py-10 md:p-24 flex flex-col items-center justify-center gap-16 relative font-poppins">
      <div className="w-full max-w-screen-2xl">
        <div className="flex flex-col md:flex-row lg:items-start lg:justify-between item-center justify-center gap-10 md:gap-32">
          {/* Logo and Social Icons */}
          <div className="flex flex-col items-center md:items-start justify-center text-center pl-0 lg:pl-16 md:text-left">
            {footerItems?.image ? (
              <Image
                src={footerItems.image} // Dynamically load the logo from the backend
                alt="footer-logo-image"
                className=""
                priority // Ensure this image is loaded as a priority (since it's part of the footer)
                layout="intrinsic" // Use intrinsic layout to maintain the natural aspect ratio
                width={220} // Adjust to your desired width
                height={220} // Adjust to your desired height
                sizes="(max-width: 640px) 80vw, (max-width: 768px) 50vw, 220px" // Specify sizes based on viewport width
              />
            ) : (
              <div className="w-[150px] h-[150px] bg-gray-500"></div> // Placeholder if logo_url is not available
            )}
            <p className="text-sm mt-2 text-white font-normal">
              {/* Translated Image Title */}
              {footerItems?.staticText?.imageTitle}
            </p>
            <div className="flex gap-6 mt-4 items-center justify-center">
              {footerItems?.facebook_link && (
                <Link href={footerItems.facebook_link}>
                  <Image
                    src={facebook}
                    alt="image of facebook"
                    width={32}
                    height={32}
                    className="cursor-pointer w-8 h-8"
                  />
                </Link>
              )}
              {footerItems?.whatsapp_link && (
                <Link href={footerItems.whatsapp_link}>
                  <Image
                    src={whatsapp}
                    alt="image of whatsapp"
                    width={32}
                    height={32}
                    className="cursor-pointer w-9 h-9"
                  />
                </Link>
              )}
              {footerItems?.twitter_link && (
                <Link href={footerItems.twitter_link}>
                  <Image
                    src={twitter}
                    alt="image of twitter"
                    width={32}
                    height={32}
                    className="cursor-pointer w-8 h-8"
                  />
                </Link>
              )}
              {footerItems?.insta_link && (
                <Link href={footerItems.insta_link}>
                  <Image
                    src={instagram}
                    alt="image of instagram"
                    width={32}
                    height={32}
                    className="cursor-pointer w-8 h-8"
                  />
                </Link>
              )}
            </div>
          </div>

          {/* Explore Section */}
          <div className="flex items-start justify-center  gap-40">
            <div className="xl:flex flex-col items-center md:items-start hidden">
              <ul className="text-xl text-white">
                {footerItems?.staticText?.exploreTitle}
                <li className="text-[14px] mt-5 text-white cursor-pointer">
                  <Link href="/">
                    <span className="font-bold mr-2">&gt;</span>
                    {footerItems?.staticText?.home}
                  </Link>
                </li>
                <li className="text-[14px] mt-2 text-white cursor-pointer">
                  <Link href="/about">
                    <span className="font-bold mr-2">&gt;</span>
                    {footerItems?.staticText?.about}
                  </Link>
                </li>
                <li className="text-[14px] mt-2 text-white cursor-pointer">
                  <Link href="/connect">
                    <span className="font-bold mr-2">&gt;</span>
                    {footerItems?.staticText?.connect}
                  </Link>
                </li>
                <li className="text-[14px] mt-2 text-white cursor-pointer">
                  <Link href="/agriculture">
                    <span className="font-bold mr-2">&gt;</span>
                    {footerItems?.staticText?.agriculture}
                  </Link>
                </li>
                <li className="text-[14px] mt-2 text-white cursor-pointer">
                  <Link href="/animal">
                    <span className="font-bold mr-2">&gt;</span>
                    {footerItems?.staticText?.animal}
                  </Link>
                </li>
                <li className="text-[14px] mt-2 text-white cursor-pointer">
                  <Link href="/aquatic">
                    <span className="font-bold mr-2">&gt;</span>
                    {footerItems?.staticText?.aquatic}
                  </Link>
                </li>
                <li className="text-[14px] mt-2 text-white cursor-pointer">
                  <Link href="/products">
                    <span className="font-bold mr-2">&gt;</span>
                    {footerItems?.staticText?.products}
                  </Link>
                </li>
              </ul>
            </div>

            {/* News Section */}
            {/* <div className="xl:flex flex-col items-center md:items-start hidden">
              <p className="text-xl text-white">Our Trending Applications</p>
              <div className="flex mt-5">
                <Image src={img1} alt="image" className="w-[60px] h-[60px]" />
                <div className="flex flex-col gap-2 ml-2">
                  <p className="text-[14px] text-white">May 26, 2023</p>
                  <p className="text-[14px] text-white max-w-[500px]">
                    Explore the latest trends in smart farming
                  </p>
                </div>
              </div>
  
              <div className="flex mt-3">
                <Image src={img2} alt="image" className="w-[60px] h-[60px]" />
                <div className="flex flex-col gap-2 ml-2">
                  <p className="text-[14px] text-white">May 26, 2023</p>
                  <p className="text-[14px] text-white">
                    Explore the latest trends in smart farming
                  </p>
                </div>
              </div>
            </div> */}

            {/* Contact Section */}
            <div className="xl:flex flex-col items-center md:items-start hidden">
              <ul className="text-xl text-white">
                {footerItems?.staticText?.contact}
                {/* <li className="font-bold">{footerItems?.contact_title || "Contact"}</li> */}
                {footerItems?.number && (
  <li className="text-[14px] mt-5 flex gap-1 items-center cursor-pointer text-white">
    <Image
      src={mail}
      className="w-[24px] h-[24px]"
      alt="phone"
    />
    <a
      href={`tel:${footerItems.number.split(/[\s,]+/)[0]}`} // Redirect to only the first phone number
      className="hover:underline"
    >
      {footerItems.number} {/* Display both numbers */}
    </a>
  </li>
)}



                {footerItems?.mail && (
                  <li className="text-[14px] mt-4 flex gap-1 items-center cursor-pointer text-white">
                    <Image
                      src={phone}
                      className="w-[24px] h-[24px]"
                      alt="mail"
                    />
                    <a
                      href={`mailto:${footerItems.mail}`}
                      className="hover:underline"
                    >
                      {footerItems.mail}
                    </a>
                  </li>
                )}
               {footerItems?.location && (
  <li className="text-[14px] mt-4 flex gap-1 items-center cursor-pointer text-white">
    <Image
      src={location}
      className="w-[24px] h-[24px]"
      alt="location"
    />
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        footerItems?.location || "UAE | India" // Use footerItems.location for the link or default to "UAE | India"
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline"
    >
      {footerItems?.staticText?.location} {/* Display location */}
    </a>
  </li>
)}

              </ul>
            </div>

            {/* Language Dropdown */}
            {/* <div className="flex flex-col items-center md:items-start text-white mt-6 md:mt-0">
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-[#193048] text-white border-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="ar">Arabic</option>
                <option value="hi">Hindi</option>
              </select>
            </div> */}

            <div
              className="flex gap-6 pt-3 items-start lg:items-center justify-center xl:hidden sm:ml-40 sm:px-6"
              style={{
                marginLeft: "40px",
                paddingLeft: "16px",
                paddingRight: "16px",
              }} // inline styles for small screen
            >
              {/* Explore Section */}
              <div className="flex flex-col items-center md:items-start">
                <ul className="text-xl text-white">
                  {footerItems?.staticText?.exploreTitle}
                  <li className="text-[14px] mt-5 text-white cursor-pointer">
                    <Link href="/about">
                      <span className="font-bold mr-2">&gt;</span>
                      {footerItems?.staticText?.aquatic}
                    </Link>
                  </li>
                  <li className="text-[14px] mt-2 text-white cursor-pointer">
                    <Link href="/connect">
                      <span className="font-bold mr-2">&gt;</span>
                      {footerItems?.staticText?.aquatic}
                    </Link>
                  </li>
                  <li className="text-[14px] mt-2 text-white cursor-pointer">
                    <Link href="/agriculture">
                      <span className="font-bold mr-2">&gt;</span>
                      {footerItems?.staticText?.aquatic}
                    </Link>
                  </li>
                  <li className="text-[14px] mt-2 text-white cursor-pointer">
                    <Link href="/animal">
                      <span className="font-bold mr-2">&gt;</span>
                      {footerItems?.staticText?.aquatic}
                    </Link>
                  </li>
                  <li className="text-[14px] mt-2 text-white cursor-pointer">
                    <Link href="/aquatic">
                      <span className="font-bold mr-2">&gt;</span>
                      {footerItems?.staticText?.aquatic}
                    </Link>
                  </li>
                  <li className="text-[14px] mt-2 text-white cursor-pointer">
                    <Link href="/products">
                      <span className="font-bold mr-2">&gt;</span>
                      {footerItems?.staticText?.products}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Mobile Contact Section */}
              <div className="flex flex-col items-center md:items-start">
                <ul className="text-xl text-white">
                  {" "}
                  {footerItems?.staticText?.contact}
                  {/* <li className="font-bold">{footerItems?.contact_title || "Contact"}</li> */}
                  {footerItems?.mail && (
                    <li className="text-[14px] mt-5 flex gap-1 items-center cursor-pointer text-white">
                      <Image
                        src={phone}
                        className="w-[24px] h-[24px]"
                        alt="mail"
                      />
                      <a
                      href={`mailto:${footerItems.mail}`}
                      className="hover:underline"
                    >
                      {footerItems.mail}
                    </a>
                    </li>
                  )}
                 {footerItems?.number && (
  <li className="text-[14px] mt-4 flex gap-1 items-center cursor-pointer text-white">
    <Image
      src={mail}
      className="w-[24px] h-[24px]"
      alt="phone"
    />
    {/* Display all numbers, but make the first one clickable */}
    <a
      href={`tel:${footerItems?.number.split(/[\s,]+/)[0]}`} // Redirect to the first number
      className="hover:underline"
    >
      {footerItems?.number}
    </a>
  </li>
)}

{footerItems?.location && (
  <li className="text-[14px] mt-4 flex gap-1 items-center cursor-pointer text-white">
    <Image
      src={location}
      className="w-[24px] h-[24px]"
      alt="location"
    />
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        footerItems?.location.split(/[\s,]+/)[0] || "UAE | India" // Use the first place from the string
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline"
    >
      {footerItems?.staticText?.location}
    </a>
  </li>
)}

                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cow image positioned below the contact section */}
      <div className="absolute bottom-[10%] md:bottom-[21%] right-[5%] md:right-[40%] 2xl:right-[50%]  2xl:bottom-[21%] hidden xl:flex">
        <Image
          src={cow}
          alt="image of cows"
          className="w-[200px] md:w-[300px] h-auto"
        />
      </div>

      {/* Footer line */}
      <div className="border-t-2 border-[#FFFFFF] w-full max-w-screen-xl text-white mt-16 md:mt-5">
        <p className="xl:mt-6 text-sm text-center mt-2">
          {/* Translated Copyright Text */}
          {footerItems?.staticText?.copyrightText}
          {new Date().getFullYear()}.
          <button
            className="ml-0 text-[#E6CFB7] underline"
            onClick={handleOpenModal}
          >
            {/* Translated Privacy Policy */}
            {footerItems?.staticText?.privacyPolicy}
          </button>
        </p>

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={handleCloseModal}
          >
            {/* Modal Content */}
            <div
              className="bg-banner-main text-black w-4/5 max-w-md h-3/5 p-6 rounded-md shadow-lg overflow-y-auto"
              onClick={(e) => e.stopPropagation()} // Prevent closing modal on content click
            >
              <h2 className="text-lg font-bold mb-4">{footerItems?.staticText?.privacyPolicy}</h2>
              <p className="text-sm mb-4 whitespace-pre-wrap">{subtext}</p>

              {/* Buttons */}
              <div className="flex justify-end mt-6 gap-4">
                <button
                  className="text-[#E6CFB7] border border-black px-5  py-3 rounded-md bg-[#193048] font-poppinsSB transition"
                  onClick={handleDecline}
                >
                  Decline
                </button>
                <button
                  className="text-[#193048] border border-[#193048] px-5 py-3 rounded-md font-poppinsSB hover:text-[#193048] transition"
                  onClick={handleAgree}
                >
                  Agree
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Footer;
