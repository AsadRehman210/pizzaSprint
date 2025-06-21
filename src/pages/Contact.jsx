import { FiPhone } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { showRestaurantInfo } from "../redux/slice/authSlice";
import React from "react";

export default function Contact() {
  const restaurantInfo = useSelector(showRestaurantInfo);
  const constructAddress = () => {
    if (!restaurantInfo) return "";
    return `${restaurantInfo?.street} ${restaurantInfo?.house_number}, {" "} ${restaurantInfo?.zipcode} ${restaurantInfo?.city}`;
  };
  return (
    <div className="bg-white py-10">
      <div className="container mx-auto px-4 xl:px-28">
        <h1 className="text-3xl font-semibold">{restaurantInfo?.name}</h1>

        <div className="mt-4 flex flex-col md:flex-row md:justify-between">
          {/* Left side: Opening hours */}
          <div className="md:w-2/3">
            <h2 className="text-base font-semibold">Öffnungszeiten</h2>
            <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
              <div className="text-[0.875rem] font-bold"></div>
              <div className="text-[0.875rem] font-bold">Abholung</div>
              <div className="text-[0.875rem] font-bold">Lieferung</div>
              {restaurantInfo?.restaurantOpeningHours?.map((item, index) => (
                <React.Fragment key={index}>
                  <div className="text-[0.875rem] font-bold">
                    {item.weekDay}
                  </div>
                  <div className="">
                    {item.deliveryHours[0].startTime} -{" "}
                    {item.deliveryHours[0].endedAt}
                  </div>
                  <div className="">
                    {item.takeawayHours[0].startTime} -{" "}
                    {item.takeawayHours[0].endedAt}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right side: Address and Contact */}
          <div className="md:w-1/3 flex flex-col gap-4 mt-6 md:mt-0">
            <div>
              <h2 className="text-base font-semibold">Adresse</h2>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  constructAddress()
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 mt-2 hover:underline "
              >
                <div className="bg-gray-300 rounded-md p-3">
                  <IoLocationOutline className=" text-xl" />
                </div>
                <p className="text-base">
                  {restaurantInfo?.street} {restaurantInfo?.house_number},{" "}
                  {restaurantInfo?.zipcode} {restaurantInfo?.city}
                </p>
              </a>
            </div>

            <div>
              <h2 className="text-base font-semibold">Hast du Fragen?</h2>
              <a
                href={`tel:${restaurantInfo?.phone_number?.replace(/\s/g, "")}`}
                className="flex items-center gap-3 mt-2 hover:underline"
              >
                <div className="bg-gray-300 rounded-md p-3">
                  <FiPhone className=" text-xl" />
                </div>
                <p className="text-base">{restaurantInfo?.phone_number}</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
