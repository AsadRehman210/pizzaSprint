import React, { useCallback, useState } from "react";
import PizzaSelectedModal from "../modals/PizzaSelectedModal";
import FoodCard from "./FoodCard";

const FoodCategories = ({ menu = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [isInfoModalTriggered, setIsInfoModalTriggered] = useState(false);

  const openPizzaModal = useCallback(
    (item, categoryData) => {
      if (isInfoModalTriggered) return;
      setSelectedPizza({ items: item, ...categoryData });
      setIsModalOpen(true);
    },
    [isInfoModalTriggered]
  );

  const handlePizzaClick = (item, categoryData) => () =>
    openPizzaModal(item, categoryData);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPizza(null);
    setIsInfoModalTriggered(false);
  };

  return (
    <div className="min-h-screen flex flex-col gap-6 mb-6">
      {menu.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg">No items found matching your search.</p>
        </div>
      ) : (
        menu.map((categoryData, index) => (
          <div
            key={index}
            className="flex flex-col gap-4"
            id={categoryData.name.replace(/\s+/g, "-")}
          >
            <div className="flex gap-6 items-center">
              {" "}
              <h2 className="relative text-xl sm:text-2xl font-semibold mb-4">
                {categoryData.name}
                <span className="absolute -bottom-2 left-0 flex gap-1 w-full">
                  <span className="block w-[43px] sm:w-[40%] h-1 bg-[#00274D]"></span>
                  <span className="block w-[0.375rem] h-1 bg-[#00274D]"></span>
                  <span className="block w-[0.375rem] h-1 bg-[#00274D]"></span>
                  <span className="block w-[0.375rem] h-1 bg-[#00274D]"></span>
                </span>
              </h2>
              {categoryData?.hasDiscount && (
                <p className="bg-[#00274D] text-white px-2 py-1 rounded-md">
                  {categoryData?.discount?.amount} % Discount
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 relative">
              {categoryData.items.map((item) => {
                const { items, ...categoryWithoutItems } = categoryData;
                return (
                  <FoodCard
                    key={item.id}
                    item={item}
                    discount={categoryData?.discount}
                    onPizzaClick={handlePizzaClick(item, categoryWithoutItems)}
                    setIsInfoModalTriggered={setIsInfoModalTriggered}
                  />
                );
              })}
            </div>
          </div>
        ))
      )}

      {isModalOpen && selectedPizza && (
        <PizzaSelectedModal
          selectedPizza={selectedPizza}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default FoodCategories;
