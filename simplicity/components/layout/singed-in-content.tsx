"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const SignedInContent = () => {
  const poetries = useQuery(api.poetry.getPoetry) as any[];
  return (
    <div className="">
      <div className="flex flex-col gap-2">
        {poetries?.map((poetry) => (
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

export default SignedInContent;
