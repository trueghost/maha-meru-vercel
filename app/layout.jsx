// layout.jsx
import Script from "next/script";
import ClientLoader from "./clientLoader";
import { LanguageProvider } from "./context/languageContext"; // Import LanguageProvider
import "./styles/globals.css";

export const metadata = {
  title: "Mahameru Innovations | M - POWER NATURE, BLOSSOM LIFE",
  description: "Our vision is to make organic and nutritious food the new standard in all our homes. We innovate to enrich the experience of life and empower the individual to grow consciously using natural solutions. We aim to create a thriving community that nurtures the Soil & Soul for the next generation.",
  keywords:"Animal | Agriculture | Aqua | Aquatic | Fallow Land Rejuvenation | Organic Compost Anti-Caking | Zero Tillage Farming | Tress Support | Organic Farming Conversion | Pest & Sun Control | For All Pests | Borer Shield | Sun Screen For Plants | Soil Borne Pests | Protected Agriculture | Aquaponics | Hydrogen Solutions | Urban Farming | Indoor Ag Tech Solutions | Inland Fishery Supports | Inland Water Bodies Support | Climate Controlled System | Water Treatment | Animal Bedding Care | Ammonia & Odour Capture | Fly & Red Mites Control | Bedding Life Extension | Sustainable Agriculture | Newborn Calf Support | Gulf Health",

  OpenGraph : {
    url :"https://www.maha-meru.com",
    type:"website",
    title:"Mahameru Innovations | M - POWER NATURE, BLOSSOM LIFE",
    description:"Our vision is to make organic and nutritious food the new standard in all our homes. We innovate to enrich the experience of life and empower the individual to grow consciously using natural solutions. We aim to create a thriving community that nurtures the Soil & Soul for the next generation.",
    image:"https://www.maha-meru.com/bannn.jpg",
    article : "true",
  },

  twitter : {
    card : "summart_large_image",
    domain : "maha-meru.com",
    url :"https://www.maha-meru.com",
    title:"Mahameru Innovations | M - POWER NATURE, BLOSSOM LIFE",
    description:"Our vision is to make organic and nutritious food the new standard in all our homes. We innovate to enrich the experience of life and empower the individual to grow consciously using natural solutions. We aim to create a thriving community that nurtures the Soil & Soul for the next generation.",
    image:"https://www.maha-meru.com/bannn.jpg",

  }
};

export default function RootLayout({ children }) {

  // Define the JSON-LD schema
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mahameru Innovations",
    "url": "https://www.maha-meru.com",
    "logo": "https://www.maha-meru.com/favicon.ico",
    "description": "Our vision is to make organic and nutritious food the new standard in all our homes. We innovate to enrich the experience of life and empower the individual to grow consciously using natural solutions. We aim to create a thriving community that nurtures the Soil & Soul for the next generation."
  };

  return (
    <html lang="en">
      <head>
        <Script
          id="json-ld-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdData),
          }}
        />
      </head>
      <body>
        <LanguageProvider> {/* Wrap with LanguageProvider */}
          <ClientLoader>{children}</ClientLoader>
        </LanguageProvider>
      </body>
    </html>
  );
}
