import Image from "next/image";
import { useRouter } from "next/navigation";
import Cow from "../../public/images/products/supply-cow.webp";

function Supply({ title1, supplyItems, translatedSeeProductsText }) {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/connect#connect-form'); // Redirect to the form page
  };

  return (
    <div className="flex justify-center p-6 font-poppins pt-2 pb-32">
      <div className="flex lg:flex-row flex-col lg:justify-between justify-center w-full max-w-6xl text-left">
        {/* Left Side */}
        <div className="flex flex-col lg:w-1/2 w-full">
          <h1 className="lg:text-5xl text-3xl font-poppinsSB font-bold text-[#193048] mb-4 text-center lg:text-start">
            {title1}
          </h1>
          <ol className="list-disc lg:ml-6 mb-4 text-[#193048] lg:text-xl text-lg mt-8 items-center mx-auto">
            {supplyItems.map((item, index) => (
              <li key={index} className="mb-1">{item}</li>
            ))}
          </ol>
          <button
            onClick={handleRedirect}
            className="bg-[#193048] font-poppinsSB text-[#E6CFB7] lg:px-4 lg:py-2 px-8 py-4 mt-4 rounded lg:text-xl text-lg mx-auto lg:mx-0 lg:w-[310px] lg:h-[75px]"
          >
              {translatedSeeProductsText || 'Send Enquiry'}
          </button>
        </div>

        {/* Right Side - Image */}
        <div className="lg:w-1/2 w-full lg:flex hidden items-end justify-center mt-8 lg:mt-0">
          <Image
            src={Cow}
            alt="Cow"
            width={524}
            height={272}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default Supply;
