import React from "react";
import { Button } from "../ui/button";

const DashboardEmptyMsg = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-center">
      <h1 className="text-black text-[26px] mb-6" style={{ fontWeight: 500 }}>
        You haven't added any property yet.
      </h1>
      <Button className="text-black bg-yellow-500 rounded-none cursor-pointer hover:bg-yellow-400 min-w-[150px] h-[50px]">
        Add Property
      </Button>
    </div>
  );
};

export default DashboardEmptyMsg;
