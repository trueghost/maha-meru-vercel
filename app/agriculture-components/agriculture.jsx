"use client";

import { useEffect, useState } from "react";

const Agriculture = ({ title2, subtext }) => {

  return (
    <section className="py-20 flex-col items-center justify-center lg:flex font-poppins">
      {/* Content only visible on screens 1024px and above */}
      <div className="text-center mx-auto hidden lg:block">
        <h1
          className="text-[#193048] text-4xl font-poppinsSB font-semibold uppercase"
          style={{
            fontFamily: "PoppinsSB",
            color: "#193048",
            fontSize: "1.875rem", // Equivalent to text-3xl in Tailwind
            fontWeight: "400", // Equivalent to font-semibold in Tailwind
          }}
        >
          {title2}
        </h1>
      </div>

      <div className="text-center px-40 lg:px-20 xl:px-40 mt-7 hidden lg:block">
        <p className="text-[#193048] text-xl font-poppins font-normal">
          {subtext}
        </p>
      </div>
    </section>
  );
};

export default Agriculture;
