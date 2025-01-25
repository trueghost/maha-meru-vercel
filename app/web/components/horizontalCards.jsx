'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import Logo from "../../../public/images/circular-logo.svg";

const HorizontalCards = () => {
  const containerRef = useRef(null);
  const horizontalScrollRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const horizontalScroll = horizontalScrollRef.current;

    const handleScroll = (e) => {
      const verticalScrollMax = container.scrollHeight - container.clientHeight;

      // If the user reaches the bottom of the vertical scroll
      if (container.scrollTop >= verticalScrollMax) {
        // Prevent further vertical scrolling
        e.preventDefault();

        // Enable horizontal scrolling by setting the scrollLeft value
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener('wheel', handleScroll, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full py-24 overflow-y-auto overflow-x-hidden flex justify-center items-center font-poppins"
    >
      <div className="relative w-full h-full">
        <div
          ref={horizontalScrollRef}
          className="flex overflow-x-auto m-10"
          style={{ width: '2300px' }} // Adjust width according to content
        >
          {/* Repeat the entire container 20 times horizontally */}
          {Array.from({ length: 20 }).map((_, repeatIndex) => (
            <div
              key={repeatIndex}
              className="flex-shrink-0 snap-start p-4 m-2 border border-gray-300 rounded-lg"
            >
              <Image
                src={Logo}
                className="w-16 h-16"
                alt="Circular Logo"
              />
              <div className="mt-2 text-center">Hello</div>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                // onClick={() => console.log('Visit button clicked')}
              >
                Visit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalCards;