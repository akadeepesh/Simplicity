"use client";
import React, { createContext, useState } from "react";

interface FilterData {
  hideTitle: boolean;
  hideDescription: boolean;
  orderByDate: boolean;
  orderByLikes: boolean;
  mostLikedFirst: boolean;
  stopAuto: boolean;
}

interface FilterContextProps {
  filterData: FilterData;
  setHideTitle: React.Dispatch<React.SetStateAction<boolean>>;
  setHideDescription: React.Dispatch<React.SetStateAction<boolean>>;
  setOrderByDate: React.Dispatch<React.SetStateAction<boolean>>;
  setOrderByLikes: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [orderByDate, setOrderByDate] = useState<boolean>(true);
  const [orderByLikes, setOrderByLikes] = useState<boolean>(false);
  const [mostLikedFirst, setMostLikedFirst] = useState<boolean>(true);
  const [stopAuto, setStopAuto] = useState<boolean>(false);

  const filterData: FilterData = {
    hideTitle,
    hideDescription,
    orderByDate,
    orderByLikes,
    mostLikedFirst,
    stopAuto,
  };

  const contextValue: FilterContextProps = {
    filterData,
    setHideTitle,
    setHideDescription,
    setOrderByDate,
    setOrderByLikes,
    setMostLikedFirst,
    setStopAuto,
  };

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};
