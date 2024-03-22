"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";

const YourPosts = () => {
  const { user } = useUser();
  const poetries = useQuery(api.poetry.getPoetry);
  return (
    <div className="">
      <div className="flex flex-col gap-2">
        {poetries?.poetries
          .filter(
            (poetry: { username: string | null | undefined }) =>
              poetry.username === user?.username
          )
          .map((poetry) => (
            <>
              <div
                key={poetry.id}
                className="rounded-lg flex flex-col h-[70vh] justify-center items-center hover:bg-secondary/30 gap-8"
              >
                <div className="">
                  <div className="text-xl font-bold">{poetry.title}</div>
                  <div className="text-base text-muted-foreground">
                    {poetry.description}
                  </div>
                </div>
                <div className="whitespace-pre-wrap leading-8 font-Alkatra">
                  {poetry.content}
                </div>
              </div>
              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-12 h-[1px] w-full" />
            </>
          ))}
      </div>
    </div>
  );
};

export default YourPosts;
