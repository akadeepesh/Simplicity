"use client";
import React, { useState, useContext, useRef } from "react";
import { Authenticated, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Clipboard,
  Flag,
  Heart,
  CircleCheck,
  EllipsisVertical,
  Pencil,
  Trash2,
  ChevronDown,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import EditPoetry from "./edit-poetry";
import { Separator } from "../ui/separator";
import { FilterContext } from "./FilterContext";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "../ui/skeleton";
import Report from "./report-poetry";
import UnauthenticatedUserPage from "./unauthenticated-users";
import { SearchContext } from "./SearchContext";

const LikedItems = () => {
  const { user } = useUser();
  const userload = useUser().isLoaded;
  const delPoetry = useMutation(api.poetry.deletePoetry);
  const likePoetry = useMutation(api.likes.LikePoetry);
  const likedPoetries = useQuery(api.poetry.getLikedPoetries);
  const dellikesbypoetry = useMutation(api.likes.DeleteAllLikesByPoetryId);
  const likesData = useQuery(api.likes.LikesData, {});
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const unlikePoetry = useMutation(api.likes.unlikePoetry);
  const [currentPoetryIndex, setCurrentPoetryIndex] = useState(0);
  const poetryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentOpenId, setCurrentOpenId] = useState<Id<"poetry"> | null>(null);
  const { filterData } = useContext(FilterContext) || {};
  const { hideTitle, hideDescription, stopAuto } = filterData ?? {}; // sortOption, mostLikedFirst, will be added later
  const { searchQuery } = useContext(SearchContext) || {};

  const filteredPoetries = likedPoetries?.filter((poetry) =>
    !searchQuery
      ? true
      : new RegExp(searchQuery, "i").test(poetry?.title || "") ||
        new RegExp(searchQuery, "i").test(poetry?.description || "") ||
        new RegExp(searchQuery, "i").test(poetry?.content || "") ||
        new RegExp(searchQuery, "i").test(poetry?.username || "")
  );

  if (filteredPoetries?.length === 0 && searchQuery) {
    return (
      <UnauthenticatedUserPage
        ErrorMessage="No poetry found"
        className="h-[calc(100vh-13rem)]"
      />
    );
  }
  if (!likedPoetries || !userload) {
    return (
      <div className="flex-col space-y-10">
        <Skeleton className="flex h-[40vh] w-full" />
        <Skeleton className="flex h-[40vh] w-full" />
      </div>
    );
  }

  const scrollToPoetry = (index: number) => {
    const ref = poetryRefs.current[index];
    if (ref) {
      const offset = 80;
      const top = ref.offsetTop - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleButtonClick = () => {
    setCurrentPoetryIndex((currentPoetryIndex) => {
      const nextPoetryIndex =
        (currentPoetryIndex + 1) % poetryRefs.current.length;
      scrollToPoetry(nextPoetryIndex);
      return nextPoetryIndex;
    });
  };
  const handleLikeClick = async (poetryId: Id<"poetry">) => {
    const isLiked = likesData?.some(
      (like) => like.poetryId === poetryId && like.userId === user?.id
    );

    isLiked
      ? await unlikePoetry({ poetryId: poetryId })
      : await likePoetry({ poetryId: poetryId });
  };

  const handleCopyClick = async (content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedText(content);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  const DeletePoetryAndLikes = async (poetryId: Id<"poetry">) => {
    await delPoetry({ id: poetryId });
    await dellikesbypoetry({ poetryId: poetryId });
  };
  return (
    <>
      <div className="flex flex-col gap-2">
        {filteredPoetries?.map((poetry, index) => {
          const numLikes =
            likesData?.filter((like) => like.poetryId === poetry?._id).length ??
            0;
          const isLiked = likesData?.some(
            (like) => like.poetryId === poetry?._id && like.userId === user?.id
          );
          const showTitleAndDescription =
            !hideTitle &&
            !hideDescription &&
            (poetry?.title || poetry?.description || !stopAuto);
          return (
            <div key={poetry?._id}>
              <div
                className="rounded-lg flex flex-col gap-8 p-6 group"
                ref={(el) => (poetryRefs.current[index] = el)}
              >
                <div className="flex flex-col">
                  <div className={`flex flex-row justify-between items-center`}>
                    <div className="flex flex-col">
                      <div className="text-xl font-semibold">
                        {poetry?.title
                          ? `${hideTitle ? "" : poetry.title}`
                          : `${stopAuto || hideTitle ? "" : "Simplicity"}`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {poetry?.description
                          ? `${hideDescription ? "" : poetry.description}`
                          : `${stopAuto || hideDescription ? "" : "..."}`}
                      </div>
                    </div>
                    <Authenticated>
                      <Dialog
                        open={poetry?._id === currentOpenId}
                        onOpenChange={(isOpen) =>
                          isOpen
                            ? setCurrentOpenId(poetry?._id || null)
                            : setCurrentOpenId(null)
                        }
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild className="rounded-md">
                            <div className="group-hover:opacity-80 opacity-0 flex text-muted-foreground p-3 rounded-2xl hover:bg-muted cursor-pointer transition-all duration-300">
                              <EllipsisVertical size={20} />
                            </div>
                          </DropdownMenuTrigger>
                          {poetry?.username === user?.username ? (
                            <DropdownMenuContent>
                              <DialogTrigger className="w-full">
                                <DropdownMenuItem className="cursor-pointer">
                                  <div className="flex flex-row items-center justify-center gap-2">
                                    <Pencil size={15} />
                                    Edit
                                  </div>
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  poetry?._id &&
                                  DeletePoetryAndLikes(poetry._id)
                                }
                                className="cursor-pointer bg-destructive md:bg-inherit md:hover:bg-destructive"
                              >
                                <div className="flex flex-row items-center justify-center gap-2">
                                  <Trash2 size={15} />
                                  Delete
                                </div>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          ) : (
                            <DropdownMenuContent>
                              <DropdownMenuItem className="cursor-pointer bg-destructive">
                                <div className="flex flex-row items-center justify-center gap-2">
                                  <Flag size={15} />
                                  Report
                                </div>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          )}
                        </DropdownMenu>

                        {poetry?.username === user?.username ? (
                          <DialogContent className=" border-bluePrimary">
                            <EditPoetry
                              poetryId={poetry?._id as Id<"poetry">}
                              title={poetry?.title ?? null}
                              description={poetry?.description ?? null}
                              content={poetry?.content ?? null}
                              closeDialog={() => setCurrentOpenId(null)}
                            />
                          </DialogContent>
                        ) : (
                          <DialogContent className="border-bluePrimary">
                            <div className="flex flex-col gap-2 p-4">
                              <div className="text-lg font-semibold">
                                Report
                              </div>
                              <Report poetryId={poetry?._id as Id<"poetry">} />
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                    </Authenticated>
                  </div>
                  {showTitleAndDescription && (
                    <div className="bg-gradient-to-r from-bluePrimary to-transparent my-2 h-[1px] w-full" />
                  )}
                </div>
                <div className="flex whitespace-pre-wrap leading-8 h-full font-light items-center">
                  {poetry?.content}
                </div>
                {showTitleAndDescription && <Separator />}
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row gap-2 group-hover:opacity-100 opacity-0 text-muted-foreground transition-all duration-300">
                    <Authenticated>
                      <div
                        onClick={() =>
                          handleLikeClick(poetry?._id as Id<"poetry">)
                        }
                        className="flex flex-row gap-2 items-center p-3 rounded-2xl hover:bg-secondary cursor-pointer"
                      >
                        <Heart
                          size={20}
                          className={
                            isLiked ? "fill-bluePrimary text-bluePrimary" : ""
                          }
                        />
                        <div>{numLikes}</div>
                      </div>
                    </Authenticated>
                    <div
                      onClick={() => handleCopyClick(poetry?.content ?? "")}
                      className="flex flex-row gap-2 items-center p-3 rounded-2xl hover:bg-secondary cursor-pointer"
                    >
                      {copiedText === poetry?.content ? (
                        <CircleCheck size={20} className="text-green-500" />
                      ) : (
                        <Clipboard size={20} />
                      )}
                    </div>
                  </div>
                  <div className="text-muted-foreground">
                    ~{poetry?.username}
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-12 h-[1px] w-full" />
            </div>
          );
        })}
      </div>
      <Button
        onClick={handleButtonClick}
        size={"icon"}
        className="fixed group bottom-8 right-8 bg-transparent hover:bg-secondary transition-all duration-300 text-primary z-10"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <ChevronDown
                className="group-hover:text-bluePrimary transition-all duration-300"
                size={20}
              />
            </TooltipTrigger>
            <TooltipContent>
              <div>Next Poetry</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Button>
    </>
  );
  // } else {
  //   return (
  //     <div className="flex-col space-y-10">
  //       <Skeleton className="flex h-[40vh] w-full" />
  //       <Skeleton className="flex h-[40vh] w-full" />
  //     </div>
  //   );
  // }
};

export default LikedItems;
