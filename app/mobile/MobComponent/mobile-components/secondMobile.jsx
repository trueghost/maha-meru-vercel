import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import image5 from '../../../../public/images/logoanimation/bigdinning.png';
import image4 from '../../../../public/images/logoanimation/bigfarm.png';
import image1 from '../../../../public/images/logoanimation/bigmap.png';
import image2 from '../../../../public/images/logoanimation/bigwater.png';
import { default as image3, default as image7 } from '../../../../public/images/logoanimation/image-big.png';
import image6 from '../../../../public/images/logoanimation/mahameru.png';

// Import new rounded images for triggers 2, 3, and 4
import {
  default as roundedImage2,
  default as roundedImage3,
  default as roundedImage4,
  default as roundedImage5,
} from '../../../../public/images/logoanimation/img1.png'; // Update with the correct path

const SecondMobile = () => {
  const [activeTrigger, setActiveTrigger] = useState(null);
  const triggerRefs = useRef([]);
  

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Animation will only happen once
    });

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = triggerRefs.current.indexOf(entry.target);
          setActiveTrigger(index);
          AOS.refresh(); // Refresh AOS to trigger animations
        }
      });
    }, observerOptions);

    triggerRefs.current.forEach((trigger) => {
      if (trigger) observer.observe(trigger);
    });

    return () => {
      triggerRefs.current.forEach((trigger) => {
        if (trigger) observer.unobserve(trigger);
      });
    };
  }, []);

  const contentData = [
    { text: 'Promoting sustainable cyclical farming practices', image: image1 },
    { text: 'Enhancing animal welfare and nutrition', image: image2 },
    { text: 'Farming as a lifestyle', image: image3 },
    { text: 'Home food production - advancing agri tech innovation', image: image4 },
    { text: 'Cultivating a healthy community connection', image: image5 },
    { text: 'Supporting biodiversity in agriculture', image: image6 },
    { text: 'Innovation in organic farming methods', image: image7 },
  ];

  const roundedImages = [roundedImage2, roundedImage3, roundedImage4, roundedImage5];

  return (
    <div className="relative text-transparent font-poppins" style={{ height: '4000px' }}>
      {Array(7)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`absolute top-[${5 * (i + 1)}%]`}
            ref={(el) => (triggerRefs.current[i] = el)}
            style={{ visibility: activeTrigger === i ? 'visible' : 'hidden' }}
          >
            Trigger {i + 1}
          </div>
        ))}

      <section className="sticky top-0 h-screen w-screen flex flex-col items-center justify-center bg-mobBanner">
        {activeTrigger !== null && (
          <div className="relative flex flex-col items-center justify-center max-w-[400px] mt-20">
            {activeTrigger !== 5 && (
              <div className="flex justify-start w-full mb-3 ml-14">
                {activeTrigger >= 1 && (
                  <div
                    style={{
                      borderRadius: '50%',
                      overflow: 'hidden',
                      width: '50px',
                      height: '50px',
                      margin: '0 10px',
                    }}
                    className="mb-4"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    <Image
                      src={roundedImages[0]}
                      alt="Rounded Image 2"
                      width={50}
                      height={50}
                      className="object-cover"
                    />
                  </div>
                )}
                {activeTrigger >= 2 && (
                  <div
                    style={{
                      borderRadius: '50%',
                      overflow: 'hidden',
                      width: '50px',
                      height: '50px',
                      margin: '0 10px',
                    }}
                    className="mb-4"
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    <Image
                      src={roundedImages[1]}
                      alt="Rounded Image 3"
                      width={50}
                      height={50}
                      className="object-cover"
                    />
                  </div>
                )}
                {activeTrigger >= 3 && (
                  <div
                    style={{
                      borderRadius: '50%',
                      overflow: 'hidden',
                      width: '50px',
                      height: '50px',
                      margin: '0 10px',
                    }}
                    className="mb-4"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <Image
                      src={roundedImages[2]}
                      alt="Rounded Image 4"
                      width={50}
                      height={50}
                      className="object-cover"
                    />
                  </div>
                )}
                {activeTrigger >= 4 && (
                  <div
                    style={{
                      borderRadius: '50%',
                      overflow: 'hidden',
                      width: '50px',
                      height: '50px',
                      margin: '0 10px',
                    }}
                    className="mb-4"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <Image
                      src={roundedImages[3]}
                      alt="Rounded Image 4"
                      width={50}
                      height={50}
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            )}

            <div
              data-aos="fade-up"
              data-aos-offset="400"
              className="flex flex-col items-center"
            >
              {activeTrigger !== 5 ? (
                <Image
                  src={contentData[activeTrigger].image}
                  alt={`Image for Trigger ${activeTrigger + 1}`}
                  width={300}
                  height={150}
                  className="mt-4"
                  data-aos="fade-up"
                />
              ) : (
                <div data-aos="fade-up" data-aos-delay="300" className="w-full text-center mt-4">
                  {/* Animation for last trigger */}
                  <div data-aos="fade-up" data-aos-delay="0">
                    <Image
                      src={contentData[5].image}
                      alt="Logo for Trigger 6"
                      width={200}
                      height={100}
                      className="object-cover mb-5"
                    />
                  </div>
                  <div data-aos="fade-up" data-aos-delay="500" className="text-3xl font-bold">
                    {contentData[6].text}
                  </div>
                  <div data-aos="fade-up" data-aos-delay="800" className="mt-4">
                    <Image
                      src={contentData[5].image}
                      alt="Banner for Trigger 6"
                      width={400}
                      height={200}
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {activeTrigger !== 5 && (
                <div
                  data-aos="fade-up"
                  data-aos-delay="500"
                  style={{ color: '#193048' }}
                  className="mt-2 text-2xl text-center font-bold"
                >
                  {contentData[activeTrigger].text}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SecondMobile;
