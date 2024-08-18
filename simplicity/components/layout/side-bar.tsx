"use client";
import React, { useContext } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Settings } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { FilterContext, SortOptions } from "./FilterContext";
import { Link } from "../typography/link";
import { useUser } from "@clerk/clerk-react";
import { Authenticated } from "convex/react";
import { useSelectedLayoutSegments } from "next/navigation";

const SideBar = () => {
  const { user } = useUser();
  const {
    filterData,
    setHideTitle,
    setHideDescription,
    setSortOption,
    setMostLikedFirst,
    setStopAuto,
  } = useContext(FilterContext) || {};

  const { hideTitle, hideDescription, sortOption, mostLikedFirst, stopAuto } =
    filterData ?? {};
  const segments = useSelectedLayoutSegments();
  const ShowSorting = segments.length === 0;
  return (
    <Sheet>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button size="sm" variant="ghost" className="p-2">
                <Settings size="1rem" />
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <div>Add Filters</div>
          </TooltipContent>
        </Tooltip>
        <SheetContent className="flex flex-col gap-8 w-72">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <Separator className="bg-bluePrimary" />
          </SheetHeader>
          <Authenticated>
            <div className="flex flex-row justify-between">
              <Link href={`/profile/${user?.username}/posts`}>
                <div className="text-sm">Your Posts</div>
              </Link>
              <Separator orientation="vertical" className="bg-bluePrimary" />
              <Link href={`/profile/${user?.username}/liked`}>
                <div className="text-sm">Liked Posts</div>
              </Link>
            </div>
            <Separator className="bg-bluePrimary" />
          </Authenticated>
          {ShowSorting && (
            <Card>
              <CardHeader className="gap-2">
                <CardTitle className="flex flex-row gap-2 items-end">
                  Sort by{" "}
                  <span className="text-muted-foreground text-xs">
                    (In Development)
                  </span>
                </CardTitle>
                <Separator className="bg-bluePrimary" />
              </CardHeader>
              <CardContent>
                <div
                  className={`flex flex-col gap-6 duration-300 ${
                    sortOption === SortOptions.Likes ? "h-[110px]" : "h-[70px]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <Label className="text-sm" htmlFor="order">
                        Date
                      </Label>
                      <Label className="text-xs text-muted-foreground">
                        Latest First
                      </Label>
                    </div>
                    <Switch
                      checked={sortOption === SortOptions.Date}
                      onClick={() =>
                        setSortOption?.(
                          sortOption === SortOptions.Date
                            ? SortOptions.None
                            : SortOptions.Date
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2 justify-between">
                    <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Likes
                    </Label>
                    <Checkbox
                      checked={sortOption === SortOptions.Likes}
                      onClick={() =>
                        setSortOption?.(
                          sortOption === SortOptions.Likes
                            ? SortOptions.None
                            : SortOptions.Likes
                        )
                      }
                    />
                  </div>
                  <div
                    className={`flex items-center justify-between duration-200 ${
                      sortOption === SortOptions.Likes
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <Label className="text-[13px] text-muted-foreground select-none">
                      Most Liked First
                    </Label>
                    <Switch
                      className="disabled:cursor-auto"
                      checked={mostLikedFirst}
                      onClick={() => setMostLikedFirst?.(!mostLikedFirst)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {ShowSorting && <Separator />}
          <Card>
            <CardHeader className="gap-2">
              <CardTitle>Title &amp; Description</CardTitle>
              <Separator className="bg-bluePrimary" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <Label className="text-sm">Title</Label>
                    <Label className="text-xs text-muted-foreground">
                      Hide Title
                    </Label>
                  </div>
                  <Switch
                    checked={hideTitle}
                    onClick={() => setHideTitle?.(!hideTitle)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <Label className="text-sm" htmlFor="order">
                      Description
                    </Label>
                    <Label className="text-xs text-muted-foreground">
                      Hide Description
                    </Label>
                  </div>
                  <Switch
                    checked={hideDescription}
                    onClick={() => setHideDescription?.(!hideDescription)}
                  />
                </div>
                <div className="flex items-center w-full justify-between">
                  <div className="flex flex-col w-2/3">
                    <Label className="text-sm" htmlFor="order">
                      Auto Title &amp; Description
                    </Label>
                    <Label className="text-xs text-muted-foreground">
                      Don&apos;t Show Auto Title &amp; Description
                    </Label>
                  </div>
                  <Switch
                    checked={!(hideTitle && hideDescription) && stopAuto}
                    disabled={hideTitle && hideDescription}
                    onClick={() => setStopAuto?.(!stopAuto)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </SheetContent>
      </TooltipProvider>
    </Sheet>
  );
};

export default SideBar;
