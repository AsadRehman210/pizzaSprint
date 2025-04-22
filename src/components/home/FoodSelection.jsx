import React, { useState, useMemo } from "react";
import DeliveryPickupForm from "./DeliveryPickupForm";
import FoodCategories from "./FoodCategories";
import search from "../../assets/images/search.svg";
import OrderDetailsModal from "../modals/OrderDetailsModal";
import { useSelector } from "react-redux";
import { showMenu } from "../../redux/slice/authSlice";

const FoodSelection = () => {
  const allMenuItems = useSelector(showMenu);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const totalAmount = useSelector((state) => state.pizza.totalAmount);

  // Filter menu items based on search term
  const filteredMenu = useMemo(() => {
    if (!searchTerm) return allMenuItems;

    return allMenuItems
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description &&
              item.description.toLowerCase().includes(searchTerm.toLowerCase()))
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [allMenuItems, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const openOrderModal = () => setIsOrderModalOpen(true);
  const closeOrderModal = () => setIsOrderModalOpen(false);

  return (
    <div className="bg-[#F3F3F3] py-4 h-full">
      <div className="flex flex-col lg:flex-row container mx-auto px-4 gap-4 xl:px-28">
        <div
          className="mt-0 lg:mt-6 order-2 lg:order-1"
          style={{ flex: "3 1 65%" }}
        >
          <div className="flex items-center mb-6 relative">
            <input
              type="text"
              placeholder="Search for food items..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full py-4 pl-4 pr-10 border border-[#D8D8D8] rounded-lg text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-[#00274D] focus:border-[#00274D]"
            />
            <button className="absolute top-5 sm:top-6 right-4 w-[0.888rem] h-[0.888rem]">
              <img src={search} alt="search" className="w-full h-full" />
            </button>
          </div>

          <FoodCategories menu={filteredMenu} />
        </div>
        <div className="order-1 lg:order-2 h-auto" style={{ flex: "2 1 35%" }}>
          <DeliveryPickupForm />
        </div>
      </div>
      <div className="sticky bottom-2 flex lg:hidden">
        <div className="container mx-auto px-4 xl:px-28">
          <button
            className="w-full text-white py-3 rounded mt-6 text-lg font-medium bg-[#00274D] active:bg-[#001C3A] flex justify-between px-4"
            onClick={openOrderModal}
          >
            <p>Check the selected products</p>
            <p>€ {totalAmount.toFixed(2)}</p>
          </button>
        </div>
      </div>
      <OrderDetailsModal
        isModalOpen={isOrderModalOpen}
        closeModal={closeOrderModal}
      />
    </div>
  );
};

export default FoodSelection;
