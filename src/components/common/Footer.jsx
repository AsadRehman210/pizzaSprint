import React from "react";
import { useSelector } from "react-redux";
import { showRestaurantInfo } from "../../redux/slice/authSlice";
import { FiPhone } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";

const Footer = () => {
  const restaurantInfo = useSelector(showRestaurantInfo);
  // Construct the full address for Google Maps
  const constructAddress = () => {
    if (!restaurantInfo) return "";
    return `${restaurantInfo?.street} ${restaurantInfo?.house_number}, ${restaurantInfo?.zipcode} ${restaurantInfo?.city}`;
  };
  return (
    <footer className="bg-white text-white  flex flex-col gap-6">
      {/* Footer Sections */}
      <div className="container mx-auto px-4 xl:px-28 flex flex-wrap justify-between gap-8 md:gap-0  pb-2 pt-14">
        <div
          className="bg-[#00274D] rounded px-4 py-3"
          style={{ flex: "3 1 65%" }}
        >
          <h3>{restaurantInfo?.name}</h3>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              constructAddress()
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 mt-2 hover:underline"
          >
            <div>
              {" "}
              <IoLocationOutline className=" !text-xl" />
            </div>
            <p className="text-base">
              {restaurantInfo?.street} {restaurantInfo?.house_number},{" "}
              {restaurantInfo?.zipcode} {restaurantInfo?.city}
            </p>
          </a>

          <a
            href={`tel:${restaurantInfo?.phone_number?.replace(/\s/g, "")}`}
            className="flex items-center gap-3 mt-2 hover:underline"
          >
            <FiPhone className=" text-xl" />
            <p className="text-base">{restaurantInfo?.phone_number}</p>
          </a>
        </div>
        <div style={{ flex: "2 1 35%" }}></div>
      </div>
    </footer>
  );
};

export default Footer;
