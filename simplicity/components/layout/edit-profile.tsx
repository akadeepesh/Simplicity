"use client";
import { dark, shadesOfPurple } from "@clerk/themes";
import React from "react";
import { useTheme } from "next-themes";
import { useUser, UserProfile } from "@clerk/nextjs";
import { NextSeo } from "next-seo";

const EditUser = () => {
  const { theme } = useTheme();
  const { user, isLoaded } = useUser();
  return (
    <div className="flex flex-wrap justify-center max-w-screen-lg mx-auto my-20 sm:my-24 md:my-28 lg:my-36">
      <NextSeo
        title={isLoaded ? `${user?.fullName} | Profile Edit` : "Loading..."}
        description="Pizza Theater is an Pizza ordering app that allows you to order your favorite pizza from the comfort of your home."
        canonical="https://pizza-theater.vercel.app/"
        openGraph={{
          url: "https://pizza-theater.vercel.app/",
          title: "Pizza Theater",
          description:
            "Pizza Theater is an Pizza ordering app that allows you to order your favorite pizza from the comfort of your home.",
          siteName: "Pizza Theater",
        }}
      />
      <UserProfile
        appearance={{
          baseTheme: theme === "dark" ? dark : shadesOfPurple,
        }}
      />
    </div>
  );
};

export default EditUser;
