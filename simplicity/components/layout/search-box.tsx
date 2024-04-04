import React, { useContext } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Separator } from "../ui/separator";
import { SearchContext } from "./SearchContext";

const SearchBox = () => {
  const { searchQuery, setSearchQuery } = useContext(SearchContext) || {};
  return (
    <div className="">
      <div className="flex items-center justify-center border border-transparent bg-background focus-within:border-primary rounded-full z-10">
        <div className="flex w-10 pl-2 h-9 items-center rounded-s-full">
          <Search size={20} />
        </div>
        <Separator orientation="vertical" className="h-4 items-center" />
        <Input
          type="text"
          className="flex-grow px-1 py-2 border-none focus-visible:ring-0 shadow-none font-light placeholder:text-xs "
          size={40}
          value={searchQuery}
          onChange={(e) => setSearchQuery?.(e.target.value)}
          placeholder="Search Title, Description, Poetry or Writer"
        />
      </div>
    </div>
  );
};

export default SearchBox;
