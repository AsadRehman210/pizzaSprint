import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-scroll";
import { showMenu } from "../../redux/slice/authSlice";

const FoodMenu = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [clicked, setClicked] = useState(false);
  const menuRef = useRef(null);
  const Menu = useSelector(showMenu);
  console.log("Menu", Menu);

  const handleMenuClick = (index) => {
    setActiveIndex(index);
    setClicked(true);
  };

  // Update active index when the section comes into view while scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (!clicked) {
        const sections = Menu.map((item) =>
          document.getElementById(item.name.replace(/\s+/g, "-"))
        );
        sections.forEach((section, index) => {
          if (
            section &&
            section.getBoundingClientRect().top <= 80 && // Section top is <= 80px from the top
            section.getBoundingClientRect().bottom > 80 // Section is still visible
          ) {
            setActiveIndex(index);
          }
        });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [clicked, Menu]);

  // Reset clicked state after animation completes
  useEffect(() => {
    if (clicked) {
      const timeout = setTimeout(() => {
        setClicked(false);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [clicked]);

  // Scroll active menu item into horizontal view when activeIndex changes
  useEffect(() => {
    if (menuRef.current) {
      const menuContainer = menuRef.current;
      const activeMenuItem = menuContainer.querySelector(
        `#menu-item-${activeIndex}`
      );
      if (activeMenuItem) {
        const menuRect = menuContainer.getBoundingClientRect();
        const itemRect = activeMenuItem.getBoundingClientRect();

        // Check if the active item is outside the visible area
        if (itemRect.left < menuRect.left || itemRect.right > menuRect.right) {
          menuContainer.scrollTo({
            left:
              menuContainer.scrollLeft +
              (itemRect.left - menuRect.left) -
              menuRect.width / 4,
            behavior: "smooth",
          });
        }
      }
    }
  }, [activeIndex]);

  return (
    <section className="bg-white sticky top-0 z-40 left-0 shadow-lg h-[3.75rem] flex items-center">
      <div className="container mx-auto px-4 xl:px-28 w-full h-full">
        <ul
          className="flex items-center gap-8 bg-white w-full h-full overflow-x-auto "
          ref={menuRef}
        >
          {Array.isArray(Menu) &&
            Menu?.map((item, index) => {
              const formattedItem = item.name.replace(/\s+/g, "-");
              return (
                <Link
                  to={formattedItem}
                  key={index}
                  spy={true}
                  smooth={true}
                  offset={-60}
                  duration={500}
                  onClick={() => handleMenuClick(index)}
                  id={`menu-item-${index}`}
                  className={`cursor-pointer whitespace-nowrap text-sm sm:text-base border-black py-[0.15rem]
              ${
                activeIndex === index
                  ? "font-semibold border-b-2"
                  : "font-medium"
              }`}
                >
                  {item.name}
                </Link>
              );
            })}
        </ul>
      </div>
    </section>
  );
};

export default FoodMenu;
