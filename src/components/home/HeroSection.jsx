import React, { useState } from "react";
import { useSelector } from "react-redux";
import { showRestaurantInfo } from "../../redux/slice/authSlice";
import { FiClock } from "react-icons/fi";
import RestuarantTimingModal from "../modals/RestuarantTimingModal";
import { BASE_URL } from "../../global/Config";

const HeroSection = () => {
  const restaurantInfo = useSelector(showRestaurantInfo);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <>
      <div
        className="relative bg-cover bg-center sm:h-[21.563rem] h-[11.438rem]"
        style={{
          backgroundImage: `url(${BASE_URL}${restaurantInfo?.bannerUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto relative z-10 flex flex-col h-full px-4 xl:px-28">
          <div className="flex-1 flex flex-col justify-center items-start">
            {/* <h1 className="text-white text-2xl sm:text-5xl font-semibold max-w-[48rem]">
              Delicious Fast Food, Delivered Fast!
            </h1>
            <p className="text-white mt-4 text-sm sm:text-2xl font-normal max-w-[40.5rem]">
              From juicy burgers to cheesy pizzas, satisfy your cravings with
              just one click!
            </p> */}
          </div>
          <div className="pb-4 flex gap-6 items-center">
            <p
              className="text-white flex gap-2 items-center text-xs cursor-pointer hover:underline"
              onClick={openModal}
            >
              <FiClock />
              Offen für Lieferung 11:15 - 22:00
            </p>
            {restaurantInfo?.isHalal && (
              <div className="text-white text-xs flex gap-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  style={{ width: "24px", height: "24px" }}
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M9.148.469A12.04 12.04 0 0 0 .79 8.102c-.64 1.78-.789 4.91-.34 6.73.844 3.355 3.262 6.375 6.301 7.816 2.043.957 3.242 1.239 5.438 1.22 3.261-.036 6.132-1.313 8.437-3.731 1.387-1.461 2.418-3.317 2.906-5.23.375-1.446.356-4.313-.02-5.794-.956-3.77-3.937-7.011-7.628-8.324C14.195.188 10.855.04 9.148.47m5.383 1.125c2.008.508 3.45 1.351 5.008 2.906 2.191 2.176 3.148 4.46 3.148 7.5 0 1.93-.355 3.395-1.218 5.043q-1.998 3.768-6.188 5.176c-4.93 1.668-10.48-.676-12.863-5.383-.77-1.535-1.106-2.98-1.106-4.797 0-3.078.938-5.289 3.188-7.559C6 2.96 7.445 2.117 9.375 1.613c1.367-.355 3.77-.375 5.156-.02m0 0"
                    clipRule="evenodd"
                  ></path>
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M7.258 6.02c-.246.394-.246.636-.02 1.855.336 1.95.524 4.18.375 4.781-.226.918-2.156 1.352-3.34.73-.562-.3-.562-.316-.468-1.347l.113-1.07-.356.656c-.695 1.273-.335 2.586.79 2.98 1.347.47 2.605.02 3.468-1.273.41-.602.41-.75.336-3.676-.074-2.101-.168-3.207-.355-3.562l-.262-.508ZM12.77 7.633a56 56 0 0 0-.395 1.742c-.508 2.25-1.668 3.695-3.824 4.707l-1.145.543h.957c1.254 0 2.754-.75 3.375-1.668.242-.375.598-1.312.805-2.082l.34-1.367.148 1.48c.262 2.926.957 3.43 3.676 2.68.863-.223 1.988-.469 2.473-.523.75-.094.957-.207 1.277-.73l.395-.602h-.75c-.454 0-1.125-.208-1.747-.543-1.875-.997-2.66-.938-3.355.222-.488.79-.469.977.04.621.523-.375 1.405-.375 2.21-.039.617.246.617.262.207.489-.527.261-2.27.468-2.871.32-.637-.172-.879-.828-.992-2.719-.227-3.3-.45-4.016-.824-2.531m0 0"
                    clipRule="evenodd"
                  ></path>
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M8.438 8.438c0 .695.054.769.882 1.164.637.296 1.032.656 1.313 1.18l.43.75v-.618c0-1.07-.883-2.422-1.915-2.965-.691-.355-.71-.355-.71.489M6 17.25c0 1.18.04 1.313.375 1.313.3 0 .375-.133.375-.563s.074-.562.375-.562c.3 0 .375.132.375.562s.074.563.375.563c.336 0 .375-.133.375-1.313s-.04-1.312-.375-1.312c-.281 0-.375.132-.375.468s-.094.469-.375.469-.375-.133-.375-.469-.094-.468-.375-.468c-.336 0-.375.132-.375 1.312M8.887 17.25c-.375 1.238-.375 1.313-.075 1.313a.54.54 0 0 0 .45-.282c.058-.148.261-.281.468-.281.188 0 .395.133.47.281.093.282.675.395.675.133 0-.078-.168-.64-.355-1.258-.282-.918-.434-1.125-.79-1.18-.41-.039-.488.094-.843 1.274m1.05-.074c0 .148-.074.262-.187.262-.094 0-.187-.168-.187-.395 0-.207.093-.316.187-.262.113.055.188.242.188.395M11.25 17.25v1.313h.824c.563 0 .864-.094.938-.282.074-.207-.035-.281-.45-.281C12 18 12 17.98 12 16.969c0-.899-.04-1.032-.375-1.032-.336 0-.375.133-.375 1.313M13.707 17.102c-.227.636-.395 1.234-.395 1.312 0 .262.563.148.676-.133.149-.375.77-.355.973.02.094.168.3.262.453.242.262-.074.242-.242-.094-1.348-.32-1.07-.433-1.258-.808-1.258-.336 0-.489.188-.805 1.165m.844.28c-.207.204-.356-.112-.207-.452.148-.317.148-.317.226 0 .055.187.035.394-.02.453M15.938 17.25v1.313h.937c.71 0 .938-.075.938-.282q0-.28-.563-.281c-.562 0-.562-.02-.562-1.031 0-.899-.04-1.032-.375-1.032-.336 0-.375.133-.375 1.313m0 0"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <p>Halal</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <RestuarantTimingModal
          item={{ name: "Opening Hours" }}
          closeModal={closeModal}
        />
      )}
    </>
  );
};

export default HeroSection;
