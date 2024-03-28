"use client";
import React, { useState } from "react";
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
import { Filter } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

const SideBar = () => {
  const [orderByDate, setOrderByDate] = useState<boolean>(true);
  const [orderByLikes, setOrderByLikes] = useState<boolean>(false);
  const [mostLikedFirst, setMostLikedFirst] = useState<boolean>(true);
  const [hideTitle, setHideTitle] = useState<boolean>(false);
  const [hideDescription, setHideDescription] = useState<boolean>(false);
  const [stopAuto, setStopAuto] = useState<boolean>(false);
  return (
    <div className="mt-1">
      <Sheet>
        <SheetTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Filter
                  className="hover:text-blue-500 transition-all duration-300"
                  size={20}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div>Add Filters</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-8 w-72">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <Separator className="bg-blue-500" />
          </SheetHeader>
          <div className="flex flex-row justify-between">
            <div className="text-sm underline underline-offset-2">
              Your Posts
            </div>
            <Separator orientation="vertical" className="bg-blue-500" />
            <div className="text-sm underline underline-offset-2">
              Liked Posts
            </div>
          </div>
          <Separator className="bg-blue-500" />
          <Card>
            <CardHeader className="gap-2">
              <CardTitle>Order by</CardTitle>
              <Separator className="bg-blue-500" />
            </CardHeader>
            <CardContent>
              <div
                className={`flex flex-col gap-6 duration-300 ${
                  orderByLikes ? "h-[110px]" : "h-[70px]"
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
                    checked={orderByDate && !orderByLikes}
                    onClick={() => setOrderByDate(!orderByDate)}
                  />
                </div>
                <div className="flex items-center space-x-2 justify-between">
                  <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Likes
                  </Label>
                  <Checkbox
                    checked={orderByLikes}
                    onClick={() => setOrderByLikes(!orderByLikes)}
                  />
                </div>
                <div
                  className={`flex items-center justify-between duration-200 ${
                    orderByLikes ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Label className="text-[13px] text-muted-foreground select-none">
                    Most Liked First
                  </Label>
                  <Switch
                    className="disabled:cursor-auto"
                    disabled={!orderByLikes}
                    checked={mostLikedFirst}
                    onClick={() => setMostLikedFirst(!mostLikedFirst)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Separator />
          <Card>
            <CardHeader className="gap-2">
              <CardTitle>Title &amp; Description</CardTitle>
              <Separator className="bg-blue-500" />
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
                    onClick={() => setHideTitle(!hideTitle)}
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
                    onClick={() => setHideDescription(!hideDescription)}
                  />
                </div>
                <div className="flex items-center w-full justify-between">
                  <div className="flex flex-col w-2/3">
                    <Label className="text-sm" htmlFor="order">
                      Auto Title &amp; Description
                    </Label>
                    <Label className="text-xs text-muted-foreground">
                      Don&apos;t Append Auto Title &amp; Description
                    </Label>
                  </div>
                  <Switch
                    checked={stopAuto}
                    onClick={() => setStopAuto(!stopAuto)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SideBar;
