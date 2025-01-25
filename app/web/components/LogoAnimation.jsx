import Image from 'next/image';
import center from '../../../public/images/logoanimation/center.png';
import logo1 from '../../../public/images/logoanimation/logo1.png';

import big from '../../../public/images/logoanimation/image-big.png';
import one from '../../../public/images/logoanimation/img1.png';
import two from '../../../public/images/logoanimation/img2.png';
import three from '../../../public/images/logoanimation/img3.png';
import four from '../../../public/images/logoanimation/img4.png';

const LogoAnimation = () => {
  return (
    <section className='h-screen w-screen flex items-center justify-center gap-[140px]'>
      <div className='relative flex items-center justify-center w-[400px] h-[400px] ml-[60px] scale-75'>
        <div className='absolute top-[-10px] left-0'>
          <Image src={logo1} alt='part of logo-one' className='' />
        </div>

        <div className='absolute top-[0px] left-[15px] '>
          <Image src={logo1} alt='part of logo-two' className='rotate-90' />
        </div>

        <div className='absolute top-[3px] left-0'>
          <Image src={logo1} alt='part of logo-three' className='rotate-180' />
        </div>

        <div className='absolute top-[-21px] left-[-30px]'>
          <Image
            src={logo1}
            alt='part of logo-four'
            className='rotate-[270deg]'
          />
        </div>
        <div className='absolute top-[15px] left-[5px]'>
          <Image src={center} alt='part of logo-four' className='' />
        </div>

        <div className='absolute bottom-[-100px]'>
          <h1 className='text-5xl text-[#193048] tracking-[10px] font-optima'>MEHAMERU</h1>
        </div>
        <div className='absolute bottom-[-150px]'>
          <h1 className='text-5xl text-[#193048] font-optima tracking-[10px]'>
            INNOVATIONS
          </h1>
        </div>
      </div>
      <div className='flex items-start flex-col justify-center gap-6 ml-2 scale-90'>
        <div className='flex items-center justify-center'>
          <Image src={one} alt='image1' />
          <Image src={two} alt='image2' />
          <Image src={three} alt='image3' />
          <Image src={four} alt='image4' />
        </div>
        <div className='flex items-center justify-start gap-10 w-full'>
          <div className='flex '>
            <Image
              src={big}
              alt='a big image'
              className='w-[380px] h-[440px]'
            />
          </div>
          <h1 className='font-bold text-3xl max-w-[200px] font-optima text-[#193048]'>
            ‘Cultivating a healthy community connection’
          </h1>
        </div>
      </div>
    </section>
  );
};

export default LogoAnimation;
