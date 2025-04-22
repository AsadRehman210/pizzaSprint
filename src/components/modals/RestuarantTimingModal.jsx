import React from "react";
import { useSelector } from "react-redux";
import { showRestaurantInfo } from "../../redux/slice/authSlice";

const RestuarantTimingModal = ({ item, closeModal }) => {
  const restaurantInfo = useSelector(showRestaurantInfo);
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Öffnungszeiten</h3>
          <button onClick={closeModal} className=" hover:text-red-800">
            <i className="fa-regular fa-circle-xmark font-sm"></i>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
          <div className="text-[0.875rem] font-bold"></div>
          <div className="text-[0.875rem] font-bold">Abholung</div>
          <div className="text-[0.875rem] font-bold">Lieferung</div>
          {restaurantInfo?.restaurantOpeningHours?.map((item, index) => (
            <>
              <div className="text-[0.875rem] font-bold">{item.weekDay}</div>
              <div className="">
                {item.deliveryHours[0].startTime} -{" "}
                {item.deliveryHours[0].endedAt}
              </div>
              <div className="">
                {item.takeawayHours[0].startTime} -{" "}
                {item.takeawayHours[0].endedAt}
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestuarantTimingModal;
