"use client";
import Image from 'next/image';
import mobileImage from '../../../../public/mobile-images/mobileB.webp';
// import { useLanguage } from '../../../context/languageContext'; // Import useLanguage hook

function MobileSection({ title1, subtext1, title2, title8 }) {

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-banner-main overflow-x-hidden text-[#193048] font-poppins">
      <div className="text-center">
        <h1 className="text-3xl text-[#193048] font-optima tracking-[10px]">{title2}</h1>
        <h1 className="text-3xl font-optima text-[#193048] tracking-[10px]">{title8}</h1>
      </div>
      <div className="text-center p-4 mt-10 z-10">
        <h1 className="text-4xl font-bold mb-4 font-optimeB">
          {title1}
        </h1>
        <p className="text-lg">
          {subtext1}
        </p>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <Image
          src={mobileImage}
          alt="Mobile Banner"
          layout="responsive"
          priority
          objectFit="cover"
        />
      </div>
    </div>
  );
}

export default MobileSection;
