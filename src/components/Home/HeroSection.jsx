import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/TranslationContext";
export const SmallNavBar = () => {
  return (
    <nav className="flex-row bg-white shadow-sm justify-start items-center p-2 space-x-4">
      <Tabs defaultValue="buy">
        <TabsList className="bg-transparent space-x-4">
          <TabsTrigger
            value="buy"
            className="data-[state=active]:border-b-2 data-[state=active]:bg-gray-200 text-gray-600"
          >
            Buy
          </TabsTrigger>
          <TabsTrigger
            value="rent"
            className="data-[state=active]:border-b-2 data-[state=active]:bg-gray-200 text-gray-600"
          >
            For Rent
          </TabsTrigger>
          <TabsTrigger
            value="sell"
            className="data-[state=active]:border-b-2 data-[state=active]:bg-gray-200 text-gray-600"
          >
            Sell
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </nav>
  );
};

export const HeroSection = () => {
  const images = [
    "https://newhome.qodeinteractive.com/wp-content/uploads/2023/03/home-rev-img-1.jpg",
    "https://newhome.qodeinteractive.com/wp-content/uploads/2023/03/home-rev-img-2.jpg",
    "https://newhome.qodeinteractive.com/wp-content/uploads/2023/03/home-rev-img-3.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const { t } = useTranslation();
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[600px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${images[currentImage]})` }}
      />

      <div className="relative z-10 flex flex-col justify-center h-full px-4 max-h-4000">
        <h1
          className="text-[75px] ml-6 font-bold text-white mb-8 max-w-6xl"
          style={{
            fontWeight: 500,
            fontWeight: 500,
            lineHeight: 1.1,
            width: "70%",
          }}
        >
          {t("header")}
        </h1>

        {/* <div className="flex space-x-4 justify-start w-220 max-w-8xl mb-0">
          <SmallNavBar />
        </div>

        <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl w-full max-w-6xl">
          <div className="flex flex-col md:flex-row gap-6">
            <Select>
              <SelectTrigger className="w-70 text-xl py-4 px-6 h-25 mt-4 ">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-70 text-xl py-4 px-6 h-25 mt-4">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new-york">New York</SelectItem>
                <SelectItem value="los-angeles">Los Angeles</SelectItem>
                <SelectItem value="chicago">Chicago</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white whitespace-nowrap h-16 px-8 text-lg w-70">
              Advanced
            </Button>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white h-16 px-10 text-lg w-70">
              Search
            </Button>
          </div>
        </div> */}
      </div>
    </section>
  );
};
