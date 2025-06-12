import { Button } from "@/components/ui/button";
import Link from "next/link";

export const SmallDescription = () => {
    return (
      <section className="flex flex-col sm:flex-row items-center bg-white mt-30">
  
        <div className="w-full sm:w-1/2 h-96 sm:h-auto">
          <img
            src="https://newhome.qodeinteractive.com/wp-content/uploads/2023/03/main-home-img-1.jpg"
            alt="Modern Property"
            className="w-full h-full object-cover"
          />
        </div>
  
        <div className="w-full sm:w-1/2 p-6 flex flex-col justify-center">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-gray-800">
            Modern spaces and premium design
          </h2>
          <p className="text-muted-foreground mb-6 text-base sm:text-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Nulla facilisi. Nulla facilisi.
          </p>
  
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground text-sm sm:text-base">
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>Nulla facilisi. Nulla facilisi. Nulla facilisi.</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>Nulla facilisi. Nulla facilisi. Nulla facilisi.</li>
          </ul>
  
          <div className="mt-8 text-center">
            <Link href="/properties">
              <Button className="bg-yellow-500 hover:bg-yellow-800 text-white whitespace-nowrap h-16 px-8 text-lg w-80">
                Search Properties
              </Button>
            </Link>
          </div>
        </div>
        
      </section>
    );
  };