"use client";
import React, { useState, useContext, useRef, useEffect } from "react";
import {
  Authenticated,
  useMutation,
  useQuery,
  usePaginatedQuery,
} from "convex/react";
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
import { Skeleton } from "../ui/skeleton";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const PoetriesCollection = () => {
  let numOfPoetries = 5;
  const { filterData } = useContext(FilterContext) || {};
  const { poetries } =
    useQuery(api.poetry.getPoetry, { count: numOfPoetries }) ?? {};
  const { user } = useUser();
  const delPoetry = useMutation(api.poetry.deletePoetry);
  const likePoetry = useMutation(api.likes.LikePoetry);
  const dellikesbypoetry = useMutation(api.likes.DeleteAllLikesByPoetryId);
  const likesData = useQuery(api.likes.LikesData, {});
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const unlikePoetry = useMutation(api.likes.unlikePoetry);
  const [editPoetryId, setEditPoetryId] = useState<Id<"poetry"> | null>(null);
  const [passTitle, setPassTitle] = useState<string | null>(null);
  const [passDescription, setPassDescription] = useState<string | null>(null);
  const [passContent, setPassContent] = useState<string | null>(null);
  const [currentPoetryIndex, setCurrentPoetryIndex] = useState(0);
  const [views, setViews] = useState<number[]>([]);
  const poetryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timers = useRef<(NodeJS.Timeout | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = poetryRefs.current.indexOf(
          entry.target as HTMLDivElement
        );
        if (entry.isIntersecting) {
          timers.current[index] = setTimeout(() => {
            setViews((views) => {
              const newViews = [...views];
              newViews[index] = (newViews[index] || 0) + 1;
              console.log(
                `Poetry ${index} has been viewed ${newViews[index]} times.`
              );
              return newViews;
            });
          }, 5000);
        } else {
          clearTimeout(timers.current[index] as NodeJS.Timeout);
          timers.current[index] = null;
        }
      });
    });

    poetryRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      poetryRefs.current.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, []);

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

    if (isLiked) {
      await unlikePoetry({
        poetryId: poetryId,
      });
    } else {
      await likePoetry({
        poetryId: poetryId,
      });
    }
  };

  const handleCopyClick = async (content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedText(content);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  if (user === undefined || poetries === undefined) {
    return (
      <div className="flex-col space-y-10">
        <Skeleton className="flex h-[40vh] w-full" />
        <Skeleton className="flex h-[40vh] w-full" />
      </div>
    );
  }

  const DeletePoetryAndLikes = async (poetryId: Id<"poetry">) => {
    await delPoetry({ id: poetryId });
    await dellikesbypoetry({ poetryId: poetryId });
  };

  const handleCloseEdit = () => {
    setEditPoetryId(null);
  };

  const handleEdit = (
    poetryId: Id<"poetry">,
    title: string,
    description: string,
    content: string
  ) => {
    setEditPoetryId(poetryId);
    setPassTitle(title);
    setPassDescription(description);
    setPassContent(content);
  };

  if (!filterData) {
    return null;
  }

  const { hideTitle, hideDescription, sortOption, mostLikedFirst, stopAuto } =
    filterData;
  return (
    <>
      {editPoetryId ? (
        <EditPoetry
          poetryId={editPoetryId}
          title={passTitle}
          description={passDescription}
          content={passContent}
          onCloseEdit={handleCloseEdit}
        />
      ) : (
        <div className="">
          <div className="flex flex-col gap-2">
            {poetries?.map((poetry, index) => {
              const numLikes =
                likesData?.filter((like) => like.poetryId === poetry._id)
                  .length ?? 0;
              const isLiked = likesData?.some(
                (like) =>
                  like.poetryId === poetry._id && like.userId === user?.id
              );
              const showTitleAndDescription =
                !hideTitle &&
                !hideDescription &&
                (poetry.title || poetry.description || !stopAuto);
              return (
                <>
                  <div
                    key={poetry._id}
                    className="rounded-lg flex flex-col gap-8 p-6 group"
                    ref={(el) => (poetryRefs.current[index] = el)}
                  >
                    <div className="flex flex-col">
                      <div
                        className={`flex flex-row justify-between items-center`}
                      >
                        <div className="flex flex-col">
                          <div className="text-xl font-semibold">
                            {poetry.title
                              ? `${hideTitle ? "" : poetry.title}`
                              : `${stopAuto || hideTitle ? "" : "Simplicity"}`}
                          </div>
                          <div className="text-base text-muted-foreground">
                            {poetry.description
                              ? `${hideDescription ? "" : poetry.description}`
                              : `${stopAuto || hideDescription ? "" : "..."}`}
                          </div>
                        </div>
                        <Authenticated>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="rounded-md">
                              <div className="group-hover:opacity-80 opacity-0 flex text-muted-foreground p-3 rounded-2xl hover:bg-muted cursor-pointer transition-all duration-300">
                                <EllipsisVertical size={20} />
                              </div>
                            </DropdownMenuTrigger>
                            {poetry.username === user?.username ? (
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleEdit(
                                      poetry._id,
                                      poetry.title ?? "",
                                      poetry.description ?? "",
                                      poetry.content
                                    )
                                  }
                                  className="cursor-pointer"
                                >
                                  <div className="flex flex-row items-center justify-center gap-2">
                                    <Pencil size={15} />
                                    Edit
                                  </div>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    DeletePoetryAndLikes(poetry._id)
                                  }
                                  className="cursor-pointer bg-destructive"
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
                        </Authenticated>
                      </div>
                      {showTitleAndDescription && (
                        <div className="bg-gradient-to-r from-[#21bbdc] to-transparent my-2 h-[1px] w-full" />
                      )}
                    </div>
                    <div className="flex whitespace-pre-wrap leading-8 h-full font-light justify-center items-center">
                      {poetry.content}
                    </div>
                    {showTitleAndDescription && <Separator />}
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex flex-row gap-2 group-hover:opacity-100 opacity-0 text-muted-foreground transition-all duration-300">
                        <Authenticated>
                          <div
                            onClick={() => handleLikeClick(poetry._id)}
                            className="flex flex-row gap-2 items-center p-3 rounded-2xl hover:bg-secondary cursor-pointer"
                          >
                            <Heart
                              size={20}
                              className={
                                isLiked ? "fill-[#21bbdc] text-[#21bbdc]" : ""
                              }
                            />
                            <div>{numLikes}</div>
                          </div>
                        </Authenticated>
                        <div
                          onClick={() => handleCopyClick(poetry.content)}
                          className="flex flex-row gap-2 items-center p-3 rounded-2xl hover:bg-secondary cursor-pointer"
                        >
                          {copiedText === poetry.content ? (
                            <CircleCheck size={20} className="text-green-500" />
                          ) : (
                            <Clipboard size={20} />
                          )}
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
          <div className="flex w-full justify-center items-center">
            <Button onClick={() => (numOfPoetries += 5)}>Load More</Button>
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
                    className="group-hover:text-[#21bbdc] transition-all duration-300"
                    size={20}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <div>Next Poetry</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>
        </div>
      )}
    </>
  );
};

export default PoetriesCollection;
