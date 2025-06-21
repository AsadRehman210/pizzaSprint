import React, { useEffect, useState } from "react";
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const Topbutton = () => {
  let [isvisible, setIsvisible] = useState(false);
  let GoToTop = () => {
    return window.scrollTo({ top: 0, left: 0 });
  };

  let showTopbtn = () => {
    const height = 250;
    const scroll_height =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (scroll_height > height) {
      setIsvisible(true);
    } else {
      setIsvisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", showTopbtn);
    return () => window.removeEventListener("scroll", showTopbtn);
  }, []);

  return (
    <>
      {isvisible && (
        <div
          className="fixed
          bottom-20
          sm:bottom-20 
        md:bottom-16
        right-8
        md:right-16
        w-12 
        md:w-14
        h-12
        md:h-14 
        rounded-full 
        bg-[#CA9523]
        shadow-[0.5rem_0.5rem_2.5rem_-0.5rem_rgba(0,0,0,0.5)]  
        grid 
        place-content-center 
        text-white 
        text-[2.4rem] 
        cursor-pointer 
        z-[100000000]
        animate-goToTop "
          onClick={GoToTop}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            className="w-4 h-4 md:w-6 md:h-6 fill-white"
          >
            <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2 160 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-306.7L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
          </svg>
        </div>
      )}
    </>
  );
};

export default Topbutton;
