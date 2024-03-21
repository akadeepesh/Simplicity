"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Copy, Flag, Heart } from "lucide-react";

interface Poetry {
  id: Id;
  username: string;
  title: string | null;
  description: string | null;
  content: string;
}

const SignedInContent = () => {
  const poetries = useQuery(api.poetry.getPoetry) as Poetry[];
  return (
    <div className="">
      <div className="flex flex-col gap-2">
        {poetries.map((poetry) => (
          <>
            <div
              key={poetry.id}
              className="rounded-lg flex flex-col h-[70vh] hover:bg-secondary/30 gap-8 p-6 group"
            >
              <div
                className={`flex flex-row border-blue-500 justify-between items-center ${
                  poetry.title || poetry.description ? "border-b pb-2" : ""
                }`}
              >
                <div className="flex flex-col">
                  <div className="text-xl font-bold">{poetry.title}</div>
                  <div className="text-base text-muted-foreground">
                    {poetry.description}
                  </div>
                </div>
                <div className="group-hover:flex hidden">
                  <Copy />
                </div>
              </div>
              <div className="flex whitespace-pre-wrap leading-8 font-Alkatra h-full justify-center items-center">
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
