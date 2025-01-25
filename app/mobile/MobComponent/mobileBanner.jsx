import { useEffect, useRef } from 'react';

const MobileBanner = () => {
  const baseSVGRef = useRef(null);

  useEffect(() => {
    // Any effect logic if needed
  }, []);

  return (
    <section className='relative h-screen overflow-hidden'>
      <div
        ref={baseSVGRef}
        className='bg-farm bg-cover bg-no-repeat bottom-0 w-screen h-full'
      ></div>
    </section>
  );
};

export default MobileBanner;
