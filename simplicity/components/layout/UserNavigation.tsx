"use client";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter } from "next/navigation";
import {
  Star,
  User,
  Album,
  Home,
  AlertCircle,
  StickyNote,
  LogOut,
} from "lucide-react";
import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";

const UserNavigation = () => {
  const { user } = useUser();
  const router = useRouter();
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full">
          <UserButton />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="">
          <DropdownMenuLabel className="text-blue-500/80 text-base">
            @{user?.username}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={() => {
              router.push(`/profile/${user?.username}`);
            }}
          >
            <span>
              <User size={"1.2rem"} />
            </span>
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={() => {
              router.push(`/profile/${user?.username}/posts`);
            }}
          >
            <span>
              <Album size={"1.2rem"} />
            </span>
            <span>Your Posts</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={() => {
              router.push(`/profile/${user?.username}/liked`);
            }}
          >
            <span>
              <Star size={"1.2rem"} />
            </span>
            <span>Liked Items</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer gap-1"
            onClick={() => {
              router.push(`/post`);
            }}
          >
            <span>
              <StickyNote size={"1.2rem"} />
            </span>
            <span>Post Poetry</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer gap-1"
            onClick={() => {
              router.push(`/profile/${user?.username}/support`);
            }}
          >
            <span>
              <AlertCircle size={"1.2rem"} />
            </span>
            <span>Support</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer gap-1"
            onClick={() => {
              router.push(`/`);
            }}
          >
            <span>
              <Home size={"1.2rem"} />
            </span>
            <span>Home Page</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <SignOutButton>
            <DropdownMenuItem className="cursor-pointer items-center justify-center flex flex-row gap-2 bg-destructive">
              Sign Out <LogOut size={"1rem"} />
            </DropdownMenuItem>
          </SignOutButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserNavigation;
