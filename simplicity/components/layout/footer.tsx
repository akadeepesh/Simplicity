"use client";
import React from "react";
import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Link } from "../typography/link";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton } from "@clerk/clerk-react";

const Footer = () => {
  const router = useRouter();
  return (
    <div>
      <div className="bottom-0 left-0 flex backdrop-blur-sm justify-center py-2 border-t mt-5 items-center font-serif font-bold">
        <div className="flex w-full max-w-4xl justify-center items-center gap-3">
          <div className="flex flex-col">
            <div className="text-xl">Is there no one to hear you?</div>
            <Authenticated>
              <Link href={"/post"} className="text-muted-foreground w-fit">
                Post your ceativity
              </Link>
            </Authenticated>
            <Unauthenticated>
              <SignInButton mode="modal">
                <div className="text-sm text-muted-foreground w-fit underline underline-offset-4 hover:no-underline cursor-pointer">
                  Sign in to post your story
                </div>
              </SignInButton>
            </Unauthenticated>
          </div>
          <Authenticated>
            <div
              onClick={() => router.push("/post")}
              className="hover:bg-secondary rounded p-1 cursor-pointer"
            >
              <MoveRight size={30} className="p-1" />
            </div>
          </Authenticated>
        </div>
      </div>
    </div>
  );
};

export default Footer;
