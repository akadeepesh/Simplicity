import React from "react";
import { MoveRight } from "lucide-react";

const Footer = () => {
  return (
    <div>
      <div className="bottom-0 left-0 flex backdrop-blur-sm justify-center py-2 border-t mt-5 items-center font-serif font-bold">
        <div className="flex w-full max-w-4xl justify-center items-center gap-3">
          <div className="text-xl ">Post Your Creativity</div>
          <div className="hover:bg-secondary rounded p-1 cursor-pointer">
            <MoveRight size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
