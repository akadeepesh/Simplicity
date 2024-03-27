"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { ModeToggle } from "../theme/mode-toggle";
import UserNavigation from "./UserNavigation";
import Link from "next/link";
import { Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
import { useSelectedLayoutSegments } from "next/navigation";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

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
            <div className="text-xl cursor-pointer tracking-wide hover:tracking-widest transition-all duration-300 hover:text-blue-500">
              Simplicity
            </div>
          </Link>
          <div className="flex gap-2">
            {isHomePage && (
              <Sheet>
                <SheetTrigger>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Filter
                          className="hover:text-blue-500 transition-all duration-300"
                          size={20}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add Filters</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </SheetTrigger>
                <SheetContent className="flex flex-col gap-4">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <Separator />
                  </SheetHeader>
                  {/* <SheetDescription> */}
                  <div className="flex items-center space-x-2 mt-4">
                    <Label htmlFor="order">Descending Order</Label>
                    <Switch id="order" checked />
                  </div>
                  {/* </SheetDescription> */}
                </SheetContent>
              </Sheet>
            )}
            <ModeToggle />
            <SignInAndSignUpButtons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
