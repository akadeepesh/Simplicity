"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { ModeToggle } from "../theme/mode-toggle";
import UserNavigation from "./UserNavigation";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  // 3.5rem/56px is the height of the navbar mt-14 can be the margin top of the main content to touch the navbar
  return (
    <div>
      <div className="fixed top-0 left-0 right-0 flex backdrop-blur-sm justify-center py-[10px] border-b items-center font-bold z-50">
        <div className="flex w-full max-w-4xl justify-between items-center">
          <div
            onClick={() => router.push("/")}
            className="text-xl cursor-pointer font-serif"
          >
            Simplicity
          </div>
          <div className="flex gap-2">
            <ModeToggle />
            <SignInAndSignUpButtons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
