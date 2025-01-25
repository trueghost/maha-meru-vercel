import { useEffect, useRef, useState } from 'react';

const SecondSection = () => {
  const [textColors, setTextColors] = useState([
    'text-blue-950', // Initial color for textC1
    'text-blue-950', // Initial color for textC2
    'text-blue-950', // Initial color for textC3
    'text-blue-950', // Initial color for textC4
    'text-blue-950', // Initial color for textC5
  ]);

  const divisionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const updateTextColors = (index) => {
    setTextColors((prevColors) => {
      return prevColors.map((color, i) =>
        i <= index ? 'text-white' : 'text-blue-950'
      );
    });
  };

  useEffect(() => {
    const observers = divisionRefs.map((ref, index) => {
      if (ref.current) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                // console.log(`Division ${index + 1} is entering!`);
                updateTextColors(index);
              }
            });
          },
          { threshold: 0.1, rootMargin: '0px 0px -50% 0px' }
        );
        observer.observe(ref.current);

        return () => {
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        };
      }
      return () => {};
    });

    // Cleanup all observers on component unmount
    return () => observers.forEach((cleanup) => cleanup());
  }, []);

  return (
    <>
      <section
        className='w-screen relative second-section-background bg-no-repeat bg-cover font-poppins'
        style={{ height: '1980px' }}
      >
        <div className='sticky top-0 h-screen flex text-transparent'>
          <div className='absolute top-[calc(50%)] left-[calc(50%)] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none w-4/5 text-center'>
            <p
              id='first-p'
              className={`lg:text-1p35rem xl:text-1p6rem transition-colors duration-500 ${textColors[0]}`}
            >
              <span className='lg:text-3xl xl:text-5xl'>Our Vision</span> is to
              make organic and nutritious food the new standard in all
            </p>
            <p
              id='first-p'
              className={`lg:text-1p35rem xl:text-1p6rem transition-colors duration-500 ${textColors[1]}`}
            >
              our homes. We
              <span className='lg:text-3xl xl:text-5xl'> Innovate </span>
              to enrich the experience of life and empower the
            </p>
            <p
              id='first-p'
              className={`lg:text-1p35rem xl:text-1p6rem transition-colors duration-500 ${textColors[2]}`}
            >
              individual to grow consciously using{' '}
              <span className='lg:text-3xl xl:text-5xl'>
                Natural solutions.
              </span>{' '}
              We aim to create a
            </p>
            <p
              id='first-p'
              className={`lg:text-1p35rem xl:text-1p6rem transition-colors duration-500 ${textColors[3]}`}
            >
              thriving community that nurtures the
              <span className='lg:text-3xl xl:text-5xl'> Soil & Soul </span>
              for the
              <span className='lg:text-3xl xl:text-5xl'> Next generation.</span>
            </p>
            {/* <p id="first-p" className={`lg:text-xl xl:text-3xl transition-colors duration-500 ${textColors[4]}`}>
              the native environment. <span className="lg:text-3xl xl:text-5xl">This empowers the Soil & Soul.</span>
            </p> */}
          </div>
        </div>
        {/* Placing the divisions absolutely and at equal distance from the top */}
        <div className='absolute left-0 top-0 h-full flex flex-col justify-between'>
          {divisionRefs.map((ref, index) => (
            <div
              key={index}
              ref={ref}
              className='text-left pl-4 text-transparent'
            >
              .
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default SecondSection;
