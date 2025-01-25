import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLanguage } from "../../../context/languageContext";

const MobileCookiePopup = () => {
  const { language } = useLanguage(); 
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subtext, setSubtext] = useState("");

  const handleAccept = () => {
    // console.log("Cookies accepted");
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false); // Hide the popup
  };

  const handleDecline = () => {
    // console.log("Cookies declined");
    localStorage.setItem("cookiesAccepted", "false");
    setIsVisible(false); // Hide the popup
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

  if (!isVisible) return null; // If hidden, don't render

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#193048] rounded-lg p-6 shadow-lg w-11/12 max-w-sm text-center"
        >
          <p className="text-white pb-4">
            We use cookies to enhance your experience. By continuing, you agree to our{" "}
            <button
              onClick={handleOpenModal}
              className="text-[#E6CFB7] underline focus:outline-none"
            >
              Privacy Policy
            </button>.
          </p>
          <div className="flex justify-center space-x-4 mt-5">
            <button
              onClick={handleAccept}
              className="text-[#193048] border border-black px-4 py-2 rounded-md bg-[#E6CFB7] font-poppinsSB transition"
            >
              Accept
            </button>
            <button
              onClick={handleDecline}
              className="text-[#E6CFB7] border border-[#E6CFB7] px-4 py-2 rounded-md font-poppinsSB hover:text-[#E6CFB7] transition"
            >
              Decline
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Privacy Policy Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={handleCloseModal} // Close modal when clicking outside content
        >
          <div
            className="bg-banner-main text-black w-11/12 max-w-sm p-6 rounded-md shadow-lg overflow-y-auto"
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

export default MobileCookiePopup;
