// import React, { useCallback, useState } from "react";
// import PizzaSelectedModal from "../modals/PizzaSelectedModal";
// import FoodCard from "./FoodCard";
// import { useSelector } from "react-redux";
// import { showMenu } from "../../redux/slice/authSlice";

// const FoodCategories = () => {
//   const Menu = useSelector(showMenu);
//   console.log("menu", Menu);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPizza, setSelectedPizza] = useState(null);
//   const [isInfoModalTriggered, setIsInfoModalTriggered] = useState(false);

//   const openPizzaModal = useCallback(
//     (item, group, hasSizes) => {
//       if (isInfoModalTriggered) return;
//       setSelectedPizza({ ...item, group, hasSizes });
//       setIsModalOpen(true);
//     },
//     [isInfoModalTriggered]
//   );

//   const handlePizzaClick = (item, group, hasSizes) => () =>
//     openPizzaModal(item, group, hasSizes);

//   // const handlePizzaClick = (pizzaItem, group, hasSizes) => {
//   //   if (!isInfoModalTriggered) {
//   //     setSelectedPizza({ ...pizzaItem, group, hasSizes }); // Attach group to the pizza object
//   //     setIsModalOpen(true);
//   //   }
//   // };

//   const closeModal = () => {
//     setIsModalOpen(false); // Close modal
//     setSelectedPizza(null); // Clear selected pizza
//     setIsInfoModalTriggered(false); // Reset the info modal trigger state
//   };

//   return (
//     <div className="min-h-screen flex flex-col gap-6 mb-6">
//       {Array.isArray(Menu) &&
//         Menu?.map((categoryData, index) => (
//           <div
//             key={index}
//             className="flex flex-col gap-4"
//             id={categoryData.name.replace(/\s+/g, "-")}
//           >
//             {/* Category Heading */}
//             <h2 className="relative text-xl sm:text-2xl font-semibold mb-4">
//               {categoryData.name}
//               <span className="absolute -bottom-2 left-0 flex gap-1">
//                 <span className="block w-[43px] sm:w-[66px] h-1 bg-[#00274D]"></span>
//                 <span className="block w-[0.375rem] h-1 bg-[#00274D]"></span>
//                 <span className="block w-[0.375rem] h-1 bg-[#00274D]"></span>
//                 <span className="block w-[0.375rem] h-1 bg-[#00274D]"></span>
//               </span>
//             </h2>

//             {/* Pizza Items */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
//               {categoryData.items.map((item) => (
//                 <FoodCard
//                   key={item.id}
//                   item={item}
//                   onPizzaClick={handlePizzaClick(
//                     item,
//                     categoryData.group,
//                     categoryData.hasSizes
//                   )}
//                   setIsInfoModalTriggered={setIsInfoModalTriggered}
//                 />
//               ))}
//             </div>
//           </div>
//         ))}

//       {/* Render Modal */}
//       {isModalOpen && selectedPizza && (
//         <PizzaSelectedModal
//           selectedPizza={selectedPizza}
//           closeModal={closeModal}
//         />
//       )}
//     </div>
//   );
// };

// export default FoodCategories;

import React, { useCallback, useState } from "react";
import PizzaSelectedModal from "../modals/PizzaSelectedModal";
import FoodCard from "./FoodCard";

const FoodCategories = ({ menu = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [isInfoModalTriggered, setIsInfoModalTriggered] = useState(false);

  const openPizzaModal = useCallback(
    (item, group, hasSizes) => {
      if (isInfoModalTriggered) return;
      setSelectedPizza({ ...item, group, hasSizes });
      setIsModalOpen(true);
    },
    [isInfoModalTriggered]
  );

  const handlePizzaClick = (item, group, hasSizes) => () =>
    openPizzaModal(item, group, hasSizes);

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
            <h2 className="relative text-xl sm:text-2xl font-semibold mb-4">
              {categoryData.name}
              <span className="absolute -bottom-2 left-0 flex gap-1">
                <span className="block w-[43px] sm:w-[66px] h-1 bg-[#00274D]"></span>
                <span className="block w-[0.375rem] h-1 bg-[#00274D]"></span>
                <span className="block w-[0.375rem] h-1 bg-[#00274D]"></span>
                <span className="block w-[0.375rem] h-1 bg-[#00274D]"></span>
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {categoryData.items.map((item) => (
                <FoodCard
                  key={item.id}
                  item={item}
                  onPizzaClick={handlePizzaClick(
                    item,
                    categoryData.group,
                    categoryData.hasSizes
                  )}
                  setIsInfoModalTriggered={setIsInfoModalTriggered}
                />
              ))}
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
