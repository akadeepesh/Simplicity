import React, { useState } from "react";
import { Input } from "../ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { Separator } from "../ui/separator";

const SearchBox = () => {
  const [searchParam, setSearchParam] = useState<string>("");
  return (
    <div className="">
      <div className="flex items-center justify-center border border-transparent bg-background focus-within:border-primary rounded-full z-10">
        <div className="flex w-10 pl-2 h-9 items-center rounded-s-full hover:text-bluePrimary cursor-pointer">
          <Search size={20} />
        </div>
        <Separator orientation="vertical" className="h-4 items-center" />
        <Input
          type="text"
          className="flex-grow px-1 py-2 border-none focus-visible:ring-0 shadow-none font-light"
          size={40}
          value={searchParam}
          onChange={(e) => setSearchParam(e.target.value)}
          placeholder="Search"
        />
        <div className="flex px-2 pl-1 w-9 h-9 items-center justify-center rounded-e-full hover:text-bluePrimary cursor-pointer">
          <SlidersHorizontal size={20} />
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
