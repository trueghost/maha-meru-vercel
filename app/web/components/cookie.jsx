import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLanguage } from "../../context/languageContext";

const CookieBanner = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility
  const [title, setTitle] = useState("");
  const [subtext, setSubtext] = useState("");

  const handleAccept = () => {
    // console.log("Cookies accepted");
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false); // Hide the banner
  };

  const handleDecline = () => {
    // console.log("Cookies declined");
    localStorage.setItem("cookiesAccepted", "false");
    setIsVisible(false); // Hide the banner
  };

  const handleOpenModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const translateText = async (text, targetLanguage) => {
    try {
      const response = await fetch(`/api/translate?text=${encodeURIComponent(text)}&targetLanguage=${targetLanguage}`);
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

  useEffect(() => {
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    if (cookiesAccepted) setIsVisible(false); // Check stored preference
  }, []);

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
          const translatedTitle = await translateText(pageEntry.title, language);
          const translatedSubtext = await translateText(pageEntry.subtext, language);
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

  if (!isVisible) return null; // If hidden, don't render the banner

  return (
    <>
      {/* Cookie Banner */}
      <motion.div
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "-100%", opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#193048] shadow-lg px-6 py-4 flex items-center justify-between text-sm lg:text-base"
        style={{ zIndex: 9999 }} // Ensure the entire banner has a high z-index
      >
        <p className="text-white">
          We use cookies to enhance your experience. By continuing, you agree to our{" "}
          <button
            className="text-[#E6CFB7] underline focus:outline-none"
            onClick={handleOpenModal} // Open the modal on click
          >
            Privacy Policy
          </button>.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={handleAccept}
            className="text-[#193048] border border-black px-5 py-3 rounded-md bg-[#E6CFB7] font-poppinsSB transition"
            style={{ zIndex: 10000 }} // Set a high z-index for the Accept button
          >
            Accept
          </button>
          <button
            onClick={handleDecline}
            className="text-[#E6CFB7] border border-[#E6CFB7] px-5 py-3 rounded-md font-poppinsSB hover:text-[#E6CFB7] transition"
            style={{ zIndex: 10000 }} // Set a high z-index for the Decline button
          >
            Decline
          </button>
        </div>
      </motion.div>

      {/* Privacy Policy Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={handleCloseModal} // Close modal when clicking outside content
        >
          <div
            className="bg-banner-main text-black w-4/5 max-w-md h-3/5 p-6 rounded-md shadow-lg overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal on content click
          >
            <h2 className="text-lg font-bold mb-4">{title || "Privacy Policy"}</h2>
            <p className="text-sm mb-4 whitespace-pre-wrap">
            { subtext }
            </p>
            <button
              className="mt-4 px-4 py-2 bg-[#193048] text-[#E6CFB7] rounded-md"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieBanner;
