import { useEffect, useState } from 'react';

const MobBanner = () => {
  const [bgPositionX, setBgPositionX] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);

  const handleScroll = (e) => {
    const scrollAmount = e.deltaY;

    if (scrollAmount > 0) {
      if (currentSection === 0) {
        setBgPositionX((prev) => prev - scrollAmount * 1); // Adjust the scroll speed factor as needed
        setCurrentSection(1);
      } else if (currentSection === 1) {
        setCurrentSection(2); // Switch to the next section
      }
    } else if (scrollAmount < 0) {
      if (currentSection === 2) {
        setCurrentSection(1);
      } else if (currentSection === 1) {
        setBgPositionX((prev) => prev - scrollAmount * 1); // Move back to the right when scrolling up
        setCurrentSection(0);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [currentSection]);

  const getBackgroundPosition = () => {
    switch (currentSection) {
      case 0:
        return '40% 0%';
      case 1:
        return '0% 33%';
      case 2:
        return '0% 66%';
      case 3:
        return '0% 100%';
      default:
        return '0% 0%';
    }
  };

  return (
    <section className='w-full pb-[1px] overflow-hidden relative font-poppins'>
      <div
        className='h-screen w-screen bg-mobBanner bg-cover bg-no-repeat transition-all duration-700'
        style={{ backgroundPosition: getBackgroundPosition(), backgroundSize: 'cover' }}
      >
        <div className='absolute inset-0 flex items-center justify-center'>
          
          {currentSection === 0 && (
            <div className="">
            <h1 className="text-[#193048] font-bold text-sm font-optimeB ">MAHAMERU
             INNOVATIONS</h1>
           
          </div>
            
          )}
          {currentSection === 1 && (
            <p
              className={`text-center text-[16px] font-bold max-w-[350px] mt-[-100px] transition-all duration-700 ease-in-out ${'text-[#193048]'}`}
            >
              Our vision is to make organic and nutritious food the new standard
              in all our homes, fostering ‘One Health’. We innovate to bring
              positive disruption to the fundamentals of the food cycle. Our aim
              is to make all aspects Natural, Sustainable and in Harmony with
              the native environment. This empowers the Soil & Soul.
            </p>
          )}
          {currentSection === 2 && (
            <p className='text-[#193048] text-center text-[16px] font-bold max-w-md mt-[-50px] transition-all duration-700 ease-in-out'>
              Additional contents
            </p>
          )}
          {currentSection === 3 && (
            <p className='text-[#193048] text-center text-[16px] font-bold max-w-md mt-[-50px] transition-all duration-700 ease-in-out'>
              Additional contents
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MobBanner;
