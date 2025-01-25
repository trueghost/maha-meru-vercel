import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import mahameruLogo from '../../../../public/images/logoanimation/center.png'; // Import the Mahameru logo

import big4 from '../../../../public/images/logoanimation/bigdinning.png';
import big3 from '../../../../public/images/logoanimation/bigfarm.png';
import big1 from '../../../../public/images/logoanimation/bigmap.png';
import big2 from '../../../../public/images/logoanimation/bigwater.png';
import big5 from '../../../../public/images/logoanimation/image-big.png';

import one from '../../../../public/images/logoanimation/img1.png';
import two from '../../../../public/images/logoanimation/img2.png';
import three from '../../../../public/images/logoanimation/img3.png';
import four from '../../../../public/images/logoanimation/img4.png';
import '../../../web/components/AnimationTrial.css'; // Import the CSS file for animations

const TrialTwo = () => {
  const [triggerStates, setTriggerStates] = useState({
    trigger1: false,
    trigger2: false,
    trigger3: false,
    trigger4: false,
    trigger5: false,
    trigger6: false,
    trigger7: false,
    trigger8: false,
    trigger9: false, // New trigger for Mahameru logo
  });

  const triggerRefs = useRef([]);
  const bigImages = [big1, big2, big3, big4, big5];
  const contents = [
    '‘Promoting sustainable cyclical farming practices’',
    '‘Enhancing animal welfare and nutrition’',
    '‘Farming as a lifestyle’',
    '‘Home food production - advancing agri tech innovation’',
    '‘Cultivating a healthy community connection’'
  ];

  const smallImages = [one, two, three, four]; // Array for the smaller images

  const getCurrentImage = () => {
    if (triggerStates.trigger9) return mahameruLogo; // Show Mahameru logo
    if (triggerStates.trigger6) return big4;
    if (triggerStates.trigger5) return big3;
    if (triggerStates.trigger4) return big5;
    if (triggerStates.trigger3) return big2;
    if (triggerStates.trigger2) return big1;
    // Add logic for the smaller images based on the trigger states
    if (triggerStates.trigger1) return smallImages[0]; // Image for trigger1
    if (triggerStates.trigger2) return smallImages[1]; // Image for trigger2
    if (triggerStates.trigger3) return smallImages[2]; // Image for trigger3
    if (triggerStates.trigger4) return smallImages[3]; // Image for trigger4
    return smallImages[0]; // Default to first small image
  };

  const getCurrentContent = () => {
    if (triggerStates.trigger9) return ''; // No specific content for the Mahameru logo
    if (triggerStates.trigger6) return contents[4];
    if (triggerStates.trigger5) return contents[3];
    if (triggerStates.trigger4) return contents[2];
    if (triggerStates.trigger3) return contents[1];
    if (triggerStates.trigger2) return contents[0];
    return contents[0];
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
          if (entry.isIntersecting) {
            const index = triggerRefs.current.indexOf(entry.target);
            if (index >= 0) {
              const triggerKey = `trigger${index + 1}`;
              newStates[triggerKey] = true;

              // Reset all states if trigger1 is intersected
              if (triggerKey === 'trigger1') {
                Object.keys(newStates).forEach((key) => {
                  newStates[key] = false;
                });
              }
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
  }, []);

  return (
    <div className='relative text-transparent' style={{ height: '7500px' }}>
      {/* Trigger elements */}
      {[...Array(9)].map((_, index) => (
        <div
          key={index}
          className={`absolute top-[${(index + 1) * 10}%]`}
          ref={(el) => (triggerRefs.current[index] = el)}
        >
          Trigger {index + 1}
        </div>
      ))}

      {/* Sticky Section */}
      <section className='sticky top-0 h-screen flex items-center justify-center bg-white'>
        <div className='flex flex-col items-center justify-center gap-6'>
          <div className={`transition-opacity duration-500 ${triggerStates.trigger2 || triggerStates.trigger9 ? 'opacity-100' : 'opacity-0'}`}>
            <Image
              src={getCurrentImage()}
              alt='A big image'
              className='w-full h-auto max-w-[400px] md:max-w-[600px]' // Responsive image size
            />
          </div>
          <div className={`transition-opacity duration-500 ${triggerStates.trigger2 || triggerStates.trigger9 ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className='font-bold text-lg md:text-2xl text-[#193048] text-center'>
              {getCurrentContent()}
            </h1>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrialTwo;
