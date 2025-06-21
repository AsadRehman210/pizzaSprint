import React from "react";

const OptionGroupHeader = ({ title, description, isRequired }) => (
  <div className="flex justify-between border-t border-[#D8D8D8] py-3">
    <div className="flex flex-col">
      <h4 className="text-base font-semibold">{title}</h4>
      <p className="text-sm font-normal font-poppins">{description}</p>
    </div>
    <div className="flex items-center">
      <p className="text-xs text-white bg-[#00274D] px-3 py-1 rounded">
        {isRequired ? "Required" : "Optional"}
      </p>
    </div>
  </div>
);

export default OptionGroupHeader;
