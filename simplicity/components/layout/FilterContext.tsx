"use client";
import React, { createContext, useState } from "react";

export enum SortOptions {
  None,
  Date,
  Likes,
}

interface FilterData {
  hideTitle: boolean;
  hideDescription: boolean;
  sortOption: SortOptions;
  mostLikedFirst: boolean;
  stopAuto: boolean;
}

interface FilterContextProps {
  filterData: FilterData;
  setHideTitle: React.Dispatch<React.SetStateAction<boolean>>;
  setHideDescription: React.Dispatch<React.SetStateAction<boolean>>;
  setSortOption: React.Dispatch<React.SetStateAction<SortOptions>>;
  setMostLikedFirst: React.Dispatch<React.SetStateAction<boolean>>;
  setStopAuto: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FilterContext = createContext<FilterContextProps | undefined>(
  undefined
);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hideTitle, setHideTitle] = useState<boolean>(false);
  const [hideDescription, setHideDescription] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<SortOptions>(SortOptions.None);
  const [mostLikedFirst, setMostLikedFirst] = useState<boolean>(true);
  const [stopAuto, setStopAuto] = useState<boolean>(false);

  const filterData: FilterData = {
    hideTitle,
    hideDescription,
    sortOption,
    mostLikedFirst,
    stopAuto,
  };

  const contextValue: FilterContextProps = {
    filterData,
    setHideTitle,
    setHideDescription,
    setSortOption,
    setMostLikedFirst,
    setStopAuto,
  };

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};
