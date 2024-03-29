"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";

const Liked = () => {
  const likedPoetries = useQuery(api.poetry.getLikedPoetries);
  return (
    <div className="max-w-xl w-full rounded-none md:rounded-2xl mx-auto p-4 md:p-8 mt-20 z-10">
      <div className="flex flex-col gap-2">
        {likedPoetries?.map((poetry) => (
          <>
            <div
              key={poetry?._id}
              className="rounded-lg flex flex-col h-[70vh] justify-center items-center gap-8"
            >
              <div className="">
                <div className="text-xl font-bold">
                  {poetry?.title ? poetry.title : "Untitled"}
                </div>
                <div className="text-base text-muted-foreground">
                  {poetry?.description ? poetry.description : "..."}
                </div>
              </div>
              <div className="whitespace-pre-wrap leading-8 font-sans">
                {poetry?.content}
              </div>
            </div>
            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-12 h-[1px] w-full" />
          </>
        ))}
      </div>
    </div>
  );
};

export default Liked;
