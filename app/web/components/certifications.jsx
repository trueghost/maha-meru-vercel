import Image from 'next/image';
// import { useLanguage } from "../../context/languageContext"; // Import the language context

function Certifications({ title5, achievements }) {

  const visibleAchievements = achievements?.filter((achievement) => achievement?.hide === 0);

  return (
    <div className={`flex flex-col justify-center items-center ${visibleAchievements?.length > 0 ? "py-28" : ""} font-poppins`}>
      {/* Only render the title if it's not hidden */}
      {title5 && (
        <h1 className='text-4xl text-[#193048] mt-10 font-semibold  mb-3 text-center font-poppinsSB'
        style={{
          fontFamily: "PoppinsSB",
          color: "#193048",
          fontSize: "1.875rem",
          fontWeight: "400",
        }}
        >
          {title5}
        </h1>
      )}
      <div className='flex gap-10 flex-wrap items-center justify-center'>
        {visibleAchievements?.map((achievement) => (
            <Image
              key={achievement?.id}
              src={achievement?.image} 
              alt={achievement?.title}
              width={345}
              height={345}
              className='scale-60'
            />
          ))}
      </div>
    </div>
  );
}

export default Certifications;