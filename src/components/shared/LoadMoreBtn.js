import React from "react";
import { Button } from "../ui/button";

const LoadMoreBtn = () => {
  return (
    <div>
      <Button className="bg-yellow-500 cursor-pointer text-black rounded-none hover:bg-yellow-400 min-w-[150px] h-[50px]">
        Load More
      </Button>
    </div>
  );
};

export default LoadMoreBtn;
