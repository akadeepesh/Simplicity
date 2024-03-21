"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Clipboard, Flag, Heart, CircleCheck } from "lucide-react";

interface Poetry {
  id: Id;
  username: string;
  title: string | null;
  description: string | null;
  content: string;
}

const SignedInContent = () => {
  const poetries = useQuery(api.poetry.getPoetry) as Poetry[];
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopyClick = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedText(content);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };
  return (
    <div className="">
      <div className="flex flex-col gap-2">
        {poetries?.map((poetry) => (
          <>
            <div
              key={poetry.id}
              className="rounded-lg flex flex-col gap-8 p-6 group"
            >
              <div className="flex flex-col">
                <div className={`flex flex-row justify-between items-center`}>
                  <div className="flex flex-col">
                    <div className="text-xl font-bold">
                      {poetry.title ? poetry.title : "Simplicity"}
                    </div>
                    <div className="text-base text-muted-foreground">
                      {poetry.description ? poetry.description : "..."}
                    </div>
                  </div>
                  <div
                    onClick={() => handleCopyClick(poetry.content)}
                    className="group-hover:flex hidden text-muted-foreground p-3 rounded-2xl hover:bg-muted cursor-pointer"
                  >
                    {copiedText === poetry.content ? (
                      <CircleCheck size={20} className="text-green-500" />
                    ) : (
                      <Clipboard size={20} />
                    )}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-transparent my-2 h-[1px] w-full" />
              </div>
              <div className="flex whitespace-pre-wrap leading-8 font-Alkatra h-full justify-center items-center">
                {poetry.content}
              </div>
              <div className="bg-secondary my-2 h-[1px] w-full" />
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row gap-2">
                  <div className="flex flex-row gap-2 items-center p-3 rounded-2xl hover:bg-secondary cursor-pointer">
                    <Heart size={20} />
                    <div>0</div>
                  </div>
                  <div className="flex flex-row gap-2 items-center p-3 rounded-2xl hover:bg-secondary cursor-pointer">
                    <Flag size={20} />
                  </div>
                </div>
                <div className="text-muted-foreground">~{poetry.username}</div>
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
