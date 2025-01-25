import { useEffect, useRef, useState } from 'react';

const SecondSection = () => {
  const [textC1, setTextC1] = useState('text-blue-950');
  const [textC2, setTextC2] = useState('text-blue-950');
  const [textC3, setTextC3] = useState('text-blue-950');
  const [textC4, setTextC4] = useState('text-blue-950');
  const [textC5, setTextC5] = useState('text-blue-950');

  const division1Ref = useRef(null);
  const division2Ref = useRef(null);
  const division3Ref = useRef(null);
  const division4Ref = useRef(null);
  const division5Ref = useRef(null);

  const onDivisionIntersect = (division) => {
    // console.log(`Action for ${division}`);
    if (division === 'Division1') {
      setTextC1('text-white');
    }
    if (division === 'Division2') {
      setTextC2('text-white');
    }
    if (division === 'Division3') {
      setTextC3('text-white');
    }
    if (division === 'Division4') {
      setTextC4('text-white');
    }
    if (division === 'Division5') {
      setTextC5('text-white');
    }
  };

  useEffect(() => {
    const createObserver = (ref, division) => {
      if (ref.current) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                // console.log(`${division} is entering!`);
                onDivisionIntersect(division);
              } else if (entry.boundingClientRect.top > 0) {
                // console.log(`${division} is exiting!`);
                // Reset the color when exiting upwards (scrolling up)
                if (division === 'Division1') setTextC1('text-blue-950');
                if (division === 'Division2') setTextC2('text-blue-950');
                if (division === 'Division3') setTextC3('text-blue-950');
                if (division === 'Division4') setTextC4('text-blue-950');
                if (division === 'Division5') setTextC5('text-blue-950');
              }
            });
          },
          { threshold: 0, rootMargin: '0px 0px -100% 0px' }
        );
        observer.observe(ref.current);

        return () => {
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        };
      }
    };

    // Create observers for each division
    const cleanup1 = createObserver(division1Ref, 'Division1');
    const cleanup2 = createObserver(division2Ref, 'Division2');
    const cleanup3 = createObserver(division3Ref, 'Division3');
    const cleanup4 = createObserver(division4Ref, 'Division4');
    const cleanup5 = createObserver(division5Ref, 'Division5');

    // Cleanup observers on unmount
    return () => {
      cleanup1?.();
      cleanup2?.();
      cleanup3?.();
      cleanup4?.();
      cleanup5?.();
    };
  }, []);

  return (
    <>
      <section
        className='w-screen relative second-section-background bg-no-repeat bg-cover font-poppins'
        style={{ height: '1980px' }}
      >
        <div className='sticky top-0 h-screen flex text-transparent'>
          <div className='absolute top-[calc(50%)] left-[calc(50%)] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none w-4/5 text-center'>
            <p id='first-p' className={`lg:text-xl xl:text-3xl transition-colors duration-500 ${textC1}`}>
              <span className='lg:text-3xl xl:text-5xl '>
                Our Vision{' '}
              </span>
              is to make organic and nutritious food the new
            </p>
            <p id='first-p' className={`lg:text-xl xl:text-3xl transition-colors duration-500 ${textC2}`}>
              and nutritious food the new standard in all our homes, fostering
              <span className='lg:text-4xl xl:text-4xl '>
                ‘One Health’.
              </span>
            </p>
            <p id='first-p' className={`lg:text-xl xl:text-3xl transition-colors duration-500 ${textC3}`}>
              We innovate bring positive disruption to the fundamentals of the
              food cycle. Our
            </p>
            <p id='first-p' className={`lg:text-xl xl:text-3xl transition-colors duration-500 ${textC4}`}>
              {' '}
              aim is to make all aspects Natural, Sustainable and in Harmony
              with
            </p>
            <p id='first-p' className={`lg:text-xl xl:text-3xl transition-colors duration-500 ${textC5}`}>
              the native environment.{' '}
              <span className='lg:text-3xl xl:text-5xl '>
                This empowers the Soil & Soul.
              </span>
            </p>
          </div>
        </div>
        {/* Placing the divisions absolutely and at equal distance from the top */}
        <div className='absolute left-0 top-0 h-full flex flex-col justify-between'>
          <div className='text-left pl-4 text-transparent'>.</div>
          <div ref={division1Ref} className='text-left pl-4 text-transparent'>
            .{' '}
          </div>
          <div ref={division2Ref} className='text-left pl-4 text-transparent'>
            .{' '}
          </div>
          <div ref={division3Ref} className='text-left pl-4 text-transparent'>
            .{' '}
          </div>
          <div ref={division4Ref} className='text-left pl-4 text-transparent'>
            .{' '}
          </div>
          <div ref={division5Ref} className='text-left pl-4 text-transparent'>
            .{' '}
          </div>
          <div className='text-left pl-4 text-transparent'>.</div>
          <div className='text-left pl-4 text-transparent'>.</div>
          <div className='text-left pl-4 text-transparent'>.</div>
        </div>
      </section>
    </>
  );
};

export default SecondSection;
