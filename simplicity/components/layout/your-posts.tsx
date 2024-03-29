import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const YourPosts = () => {
  const userPoetries = useQuery(api.poetry.getViewerPoetries);
  return (
    <div className="max-w-xl w-full rounded-none md:rounded-2xl mx-auto p-4 md:p-8 mt-20 z-10">
      <div className="flex flex-col gap-2">
        {userPoetries?.poetries.map((poetry) => (
          <>
            <div
              key={poetry._id}
              className="rounded-lg flex flex-col h-[70vh] justify-center items-center gap-8"
            >
              <div className="">
                <div className="text-xl font-bold">
                  {poetry.title ? poetry.title : "Untitled"}
                </div>
                <div className="text-base text-muted-foreground">
                  {poetry.description ? poetry.description : "..."}
                </div>
              </div>
              <div className="whitespace-pre-wrap leading-8 font-sans">
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
