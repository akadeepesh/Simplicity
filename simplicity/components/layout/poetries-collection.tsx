"use client";
import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Clipboard, Flag, Heart, CircleCheck } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const PoetriesCollection = () => {
  const { viewer, poetries } = useQuery(api.poetry.getPoetry) ?? {};
  const likePoetry = useMutation(api.likes.LikePoetry);
  const likesData = useQuery(api.likes.NumberOfLikes, {});
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const unlikePoetry = useMutation(api.likes.UnlikePoetry);

  const handleLikeClick = async (poetryId: Id<"poetry">) => {
    const isLiked = likesData?.some(
      (like) => like.poetryId === poetryId && like.userId === viewer?.subject
    );

    try {
      if (isLiked) {
        await unlikePoetry({
          poetryId: poetryId,
          userId: viewer?.subject ?? "",
        });
      } else {
        await likePoetry({
          poetryId: poetryId,
          userId: viewer?.subject ?? "",
        });
      }
    } catch (error) {
      console.error("Error liking/unliking poetry:", error);
    }
  };

  const handleCopyClick = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedText(content);
      setTimeout(() => {
        setCopiedText(null);
      }, 2000);
    } catch (error) {
      console.error("Error copying text:", error);
    }
  };

  if (viewer === undefined || poetries === undefined) {
    return (
      <div className="flex-col space-y-10">
        <Skeleton className="flex h-[40vh] w-full" />
        <Skeleton className="flex h-[40vh] w-full" />
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-col gap-2">
        {poetries?.map((poetry) => {
          const numLikes =
            likesData?.filter((like) => like.poetryId === poetry._id).length ??
            0;
          const isLiked = likesData?.some(
            (like) =>
              like.poetryId === poetry._id && like.userId === viewer?.subject
          );
          return (
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
                      className="group-hover:opacity-80 opacity-0 flex text-muted-foreground p-3 rounded-2xl hover:bg-muted cursor-pointer transition-all duration-300"
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
                <div className="bg-secondary mt-2 h-[1px] w-full" />
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row gap-2 group-hover:opacity-100 opacity-0 text-muted-foreground transition-all duration-300">
                    <div
                      onClick={async () => {
                        try {
                          await handleLikeClick(poetry._id);
                        } catch (error) {
                          console.error("Error in onClick handler:", error);
                        }
                      }}
                      className="flex flex-row gap-2 items-center p-3 rounded-2xl hover:bg-secondary cursor-pointer"
                    >
                      <Heart
                        size={20}
                        className={
                          isLiked === true ? "fill-blue-500 text-blue-500" : ""
                        }
                      />
                      <div>{numLikes}</div>
                    </div>
                    <div className="flex flex-row gap-2 items-center p-3 rounded-2xl hover:bg-secondary cursor-pointer">
                      <Flag size={20} />
                    </div>
                  </div>
                  <div className="text-muted-foreground">
                    ~{poetry.username}
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-12 h-[1px] w-full" />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default PoetriesCollection;
