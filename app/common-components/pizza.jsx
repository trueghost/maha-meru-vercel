import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from "../context/languageContext";

const Pizza = ({ onHover }) => {
  const radius = 260; // increased radius of the outer circle
  const centerX = radius; // center of the circle
  const centerY = radius; // center of the circle
  const numTriangles = 8.5; // number of triangles
  const dotRadius = 4; // increased radius of the dot
  const innerRadius = radius * 0.6; // radius of the inner circle passing through the dots
  const { language } = useLanguage(); // Get the current language  

  // Function to calculate points on the circumference
  const calculatePointOnCircle = (angle, circleRadius) => {
    const x = centerX + circleRadius * Math.cos((angle * Math.PI) / 180);
    const y = centerY + circleRadius * Math.sin((angle * Math.PI) / 180);
    return { x, y };
  };

  const [hoveredTriangle, setHoveredTriangle] = useState(null);

  // Calculate points for each triangle and place dots in the center
  const triangles = [];
  const dots = [];
  const labels = [];

  const [labelNames, setLabelNames] = useState([
    '',
    '',
    '',
    'About',
    'Connect',
    'Animal',
    'Agriculture',
    'Aquatic',
    'Products',
  ]);  

  const routes = [
    '',
    '',
    '',
    '/about',
    '/connect',
    '/animal',
    '/agriculture',
    '/aquatic',
    '/products',
  ];

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

  const translateLabelNames = async (labels, targetLanguage) => {
    try {
      const translatedLabels = await Promise.all(
        labels.map(async label => {
          if (!label) return ''; // Skip empty labels
          return await translateText(label, targetLanguage);
        })
      );
      return translatedLabels;
    } catch (error) {
      console.error('Error translating label names:', error.message);
      return labels; // Fallback to original labels if translation fails
    }
  };
  
  useEffect(() => {
    const updateLabelNames = async () => {
      if (language !== 'ar' && language !== 'hi') {
        // If language is not 'ar' or 'hi', reset to the original labels
        setLabelNames([
          '',
          '',
          '',
          'About',
          'Connect',
          'Animal',
          'Agriculture',
          'Aquatic',
          'Products',
        ]);
        return;
      }
  
      const translated = await translateLabelNames(labelNames, language);
      setLabelNames(translated); // Update the state with the translated labels
    };
  
    updateLabelNames();
  }, [language]);  

  const validHoverIndices = [3, 4, 5, 6, 7, 8];

  for (let i = 0; i < numTriangles; i++) {
    const startAngle = (i * 360) / numTriangles; // Start angle
    const endAngle = ((i + 1) * 360) / numTriangles; // End angle

    const startPoint = calculatePointOnCircle(startAngle, radius);
    const endPoint = calculatePointOnCircle(endAngle, radius);

    // Generate the triangle path using SVG path commands
    const trianglePath = `M ${centerX},${centerY}
      L ${startPoint.x},${startPoint.y}
      A ${radius},${radius} 0 0,1 ${endPoint.x},${endPoint.y}
      Z`;

    // Calculate the center of the triangle
    const centerXTriangle = (centerX + startPoint.x + endPoint.x) / 3;
    const centerYTriangle = (centerY + startPoint.y + endPoint.y) / 3;

    let dotX = centerXTriangle;
    let dotY = centerYTriangle;

    if (i === 0) {
      dotX -= dotRadius - 0.1;
    } else if (i === 3) {
      dotX += dotRadius - 4;
      dotY += dotRadius - 15;
    } else if (i === 4) {
      dotX += dotRadius + 3;
      dotY += dotRadius - 10;
    } else if (i === 5) {
      dotY += dotRadius + 3;
    } else if (i === 7) {
      dotX -= dotRadius + 1;
    } else {
      dotY += dotRadius - 0.1;
      dotX -= dotRadius - 0.1;
    }

    // Skip adding dot and label for the second (index 1) and third (index 2) triangles
    if (i !== 0 && i !== 1 && i !== 2) {
      const dot = (
        <circle
          key={`dot-${i}`}
          cx={dotX}
          cy={dotY}
          r={dotRadius}
          fill={hoveredTriangle === i ? '#beb1a3' : '#193048'}
          onMouseEnter={() => {
            setHoveredTriangle(i);
            onHover(i);
          }}
          onMouseLeave={() => {
            setHoveredTriangle(null);
            onHover(null);
          }}
          style={{ cursor: 'pointer' }}
        />
      );

      // Create circle for the border
      const borderCircle = (
        <circle
          key={`border-${i}`}
          cx={dotX}
          cy={dotY}
          r={dotRadius + 2} // Custom radius for the border
          stroke={hoveredTriangle === i ? '#beb1a3' : '#193048'}
          strokeWidth='1'
          onMouseEnter={() => {
            setHoveredTriangle(i);
            onHover(i);
          }}
          onMouseLeave={() => {
            setHoveredTriangle(null);
            onHover(null);
          }}
          fill='transparent'
          style={{ cursor: 'pointer' }}
        />
      );

      // Wrap both circles in a group
      const dotGroup = (
        <g key={`dot-group-${i}`}>
          {borderCircle}
          {dot}
        </g>
      );

      dots.push(dotGroup);

      let labelX = centerXTriangle;
      let labelY = centerYTriangle;

      if (i === 0) {
        labelX += dotRadius + 30;
        labelY -= dotRadius - 9;
      } else if (i === 3) {
        labelX -= dotRadius + 40;
        labelY -= dotRadius + 0;
      } else if (i === 4) {
        labelX -= dotRadius + 40;
        labelY -= dotRadius - 4;
      } else if (i === 5) {
        labelX -= dotRadius + 45;
        labelY -= dotRadius - 5;
      } else if (i === 7) {
        labelX -= dotRadius - 40;
        labelY -= dotRadius - 0;
      } else if (i === 8) {
        labelX -= dotRadius - 55;
        labelY -= dotRadius - 12;
      } else {
        labelY -= dotRadius + 10;
      }

      if (routes[i]) {
      labels.push(
        <Link key={`link-triangle-${i}`} href={routes[i]} passHref>
        <text
          key={`label-${i}`}
          x={labelX}
          y={labelY}
          fill={hoveredTriangle === i ? '#beb1a3' : '#193048'}
          fontSize='14'
          textAnchor='middle'
          className='font-poppinsM font-semibold'
          onMouseEnter={() => {
            setHoveredTriangle(i);
            onHover(i);
          }}
          onMouseLeave={() => {
            setHoveredTriangle(null);
            onHover(null);
          }}
          style={{ cursor: 'pointer',
            transition: 'fill 0.3s ease'
           }}
        >
          {labelNames[i]}
        </text>
        </Link>
      );
    }

    triangles.push(
      <Link key={`link-label-${i}`} href={routes[i]} passHref>
      <path
        key={i}
        d={trianglePath}
        fill={hoveredTriangle === i ? '#193048' : 'transparent'}
        style={{
          cursor: validHoverIndices.includes(i) ? 'pointer' : 'default',
          transition: 'fill 0.3s ease', // Add transition
        }}
        onMouseEnter={() => {
          if (validHoverIndices.includes(i)) {
            setHoveredTriangle(i);
            onHover(i);
          }
        }}
        onMouseLeave={() => {
          setHoveredTriangle(null);
          onHover(null);
        }}
      />
      </Link>
    );
  }
}

  // Handle hover effect for the inner circle
  const handleInnerCircleHover = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
    const normalizedAngle = (angle + 360) % 360;
    const index = Math.floor((normalizedAngle * numTriangles) / 360);

    // Only set hovered triangle if it has a label and is within the specified range
    const validIndices = [3, 4, 5, 6, 7, 8];
    if (validIndices.includes(index) && labelNames[index] !== '') {
      setHoveredTriangle(index);
      onHover(index);
    }
  };

  return (
    <svg viewBox={`0 0 ${radius * 2} ${radius * 2}`} width='600' height='600'>
      <defs>
        <clipPath id='clip-bottom'>
          <rect x='0' y='0' width={radius * 2} height={centerY * 1.8} />
        </clipPath>
      </defs>
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        stroke='#FBF6F1'
        strokeWidth='1'
        fill='transparent'
        clipPath='url(#clip-bottom)'
      />
      {triangles}
      <circle
        cx={centerX}
        cy={centerY}
        r={innerRadius}
        stroke='#FBF6F1'
        strokeWidth='2'
        fill='transparent'
        clipPath='url(#clip-bottom)'
        // onMouseEnter={handleInnerCircleHover}
        // onMouseMove={handleInnerCircleHover}
        // onMouseLeave={() => {
        //   setHoveredTriangle(null);
        //   onHover(null);
        // }}
        // style={{ 
        //   cursor: hoveredTriangle !== null ? 'pointer' : 'default'
        // }}
      />
      {dots}
      {labels}
    </svg>
  );
};

export default Pizza;
