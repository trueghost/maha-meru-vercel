import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import big4 from '../../../../public/images/logoanimation/bigdinning.png';
import big3 from '../../../../public/images/logoanimation/bigfarm.png';
import big1 from '../../../../public/images/logoanimation/bigmap.png';
import big2 from '../../../../public/images/logoanimation/bigwater.png';
import big5 from '../../../../public/images/logoanimation/image-big.png';
import one from '../../../../public/images/logoanimation/img1.png';
import two from '../../../../public/images/logoanimation/img2.png';
import three from '../../../../public/images/logoanimation/img3.png';
import four from '../../../../public/images/logoanimation/img4.png';
import mahameru from '../../../../public/images/logoanimation/mahameru.png';
import '../../../web/components/AnimationTrial.css';

const AnimationComp = () => {
  const [triggerStates, setTriggerStates] = useState({
    trigger1: false,
    trigger2: false,
    trigger3: false,
    trigger4: false,
    trigger5: false,
    trigger6: false,
    trigger7: false,
    trigger8: false,
    trigger9: false,
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const triggerRefs = useRef([]);
  const bigImages = [big1, big2, big3, big4, big5];
  const contents = [
    '‘Promoting sustainable cyclical farming practices’',
    '‘Enhancing animal welfare and nutrition’',
    '‘Farming as a lifestyle’',
    '‘Home food production - advancing agri tech innovation’',
    '‘Cultivating a healthy community connection’',
  ];

  const getCurrentImage = () => {
    if (triggerStates.trigger6) return big4;
    if (triggerStates.trigger5) return big3;
    if (triggerStates.trigger4) return big5;
    if (triggerStates.trigger3) return big2;
    if (triggerStates.trigger2) return big1;
    return big1;
  };

  const getCurrentContent = () => {
    if (triggerStates.trigger6) return contents[4];
    if (triggerStates.trigger5) return contents[3];
    if (triggerStates.trigger4) return contents[2];
    if (triggerStates.trigger3) return contents[1];
    if (triggerStates.trigger2) return contents[0];
    return contents[0];
  };

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
          if (entry.isIntersecting) {
            const index = triggerRefs.current.indexOf(entry.target);
            if (index >= 0) {
              const triggerKey = `trigger${index + 1}`;

              if (triggerKey === 'trigger1') {
                Object.keys(newStates).forEach((key) => {
                  newStates[key] = false;
                });
                return newStates;
              }

              newStates[triggerKey] = true;

              if (newStates.trigger9) {
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

    triggerRefs.current.forEach((trigger) => {
      if (trigger) observer.observe(trigger);
    });

    return () => {
      triggerRefs.current.forEach((trigger) => {
        if (trigger) observer.unobserve(trigger);
      });
    };
  }, []);


  return (
    <div className="relative" style={{ height: '3000px' }}>
      <div
        className="absolute top-[calc(10%)]"
        ref={(el) => (triggerRefs.current[1] = el)}
      >
      
      </div>
      <div
        className="absolute top-[calc(20%)]"
        ref={(el) => (triggerRefs.current[2] = el)}
      >
       
      </div>
      <div
        className="absolute top-[calc(30%)]"
        ref={(el) => (triggerRefs.current[3] = el)}
      >
      
      </div>
      <div
        className="absolute top-[calc(40%)]"
        ref={(el) => (triggerRefs.current[4] = el)}
      >
       
      </div>
      <div
        className="absolute top-[calc(50%)]"
        ref={(el) => (triggerRefs.current[5] = el)}
      >
        
      </div>
      <div
        className="absolute top-[calc(60%)]"
        ref={(el) => (triggerRefs.current[6] = el)} // Add Trigger 7 reference
      >
       
      </div>
      <div
        className="absolute top-[calc(70%)]"
        ref={(el) => (triggerRefs.current[7] = el)} // Add Trigger 7 reference
      >
        
      </div>
      <div
        className="absolute top-[calc(80%)]"
        ref={(el) => (triggerRefs.current[8] = el)} // Add Trigger 7 reference
      >
        
      </div>
      <div
        className="absolute top-[calc(90%)]"
        ref={(el) => (triggerRefs.current[9] = el)} // Add Trigger 7 reference
      >
        
      </div>

      {/* Right Section Only */}
      <section className="sticky top-0 h-screen bg-banner-main w-full flex flex-col items-center justify-center gap-[40px] font-poppins">
        <div className="flex items-start flex-col justify-center gap-6 scale-90">
        {triggerStates.trigger8 ? null : (
          triggerStates.trigger7 && (
            <div className={`animate-fade-in  ${triggerStates.trigger7 ? 'visible' : 'invisible'}`}>
              <Image src={mahameru} alt='image of mahameru logo' />
            </div>
          )
        )}
      {triggerStates.trigger8 ? (
      <div className='bg-no-repeat bg-bottom bg-contain w-screen flex items-center justify-center h-screen bg-mob-banner'>
           <div className=" flex flex-col items-center justify-center gap-10 max-w-[600px] ">
           <Image src={mahameru} alt="small" className="w-[100px] h-[100px]" />
         
           <h1 className={`flex animate-item ${triggerStates.trigger8 ? 'visible' : 'invisible'}text-[#193048] text-2xl font-poppinsSB text-center`}>
             Pioneering Agricultural Excellence
           </h1>
         
           <p className="text-black text-center text-md">
             Lorem ipsum dolor sit, amet consectetur adipisicing elit. Earum optio
             dolor, illum suscipit neque sequi fugiat distinctio ipsum commodi
             provident perspiciatis, libero qui, amet quaerat? Laudantium esse commodi
             saepe molestias.
           </p>
         
           <div className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
             <p className="text-black text-lg text-center">
               Additional content: This section provides deeper insights into the
               advancements in agricultural practices, sustainability efforts, and
               innovation driving the future of farming.
             </p>
           </div>
         
           <button
             className="text-black border border-black px-10 py-2 rounded-md hover:bg-[#193048] hover:text-white transition"
             onClick={handleReadMore}
           >
             {isExpanded ? 'Read Less' : 'Read More'}
           </button>
         </div>
      </div>
        
      ) : !triggerStates.trigger7 ? (
        <>
          <div className="flex items-center justify-center">
            <div
              className={`flex animate-item ${triggerStates.trigger3 ? 'visible' : 'invisible'}`}
            >
              <Image src={one} alt="image1" className="rounded-[100%] h-[100px] w-[100px]" />
            </div>
            <div
              className={`flex animate-item ${triggerStates.trigger4 ? 'visible' : 'invisible'}`}
            >
              <Image src={two} alt="image2" className="rounded-[150%] h-[100px] w-[100px]" />
            </div>
            <div
              className={`flex animate-item ${triggerStates.trigger5 ? 'visible' : 'invisible'}`}
            >
              <Image src={three} alt="image3" className="rounded-[100%] h-[100px] w-[100px]" />
            </div>
            <div
              className={`flex animate-item ${triggerStates.trigger6 ? 'visible' : 'invisible'}`}
            >
              <Image src={four} alt="image4" className="rounded-[100%] h-[100px] w-[100px]" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-10 w-full">
            <div
              className={`animate-item ${triggerStates.trigger2 ? 'visible' : 'invisible'}`}
            >
              <Image
                src={getCurrentImage()}
                alt="A big image"
                className="w-[320px] h-[350px]"
              />
            </div>
            <div
              className={`animate-item ${triggerStates.trigger2 ? 'visible' : 'invisible'}`}
            >
              <h1 className="font-bold text-xl max-w-[400px] font-poppinsM text-[#193048] text-center">
                {getCurrentContent()}
              </h1>
            </div>
          </div>
        </>
      ): null}
        </div>
      </section>
    </div>
  );
};

export default AnimationComp;
