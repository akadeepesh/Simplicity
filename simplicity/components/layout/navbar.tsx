"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { ModeToggle } from "../theme/mode-toggle";
import UserNavigation from "./UserNavigation";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import SideBar from "./side-bar";
import SearchBox from "./search-box";

function SignInAndSignUpButtons() {
  return (
    <div className="flex gap-4">
      <Authenticated>
        <UserNavigation />
      </Authenticated>
      <Unauthenticated>
        <SignInButton mode="modal">
          <Button variant="ghost">Sign in</Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button>Sign up</Button>
        </SignUpButton>
      </Unauthenticated>
    </div>
  );
}

const Navbar = () => {
  const segments = useSelectedLayoutSegments();
  const isHomePage = segments.length === 0;

  return (
    <div>
      <div className="fixed top-0 left-5 right-5 md:left-0 md:right-0 flex backdrop-blur-sm justify-center py-[10px] border-b items-center font-bold z-50">
        <div className="flex w-full max-w-4xl justify-between items-center">
          <Link href="/">
            <div className="text-xl cursor-pointer tracking-wide hover:tracking-widest transition-all duration-300 hover:text-[#21bbdc]">
              Simplicity
            </div>
          </Link>
          <SearchBox />
          <div className="flex gap-2 items-center">
            {isHomePage && <SideBar />}
            <ModeToggle />
            <SignInAndSignUpButtons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
