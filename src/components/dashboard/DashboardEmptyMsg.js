import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
const DashboardEmptyMsg = ({ msg, btn, link }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-center">
      <h1 className="text-black text-[26px] mb-6" style={{ fontWeight: 500 }}>
        {msg}
      </h1>
      <Link href={link}>
        <Button className="text-black bg-yellow-500 rounded-none cursor-pointer hover:bg-yellow-400 min-w-[150px] h-[50px]">
          {btn}
        </Button>
      </Link>
    </div>
  );
};

export default DashboardEmptyMsg;
