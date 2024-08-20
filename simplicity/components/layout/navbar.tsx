"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { ModeToggle } from "../theme/mode-toggle";
import UserNavigation from "./UserNavigation";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import SideBar from "./side-bar";
import SearchBox from "./search-box";
import { AfterSSR } from "../helpers/AfterSSR";
import { Plus } from "lucide-react";

function SignInAndSignUpButtons() {
  return (
    <div className="flex gap-4">
      <Authenticated>
        <UserNavigation />
      </Authenticated>
      <Unauthenticated>
        <SignInButton mode="modal">
          <div className="">
            <div className="hidden md:flex">
              <Button variant="ghost">Sign in</Button>
            </div>
            <div className="flex md:hidden">
              <Button>Sign in</Button>
            </div>
          </div>
        </SignInButton>
        <div className="hidden md:flex">
          <SignUpButton mode="modal">
            <Button>Sign up</Button>
          </SignUpButton>
        </div>
      </Unauthenticated>
    </div>
  );
}

const Navbar = () => {
  const segments = useSelectedLayoutSegments();
  const ShowFilters =
    segments.length === 0 ||
    segments.includes("liked") ||
    segments.includes("posts");

  return (
    <div>
      <div className="sticky top-0 left-5 right-5 md:left-0 md:right-0 flex backdrop-blur-sm justify-center py-[10px] border-b items-center z-50">
        <div className="flex gap-2 w-full md:max-w-3xl lg:max-w-4xl max-w-xs sm:max-w-sm xxs:max-w-md xs:max-w-sm justify-between items-center">
          <Link className="flex" href="/">
            <div className="font-basic text-xl cursor-pointer tracking-wide hover:tracking-widest transition-all duration-300 hover:text-bluePrimary">
              Simplicity
            </div>
          </Link>
          <div className="flex">{ShowFilters && <SearchBox />}</div>
          <div className="flex md:gap-2 items-center">
            {ShowFilters && <SideBar />}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="hidden md:flex">
                  <Link href="/post">
                    <Button variant="ghost" size="sm" className="p-2">
                      <Plus size={"1rem"} />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Post Poetry</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AfterSSR>
              <ModeToggle />
            </AfterSSR>
            <SignInAndSignUpButtons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
