import React, { useState } from "react";

const DealItem = ({
  dealItem,
  dealIndex,
  selectedDealItem,
  handleDealItemChange,
  selectedDealExtras,
  handleDealExtraChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      {dealItem.selectableItems && dealItem.isSelectable ? (
        <div>
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex flex-col">
              <h4 className="text-base font-bold">
                {dealItem.name || "Ihre 1. Pizza"}
              </h4>
              <p className="text-sm font-normal font-poppins">Wähle 1</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-xs text-white bg-purple-600 px-3 py-1 rounded">
                Required
              </p>
              <svg
                className={`w-5 h-5 transition-transform transform ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>

          {isOpen && (
            <ul className="flex flex-col gap-2 mt-4">
              {dealItem.selectableItems.map((item, index) => (
                <li key={index} className="flex items-center gap-4">
                  <input
                    type="radio"
                    name={`deal-${dealIndex}`}
                    id={`deal-${dealIndex}-${index}`}
                    checked={selectedDealItem?.id === item.id}
                    onChange={() => handleDealItemChange(item)}
                    className="appearance-none border border-[#00274D] rounded-full w-4 h-4 checked:bg-[#00274D] checked:border-[#00274D] focus:outline-none"
                  />
                  <label
                    htmlFor={`deal-${dealIndex}-${index}`}
                    className="flex justify-between w-full"
                  >
                    <p className="text-sm font-medium font-poppins">
                      {item.name}
                    </p>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {dealItem.selectableItems && !dealItem.isSelectable ? (
        <>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <h4 className="text-base font-bold">
                {dealItem.name || "Your Choice"}
              </h4>
              <p className="text-sm font-normal font-poppins">Included</p>
            </div>
            <div className="flex items-center">
              <p className="text-xs text-white bg-[#00274D] px-3 py-1 rounded">
                Included
              </p>
            </div>
          </div>

          <ul className="flex flex-col gap-2">
            {dealItem.selectableItems.map((item, index) => (
              <li key={index} className="flex items-center gap-4">
                <input
                  type={"checkbox"}
                  name={`deal-${dealIndex}`}
                  id={`deal-${dealIndex}-${index}`}
                  checked={true}
                  onChange={() => {}}
                  disabled={true}
                  className={`appearance-none border rounded-full w-4 h-4 bg-gray-200 border-gray-300 focus:outline-none`}
                />
                <label
                  htmlFor={`deal-${dealIndex}-${index}`}
                  className="flex justify-between w-full"
                >
                  <p className="text-sm font-medium font-poppins">
                    {item.name}
                  </p>
                  <p className="text-sm font-medium font-poppins">Included</p>
                </label>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {dealItem.group?.map((group, groupIndex) => (
        <DealExtraGroup
          key={groupIndex}
          group={group}
          dealItemName={dealItem.name}
          dealIndex={dealIndex}
          groupIndex={groupIndex}
          selectedDealExtras={selectedDealExtras}
          handleDealExtraChange={handleDealExtraChange}
        />
      ))}
    </div>
  );
};

const DealExtraGroup = ({
  group,
  dealItemName,
  dealIndex,
  selectedDealExtras,
  handleDealExtraChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col">
          <h4 className="text-base font-bold">
            {`${dealItemName} - ${group.name}`}
          </h4>
          <p className="text-sm font-normal font-poppins">
            Choose as many as you like
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p
            className={`text-xs px-3 py-1 rounded ${
              group.selectionRequired
                ? "text-white bg-purple-600"
                : "text-gray-500 bg-gray-200"
            }`}
          >
            {group.selectionRequired ? "Required" : "Optional"}
          </p>
          <svg
            className={`w-5 h-5 transition-transform transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>

      {isOpen && (
        <ul className="my-2 space-y-2 mt-4">
          {group.groupOption?.map((option, optionIndex) => (
            <li key={optionIndex} className="flex items-center gap-4">
              <input
                type={group.selectionRequired ? "radio" : "checkbox"}
                id={`${group.name}-${dealIndex}-${optionIndex}`}
                checked={selectedDealExtras.some(
                  (extra) => extra.id === option.id
                )}
                onChange={() => handleDealExtraChange(option)}
                className={`appearance-none h-5 w-5 border border-gray-300 ${
                  group.selectionRequired
                    ? "rounded-full checked:bg-[#00274D] checked:border-[#00274D]"
                    : "rounded-sm checked:bg-[#00274D] checked:border-[#00274D]"
                } focus:outline-none focus:ring-none cursor-pointer
                      checked:before:content-['✔'] checked:before:text-white checked:before:absolute checked:before:inset-0 checked:before:flex checked:before:justify-center checked:before:items-center relative`}
              />
              <label
                htmlFor={`${group.name}-${dealIndex}-${optionIndex}`}
                className="flex justify-between w-full"
              >
                <p className="text-sm font-medium font-poppins">
                  {option.name}
                </p>
                <p className="text-sm font-medium font-poppins">
                  + {option.price[0]?.price} €
                </p>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DealItem;
