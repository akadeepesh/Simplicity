"use client";
import { dark, shadesOfPurple } from "@clerk/themes";
import React from "react";
import { useTheme } from "next-themes";
import { UserProfile } from "@clerk/nextjs";

const EditUser = () => {
  const { theme } = useTheme();
  return (
    <div className="flex flex-wrap justify-center max-w-screen-lg mx-auto my-5 sm:my-6 md:my-7 lg:my-9">
      <UserProfile
        appearance={{
          baseTheme: theme === "dark" ? dark : shadesOfPurple,
        }}
      />
    </div>
  );
};

export default EditUser;
