'use client';

// import { useEffect, useState } from "react";
// import Loader from "./loader";
// import { Player } from "@lottiefiles/react-lottie-player"; // Import the correct component
// import loadingAnimation from "../public/images/loader.json"; // Import the loader animation

export default function ClientLoader({ children }) {
  // const [loading, setLoading] = useState(true);

  // // Simulate loading for demonstration
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false); // Simulate the end of loading after 2 seconds
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, []);

  return (
    // <>
    //   {loading ? (
    //     // <div className="min-h-screen flex items-center justify-center">
    //     //   <Player
    //     //     src={loadingAnimation}
    //     //     loop
    //     //     autoplay
    //     //     style={{ height: '200px', width: '200px' }}
    //     //   />
    //     // </div>
    //     <div className="min-h-screen flex items-center justify-center">
    //     <div className="text-center text-[#193048]"><Loader/></div>
    //     </div>        
    //   ) : (
        // Render children once loading is complete
        <>{children}</>
    //   )}
    // </>
  );
}
