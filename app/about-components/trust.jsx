"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
// import Airbnb from "../../public/images/trust/airbnb.png";
// import Google from "../../public/images/trust/google.png";
// import Microsoft from "../../public/images/trust/microsoft.png";
// import Hubspot from "../../public/images/trust/Hubspot.png";
// import Fedex from "../../public/images/trust/Fedex.png";
// import Walmart from "../../public/images/trust/Walmart.png";

const Trust = ({ title8, trust }) => {

  return (
    <section className="flex flex-col items-center mb-40 font-poppins">
      {/* Heading */}
      <div className="text-center px-4 md:px-20 lg:px-40 mt-4">
        <h3 className="font-Poppins text-[#193048] font-semibold font-poppinsSB text-4xl text-center mt-16 mb-20"
        style={{
          fontFamily: "PoppinsSB",
          color: "#193048",
          fontSize: "1.875rem", // Equivalent to text-3xl in Tailwind
          fontWeight: "400", // Equivalent to font-semibold in Tailwind
        }}
        >
          {title8}
        </h3>
        <div className="companies grid grid-cols-5 gap-20">
        {trust?.filter((item) => item?.hide !== 1).map((item) => (
            <Image
              key={item?.id}
              src={item?.image}
              alt={item?.description}
              className="flex-1"
              height={100}
              width={100}
            />
          ))}
          {/* <Image
            id="Airbnb"
            src={DefaultImage}
            alt="Airbnb"
            className="flex-1"
            // height={50}
          />
          <Image
            id="Hubspot"
            src={DefaultImage}
            alt="Hubspot"
            className="flex-1"
            // height={50}
          />
          <Image
            id="Google"
            src={DefaultImage}
            alt="Google"
            className="flex-1"
            // height={50}
          />
          <Image
            id="Microsoft"
            src={DefaultImage}
            alt="Microsoft"
            className="flex-1"
            // height={50}
          />
          <Image
            id="Walmart"
            src={DefaultImage}
            alt="Walmart"
            className="flex-1"
            // height={50}
          />
          <Image
            id="Fedex"
            src={DefaultImage}
            alt="Fedex"
            className="flex-1"
            // height={50}
          />
          <Image
            id="Fedex"
            src={DefaultImage}
            alt="Fedex"
            className="flex-1"
            // height={50}
          />
          <Image
            id="Fedex"
            src={DefaultImage}
            alt="Fedex"
            className="flex-1"
            // height={50}
          />
          <Image
            id="Fedex"
            src={DefaultImage}
            alt="Fedex"
            className="flex-1"
            // height={50}
          />
          <Image
            id="Fedex"
            src={DefaultImage}
            alt="Fedex"
            className="flex-1"
            // height={50}
          /> */}
        </div>
      </div>
    </section>
  );
};

export default Trust;
