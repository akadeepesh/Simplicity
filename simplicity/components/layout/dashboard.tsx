"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { MoveRight, ShieldCheck, BadgeCheck, Album, Star } from "lucide-react";
import Link from "next/link";
export const Dashboard = () => {
  const { user } = useUser();
  return (
    <div className="flex justify-center items-center mt-10 sm:mt-12 md:mt-14 lg:mt-18">
      <div className="flex max-w-xs xs:max-w-sm xxs:max-w-md md:max-w-xl w-full flex-col gap-10">
        <Link href={`/profile/${user?.username}/liked`}>
          <Card className="h-fit w-full border-transparent hover:border-bluePrimary group cursor-pointer transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center justify-center gap-4">
                <Star className="size-10 group-hover:text-bluePrimary" />
                <div className="flex flex-col gap-2">
                  <CardTitle className="font-Anta">Liked Posts</CardTitle>
                  <CardDescription className="font-Annapura">
                    Find your favorite poetries and manage your wishlist
                  </CardDescription>
                </div>
              </div>
              <div className="flex w-fit mr-5 group-hover:mr-0 group-hover:text-bluePrimary transition-all duration-300">
                <MoveRight />
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Link href={`/profile/${user?.username}/posts`}>
          <Card className="h-fit w-full border-transparent hover:border-bluePrimary group cursor-pointer transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center justify-center gap-4">
                <Album className="size-10 group-hover:text-bluePrimary" />
                <div className="flex flex-col gap-2">
                  <CardTitle className="font-Anta">Your Posts</CardTitle>
                  <CardDescription className="font-Annapura ">
                    Manage and view your posts
                  </CardDescription>
                </div>
              </div>
              <div className="flex w-fit mr-5 group-hover:mr-0 group-hover:text-bluePrimary transition-all duration-300">
                <MoveRight />
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Link href={`/profile/${user?.username}/manage`}>
          <Card className="h-fit w-full border-transparent hover:border-bluePrimary group cursor-pointer transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center justify-center gap-4">
                <ShieldCheck className="size-10 group-hover:text-bluePrimary" />
                <div className="flex flex-col gap-2">
                  <CardTitle className="font-Anta">
                    Account & Security
                  </CardTitle>
                  <CardDescription className="font-Annapura ">
                    Edit your profile and manage your devices
                  </CardDescription>
                </div>
              </div>
              <div className="flex w-fit mr-5 group-hover:mr-0 group-hover:text-bluePrimary transition-all duration-300">
                <MoveRight />
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Link href={`/profile/${user?.username}/guidelines`}>
          <Card className="h-fit w-full border-transparent hover:border-bluePrimary group cursor-pointer transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center justify-center gap-4">
                <BadgeCheck className="size-10 group-hover:text-bluePrimary" />
                <div className="flex flex-col gap-2">
                  <CardTitle className="font-Anta">Guidelines</CardTitle>
                  <CardDescription className="font-Annapura ">
                    Learn how to you can keep the platform clean and friendly.
                  </CardDescription>
                </div>
              </div>
              <div className="flex w-fit mr-5 group-hover:mr-0 group-hover:text-bluePrimary transition-all duration-300">
                <MoveRight />
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
