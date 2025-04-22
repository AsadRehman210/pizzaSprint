import React, { useEffect, useState } from "react";
import OrderDetails from "./OrderDetails";
import clock from "../../assets/images/clock.svg";
import calendar from "../../assets/images/calendar.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDeliveryArea,
  setDeliveryMode,
} from "../../redux/slice/authSlice";

const DeliveryPickupForm = () => {
  const dispatch = useDispatch();
  const DeliveryArea = useSelector(selectDeliveryArea);
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [isDelivery, setIsDelivery] = useState(true);
  const [selectedArea, setSelectedArea] = useState(null);

  // State for tracking which select is focused
  const [focusedSelect, setFocusedSelect] = useState({
    deliveryArea: false,
    date: false,
    time: false,
  });

  // Initialize dates and times
  useEffect(() => {
    setDates(generateDates());
    setTimes(generateTimes());

    // Set delivery mode to true on page refresh
    dispatch(setDeliveryMode(true));
  }, []);

  const handleDeliveryChange = (delivery) => {
    setIsDelivery(delivery);
    dispatch(setDeliveryMode(delivery));
  };

  const handleAreaChange = (e) => {
    const selectedName = e.target.value;
    const areaObj = DeliveryArea.find((area) => area.name === selectedName);
    setSelectedArea(areaObj);
  };

  // Generate dates for 1 week dynamically
  const generateDates = () => {
    const today = new Date();
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      weekDates.push(date.toISOString().slice(0, 10)); // Format: YYYY-MM-DD
    }
    return weekDates;
  };

  // Generate times with a 30-minute gap
  const generateTimes = () => {
    const timeSlots = [];
    let startTime = new Date();
    startTime.setHours(8, 0, 0, 0); // Start at 8:00 AM
    const endTime = new Date();
    endTime.setHours(20, 0, 0, 0); // End at 8:00 PM

    while (startTime <= endTime) {
      timeSlots.push(startTime.toTimeString().slice(0, 5)); // Format: HH:MM
      startTime = new Date(startTime.getTime() + 30 * 60000); // Add 30 minutes
    }
    return timeSlots;
  };

  // Initialize dates and times
  React.useEffect(() => {
    setDates(generateDates());
    setTimes(generateTimes());
  }, []);

  // Handler for select focus
  const handleSelectFocus = (selectName) => {
    setFocusedSelect((prev) => ({
      ...prev,
      [selectName]: true,
    }));
  };

  // Handler for select blur
  // const handleSelectBlur = (selectName) => {
  //   setFocusedSelect((prev) => ({
  //     ...prev,
  //     [selectName]: false,
  //   }));
  // };

  return (
    <div className="h-full mx-auto my-0 lg:my-6 font-mon">
      <div className="flex flex-col gap-2 border-0 lg:border-l-2 border-[#D8D8D8] pl-0 lg:pl-4">
        <div className="flex justify-center bg-[#D9D9D9] px-3 py-2 rounded-lg ">
          <button
            className={`px-4 py-3.5 w-1/2 rounded-lg text-base ${
              isDelivery ? "bg-[#00274D] text-white" : ""
            }`}
            onClick={() => handleDeliveryChange(true)}
          >
            Delivery
          </button>
          <button
            className={`px-4 py-3.5 w-1/2 rounded-lg text-base ${
              !isDelivery ? "bg-[#00274D] rounded-lg text-white" : ""
            }`}
            onClick={() => handleDeliveryChange(false)}
          >
            Pickup
          </button>
        </div>

        {isDelivery && (
          <div className="flex flex-col gap-2 relative">
            <label
              htmlFor="deliveryArea"
              className="block text-sm sm:text-base font-semibold"
            >
              Post Code
            </label>
            <select
              id="deliveryArea"
              value={selectedArea?.name || ""}
              onChange={handleAreaChange}
              onFocus={() => handleSelectFocus("deliveryArea")}
              // onBlur={() => handleSelectBlur("deliveryArea")}
              className="w-full p-4 pr-10 border border-[#D8D8D8] rounded focus:ring-[#00274D] focus:border-[#00274D] text-xs font-normal appearance-none"
            >
              <option value="">Select Delivery Area</option>
              {DeliveryArea.map((area, index) => (
                <option key={index} value={area.name}>
                  {area.name}
                </option>
              ))}
            </select>
            {/* Custom dropdown icon */}
            <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-[#00274D] text-sm">
              <i
                className={`fa-solid ${
                  focusedSelect.deliveryArea
                    ? "fa-chevron-up"
                    : "fa-chevron-down"
                }`}
              ></i>
            </div>

            <p className="ml-auto pt-2 text-xs font-medium cursor-pointer">
              <i className="fa-solid fa-location-crosshairs mr-2"></i>
              Location me
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <h2 className="text-base sm:text-lg font-semibold ">
            Please Select a Delivery Area
          </h2>
          <div className="relative">
            <select
              id="date"
              onFocus={() => handleSelectFocus("date")}
              // onBlur={() => handleSelectBlur("date")}
              className="w-full p-4 pl-10 text-xs border bg-white border-[#D8D8D8] rounded-md focus:ring-[#00274D] focus:border-[#00274D] appearance-none"
            >
              <option value="">Choose a Date</option>
              {dates.map((date, index) => (
                <option key={index} value={date}>
                  {date}
                </option>
              ))}
            </select>
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-3.5 h-3.5 ">
              <img src={calendar} alt="calender" className="w-full h-full" />
            </div>
            {/* Date dropdown icon */}
            <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-[#00274D] text-sm">
              <i
                className={`fa-solid ${
                  focusedSelect.date ? "fa-chevron-up" : "fa-chevron-down"
                }`}
              ></i>
            </div>
          </div>
          <div className="relative">
            <select
              style={{ height: "50px" }}
              id="time"
              onFocus={() => handleSelectFocus("time")}
              // onBlur={() => handleSelectBlur("time")}
              className="w-full p-4 pl-10 text-xs border bg-white border-[#D8D8D8] rounded-md focus:ring-[#00274D] focus:border-[#00274D] appearance-none"
            >
              <option value="">Choose a Time</option>
              {times.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-3.5 h-3.5 ">
              <img src={clock} alt="calender" className="w-full h-full" />
            </div>
            {/* Time dropdown icon */}
            <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-[#00274D] text-sm">
              <i
                className={`fa-solid ${
                  focusedSelect.time ? "fa-chevron-up" : "fa-chevron-down"
                }`}
              ></i>
            </div>
          </div>
        </div>
      </div>

      <OrderDetails selectedArea={selectedArea} />
    </div>
  );
};

export default DeliveryPickupForm;
