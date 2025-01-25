import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import center from '../../../public/images/logoanimation/center.png';
import logo1 from '../../../public/images/logoanimation/logo1.png';
// import { useLanguage } from "../../context/languageContext"; // Import useLanguage

import big4 from '../../../public/images/logoanimation/bigdinning.png';
import big3 from '../../../public/images/logoanimation/bigfarm.png';
import big1 from '../../../public/images/logoanimation/bigmap.png';
import big2 from '../../../public/images/logoanimation/bigwater.png';
import big5 from '../../../public/images/logoanimation/image-big.png';


import Link from 'next/link';
import './AnimationTrial.css'; // Import the CSS file for animations

const AnimationTrial = ({ missionItems, translatedSeeProductsText }) => {
  // State for each trigger point
  const [triggerStates, setTriggerStates] = useState({
    trigger1: false,
    trigger2: false,
    trigger3: false,
    trigger4: false,
    trigger5: false,
    trigger6: false,
    trigger7: false,
    trigger8: false,
  });

  const [isExpanded, setIsExpanded] = useState(false);
  

  const triggerRefs = useRef([]);
  const bigImages = [big1, big2, big3, big4,big5];
  const contents =['‘Promoting sustainable cyclical farming practices’','‘Enhancing animal welfare and nutrition’  ','‘Farming as a life style’','‘Home food production - advancing agri tech innovation’',
    '‘Cultivating a healthy community connection’'

  ]
  

// Dynamically get the current image based on trigger states
const getCurrentImage = () => {
    if (!missionItems) return null;

    if (triggerStates.trigger6) return missionItems?.image5; // Adjust as per image key in missionItems
    if (triggerStates.trigger5) return missionItems?.image4;
    if (triggerStates.trigger4) return missionItems?.image3;
    if (triggerStates.trigger3) return missionItems?.image2;
    if (triggerStates.trigger2) return missionItems?.image1;
    return missionItems?.image1;
};

// Dynamically get the current content based on trigger states
const getCurrentContent = () => {
    if (!missionItems) return null;

    if (triggerStates.trigger6) return missionItems?.imageTitle5;
    if (triggerStates.trigger5) return missionItems?.imageTitle4;
    if (triggerStates.trigger4) return missionItems?.imageTitle3;
    if (triggerStates.trigger3) return missionItems?.imageTitle2;
    if (triggerStates.trigger2) return missionItems?.imageTitle1;
    return missionItems?.imageTitle1;
};

const getCurrentAnimation = () => {
  // console.log("Trigger States: ", triggerStates); // Log the trigger states to debug

  if (!triggerStates) return 'invisible'; // Default to invisible if no trigger state

  // Check each trigger individually
  if (triggerStates.trigger6) {
    // console.log("Trigger 6 is active");
    return 'animate-item-5 visible'; // Animation for trigger 6
  }
  if (triggerStates.trigger5) {
    // console.log("Trigger 5 is active");
    return 'animate-item-5 visible'; // Animation for trigger 5
  }
  if (triggerStates.trigger4) {
    // console.log("Trigger 4 is active");
    return 'animate-item-5 visible'; // Animation for trigger 4
  }
  if (triggerStates.trigger3) {
    // console.log("Trigger 3 is active");
    return 'animate-item-5 visible'; // Animation for trigger 3
  }
  if (triggerStates.trigger2) {
    // console.log("Trigger 2 is active");
    return 'animate-item-5'; // Animation for trigger 2
  }

  // Fallback if no triggers are active
  return 'animate-item invisible'; // Default animation if no other trigger matches
};

  // const getCurrentImage = () => {
  //   if (triggerStates.trigger6) return big4;
  //   if (triggerStates.trigger5) return big3;
  //   if (triggerStates.trigger4) return big5;
  //   if (triggerStates.trigger3) return big2;
  //   if (triggerStates.trigger2) return big1;
  //   return big1;
  // };

  // const getCurrentContent = () => {
  //   if(triggerStates.trigger6) return contents[4];
  //   if(triggerStates.trigger5) return contents[3];
  //   if(triggerStates.trigger4) return contents[2];
  //   if(triggerStates.trigger3) return contents[1];
  //   if(triggerStates.trigger2) return contents[0];
  //   return contents[0]
  // }

  const handleReadMore = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    };
    

    const observer = new IntersectionObserver((entries) => {
      setTriggerStates((prevStates) => {
        const newStates = { ...prevStates };
  
        entries.forEach((entry) => {
          const index = triggerRefs.current.indexOf(entry.target);
          if (index >= 0) {
            const triggerKey = `trigger${index + 1}`;
  
            if (entry.isIntersecting) {
              // Trigger when scrolling down
              newStates[triggerKey] = true;
            } else if (entry.boundingClientRect.top > 0) {
              // Trigger when scrolling up (reverse scroll)
              newStates[triggerKey] = false;
            }
          }
        });
  
        return newStates;
      });
    }, observerOptions);
  
    // Attach the observer to each trigger point
    triggerRefs.current.forEach((trigger) => {
      if (trigger) observer.observe(trigger);
    });
  
    // Clean up observer on component unmount
    return () => {
      triggerRefs.current.forEach((trigger) => {
        if (trigger) observer.unobserve(trigger);
      });
    };
  },[]);

  return (
    <div className='relative text-transparent' style={{ height: '6400px' }}>
      <div
        className='absolute top-[calc(0%)]'
        ref={(el) => (triggerRefs.current[0] = el)}
      >
        Trigger 1
      </div>
      <div
        className='absolute top-[calc(25%)]'
        ref={(el) => (triggerRefs.current[1] = el)}
      >
        Trigger 2
      </div>
      <div
        className='absolute top-[calc(37.5%)]'
        ref={(el) => (triggerRefs.current[2] = el)}
      >
        Trigger 3
      </div>
      <div
        className='absolute top-[calc(50%)]'
        ref={(el) => (triggerRefs.current[3] = el)}
      >
        Trigger 4
      </div>
      <div
        className='absolute top-[calc(62.5%)]'
        ref={(el) => (triggerRefs.current[4] = el)}
      >
        Trigger 5
      </div>
      <div
        className='absolute top-[calc(75%)]'
        ref={(el) => (triggerRefs.current[5] = el)}
      >
        Trigger 6
      </div>
      <div
        className='absolute top-[calc(87.5%)]'
        ref={(el) => (triggerRefs.current[6] = el)}
      >
        Trigger 7
      </div>
      <div
        className='absolute top-[calc(100%)]'
        ref={(el) => (triggerRefs.current[7] = el)}
      >
        Trigger 8
      </div>
      <section className='sticky top-0 h-screen w-screen flex items-center justify-center gap-[140px]'>
        <div className='relative flex items-center justify-center w-[400px] h-[400px] ml-[60px] scale-75'>
          <div
            className={`animate-items ${
              triggerStates.trigger2 ? 'visible' : ''
            } absolute top-[-10px] left-0`}
          >
            <Image src={logo1} alt='part of logo-one' className='' />
          </div>

          <div
            className={`animate-itemL  ${
              triggerStates.trigger3 ? 'visible' : ''
            } absolute top-[0px] left-[15px]`}
          >
            <Image src={logo1} alt='part of logo-two' className='rotate-90' />
          </div>

          <div
            className={`animate-itemR ${
              triggerStates.trigger4 ? 'visible' : ''
            } absolute top-[3px] left-0`}
          >
            <Image
              src={logo1}
              alt='part of logo-three'
              className='rotate-180'
            />
          </div>

          <div
            className={`animate-itemBR ${
              triggerStates.trigger5 ? 'visible' : ''
            } absolute top-[-21px] left-[-30px]`}
          >
            <Image
              src={logo1}
              alt='part of logo-four'
              className='rotate-[270deg]'
            />
          </div>
          <div
            className={`animate-item ${
              triggerStates.trigger6 ? 'visible' : ''
            } absolute top-[15px] left-[5px]`}
          >
            <Image src={center} alt='part of logo-four' className='' />
          </div>

          <div
            className={`animate-item ${
              triggerStates.trigger7 ? 'visible' : ''
            } absolute bottom-[-100px]`}
          >
            <h1 className='text-5xl text-[#193048] font-optima tracking-[10px]'>
              MAHAMERU 
            </h1>
          </div>
          <div
            className={`animate-itemD ${
              triggerStates.trigger7 ? 'visible' : ''
            } absolute bottom-[-150px]`}
          >
            <h1 className='text-5xl font-optima text-[#193048] tracking-[10px] '>
              INNOVATIONS
            </h1>
          </div>
        </div>
        <div className='flex items-start flex-col justify-center gap-6 ml-2 scale-90'>
        {triggerStates.trigger7 ? (
   <div className="flex flex-col items-center justify-center gap-10 max-w-[620px] animate-slideUp  ">  
   <h1 className="text-[#193048] text-5xl font-bold font-poppinsSB">
   {missionItems?.pioneerTitle}
   </h1>
   <p className="text-black font-poppins">
   {missionItems?.pioneerSubtitle}
   </p>

  

   <Link href="/about" passHref>
      
        <button
          className="text-black border border-black px-16 py-5 rounded-md hover:bg-[#193048] font-poppinsSB hover:text-[#E6CFB7] transition"
        >
         {translatedSeeProductsText || 'Read More'}
        </button>
      
    </Link>
 </div>
) : (
  <>
    <div className='flex items-center justify-center gap-1'>
      <div className={`flex animate-item ${triggerStates.trigger3 ? 'visible' : 'invisible'}`}>
        <Image src={missionItems?.smallImage1} width={92} height={120} alt="image1" />
      </div>
      <div className={`flex animate-item ${triggerStates.trigger4 ? 'visible' : 'invisible'}`}>
        <Image  src={missionItems?.smallImage2} width={92} height={120} alt='image2' />
      </div>
      <div className={`flex animate-item ${triggerStates.trigger5 ? 'visible' : 'invisible'}`}>
        <Image src={missionItems?.smallImage3} width={92} height={120} alt='image3' />
      </div>
      <div className={`flex animate-item  ${triggerStates.trigger6 ? 'visible' : 'invisible'}`}>
        <Image src={missionItems?.smallImage4} width={92} height={120} alt='image4' />?
      </div>
    </div>
    <div className='flex items-center justify-start gap-10 w-full '>
      <div className={`${getCurrentAnimation()}`}>
        <Image
          src={getCurrentImage()}
          alt='A big image'
          width={380}
          height={440}
          className='w-[380px] h-[440px]'
        />
      </div>
      <div className={`${getCurrentAnimation()}`}>
        <h1 className='font-bold text-3xl max-w-[200px] font-poppinsM text-[#193048]'>
          {getCurrentContent()}
        </h1>
      </div>
    </div>
  </>
)}
        </div>
        
      </section>
      {/* <div className='sticky top-0 h-screen'>
        <div
          className={`animate-item ${triggerStates.trigger1 ? 'visible' : ''}`}
        >
          Trigger 1 Div
        </div>
        <div
          className={`animate-item ${triggerStates.trigger2 ? 'visible' : ''}`}
        >
          Trigger 2 Div
        </div>
        <div
          className={`animate-item ${triggerStates.trigger3 ? 'visible' : ''}`}
        >
          Trigger 3 Div
        </div>
        <div
          className={`animate-item ${triggerStates.trigger4 ? 'visible' : ''}`}
        >
          Trigger 4 Div
        </div>
        <div
          className={`animate-item ${triggerStates.trigger5 ? 'visible' : ''}`}
        >
          Trigger 5 Div
        </div>
      </div> */}
    </div>
  );
};

export default AnimationTrial;
