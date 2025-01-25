import Image from "next/image";
import Link from "next/link"; // Import Link component from Next.js
import { useEffect, useState } from "react";
import StickyLogo from "../../public/images/circular-logo.webp";
import { useLanguage } from "../context/languageContext";

const PizzaNavigator = ({ onHover }) => {
  const radius = 250; // increased radius of the outer circle
  const centerX = radius; // center of the circle
  const centerY = radius; // center of the circle
  const numTriangles = 14; // number of triangles
  const { language } = useLanguage(); // Get the current language    

  // Function to calculate points on the circumference
  const calculatePointOnCircle = (angle, circleRadius) => {
    const x = centerX + circleRadius * Math.cos((angle * Math.PI) / 180);
    const y = centerY + circleRadius * Math.sin((angle * Math.PI) / 180);
    return { x, y };
  };

  const [hoveredTriangle, setHoveredTriangle] = useState(null);

  // Calculate points for each triangle and place labels in the center
  const triangles = [];
  const labels = [];

  // Define the label names and the corresponding visible triangle indices
  const labelNames = [
    "Connect",      // Index 0
    "Agriculture",       // Index 1
    "Animal",  // Index 2
    "Aqua",         // Index 3
    "Our Products", // Index 4
    "About"         // Index 13
  ];
  
  const visibleTriangles = [0, 1, 2, 3, 4, 13]; // Updated triangle indices  

  for (let i = 0; i < numTriangles; i++) {
    // Skip triangles that are not visible
    if (!visibleTriangles.includes(i)) {
      continue;
    }
  
    const startAngle = (i * 360) / numTriangles; // Start angle
    const endAngle = ((i + 1) * 360) / numTriangles; // End angle
  
    const startPoint = calculatePointOnCircle(startAngle, radius);
    const endPoint = calculatePointOnCircle(endAngle, radius);
  
    const trianglePath = `M ${centerX},${centerY}
      L ${startPoint.x},${startPoint.y}
      A ${radius},${radius} 0 0,1 ${endPoint.x},${endPoint.y}
      Z`;
  
    const centerXTriangle = (centerX + startPoint.x + endPoint.x) / 3;
    const centerYTriangle = (centerY + startPoint.y + endPoint.y) / 3;
  
    let labelX = centerXTriangle;
    let labelY = centerYTriangle;
  
    // Adjust positions as needed for each triangle
    if (i === 0) {
      labelX += 10;
      labelY += 5;
    } else if(i === 4) {
      labelX -= 10;
      labelY += 25;
    } else if(i === 3) {
      labelX -= 0;
      labelY += 10;
    } else if(i === 13) {
      labelX -= 0;
      labelY += 10;}
  
    // Map triangle index to the corresponding label and path
    const initialLabelData = {
      0: { name: "Connect", path: "/connect" },
      1: { name: "Agriculture", path: "/agriculture" },
      2: { name: "Animal", path: "/animal" },
      3: { name: "Aqua", path: "/aquatic" },
      4: { name: "Products", path: "/products" },
      13: { name: "About", path: "/about" },
    };
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [labelData, setLabelData] = useState(initialLabelData);

    const translateText = async (text, targetLanguage) => {
      try {
        const response = await fetch(`/api/translate?text=${encodeURIComponent(text)}&targetLanguage=${targetLanguage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch translation');
        }
        const data = await response.json();
        return data.translatedText;
      } catch (error) {
        console.error('Error fetching translation:', error.message);
        return text; // Fallback to original text if translation fails
      }
    };  

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const updateLabelData = async () => {
        if (language !== "ar" && language !== "hi") {
          // Use default names for unsupported languages
          setLabelData(initialLabelData);
          return;
        }
    
        try {
          const translatedData = { ...initialLabelData };
    
          await Promise.all(
            Object.keys(translatedData).map(async key => {
              translatedData[key].name = await translateText(translatedData[key].name, language);
            })
          );
    
          setLabelData(translatedData);
        } catch (error) {
          console.error("Error translating label data:", error.message);
        }
      };
    
      updateLabelData();
    }, [language]);    
  
    const labelContent = (
      <text
        key={`label-${i}`}
        x={labelX}
        y={labelY}
        fill={hoveredTriangle === i ? "#beb1a3" : "#beb1a3"}
        fontSize="14"
        textAnchor="middle"
        className='font-poppins font-semibold'
        onMouseEnter={() => {
          setHoveredTriangle(i);
          onHover(i);
        }}
        onMouseLeave={() => {
          setHoveredTriangle(null);
          onHover(null);
        }}
        style={{ cursor: "pointer" }}
      >
        {labelData[i]?.name}
      </text>
    );
  
    let triangleContent = (
      <path
        key={i}
        d={trianglePath}
        fill={hoveredTriangle === i ? "#193048" : "transparent"}
        onMouseEnter={() => {
          setHoveredTriangle(i);
          onHover(i);
        }}
        onMouseLeave={() => {
          setHoveredTriangle(null);
          onHover(null);
        }}
        style={{ cursor: "pointer" }}
      />
    );
  
    // Add the route links accordingly
    if (labelData[i]) {
      triangles.push(
        <Link key={`link-${i}`} href={labelData[i].path}>
          {triangleContent}
        </Link>
      );
      labels.push(
        <Link key={`link-${i}-label`} href={labelData[i].path}>
          {labelContent}
        </Link>
      );
    } else {
      triangles.push(triangleContent);
      labels.push(labelContent);
    }
  }  

  return (
    <svg
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      width="600"
      height="600"
      style={{ position: "relative" }}
    >
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        stroke="#FBF6F1"
        strokeWidth="1"
        fill="transparent"
      />
      {triangles}
      {labels}

      {/* Add the StickyLogo image at the center */}
      <foreignObject
        x={centerX - 55} // Adjust x position to center the image
        y={centerY - 55} // Adjust y position to center the image
        width={110} // Adjust width
        height={110} // Adjust height
      >
        <Link href={"/"} passHref className="cursor-pointer">
        <Image
          src={StickyLogo}
          alt="Sticky Logo"
          layout="fixed"
          width={110}
          height={110}
        />
        </Link>
      </foreignObject>
    </svg>
  );
};

export default PizzaNavigator;
