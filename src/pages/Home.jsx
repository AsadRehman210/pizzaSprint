import HeroSection from "../components/home/HeroSection";
import FoodMenu from "../components/home/FoodMenu";
import FoodSelection from "../components/home/FoodSelection";

const Home = () => {
  return (
    <main className="text-[#00274D] pb-10">
      <HeroSection />
      <FoodMenu />
      <FoodSelection />
    </main>
  );
};

export default Home;
