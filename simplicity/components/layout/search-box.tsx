import React, { useContext } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Separator } from "../ui/separator";
import { SearchContext } from "./SearchContext";

const SearchBox = () => {
  const { searchQuery, setSearchQuery } = useContext(SearchContext) || {};
  return (
    <div className="w-full md:max-w-md max-w-xs">
      <div className="flex items-center justify-center border border-transparent bg-background focus-within:!border-primary hover:border-muted rounded-full z-10">
        <div className="flex w-8 md:w-10 pl-3 md:pl-4 h-8 md:h-9 items-center justify-center">
          <Search size={16} />
        </div>
        <Separator orientation="vertical" className="h-4 mx-1 md:mx-2" />
        <Input
          type="text"
          className="flex-grow px-1 py-2 border-none focus-visible:ring-0 shadow-none font-light placeholder:text-xs placeholder:font-semibold"
          size={40}
          value={searchQuery}
          spellCheck={false}
          onChange={(e) => setSearchQuery?.(e.target.value)}
          placeholder="Search Title, Description, Poetry or Writer"
        />
      </div>
    </div>
  );
};

export default SearchBox;
