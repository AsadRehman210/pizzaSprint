import { createElement } from "react";
import { FaSpinner } from "react-icons/fa6";

export default function Button({
  className,
  onClick,
  type,
  title,
  src,
  icon,
  btn,
  disabled,
  imgClass,
  loading,
  iconClass,
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      className={`${className} ${
        src || icon || loading
          ? "flex gap-1 text-[#2B3674] items-center justify-center"
          : ""
      } w-full md:h-[46px] h-[40px] rounded-base px-4 border text-sm disabled:opacity-60 disabled:cursor-default cursor-pointer  ${
        btn === "primary"
          ? "bg-blue text-white border-blue"
          : btn === "disabled"
          ? "bg-[#DCE0E4] border-[#DCE0E4] text-black"
          : btn === "outline"
          ? "text-primary font-semibold border-primary/10 bg-transparent"
          : "bg-white font-semibold text-[#2B3674] border-[#E2E8F0]"
      }`}
    >
      {src && <img src={src} className={`${imgClass || ""}`} alt="" />}
      {icon && createElement(icon, { className: iconClass })}
      {loading ? <FaSpinner className="animate-spin" /> : title}
    </button>
  );
}
