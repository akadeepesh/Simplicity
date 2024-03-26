import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoveRight, ShieldCheck, BadgeCheck, Album, Star } from "lucide-react";
import Link from "next/link";

export const Dashboard = () => {
  return (
    <div className="flex  justify-center items-center mt-20 sm:mt-24 md:mt-28 lg:mt-36">
      <div className="flex gap-2 max-w-xl w-full justify-center">
        <div className="flex w-full flex-col gap-10">
          <Link href="/example">
            <Card className="h-fit w-full border-transparent hover:border-blue-500 group cursor-pointer transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center justify-center gap-4">
                  <Star className="size-10 group-hover:text-blue-500" />
                  <div className="flex flex-col gap-2">
                    <CardTitle className="font-Anta">Liked Posts</CardTitle>
                    <CardDescription className="font-Annapura">
                      Find your favorite poetries and manage your wishlist
                    </CardDescription>
                  </div>
                </div>
                <div className="flex w-fit mr-5 group-hover:mr-0 group-hover:text-blue-500 transition-all duration-300">
                  <MoveRight />
                </div>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/example">
            <Card className="h-fit w-full border-transparent hover:border-blue-500 group cursor-pointer transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center justify-center gap-4">
                  <Album className="size-10 group-hover:text-blue-500" />
                  <div className="flex flex-col gap-2">
                    <CardTitle className="font-Anta">Your Posts</CardTitle>
                    <CardDescription className="font-Annapura ">
                      Manage and view your posts
                    </CardDescription>
                  </div>
                </div>
                <div className="flex w-fit mr-5 group-hover:mr-0 group-hover:text-blue-500 transition-all duration-300">
                  <MoveRight />
                </div>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/example">
            <Card className="h-fit w-full border-transparent hover:border-blue-500 group cursor-pointer transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center justify-center gap-4">
                  <ShieldCheck className="size-10 group-hover:text-blue-500" />
                  <div className="flex flex-col gap-2">
                    <CardTitle className="font-Anta">
                      Account & Security
                    </CardTitle>
                    <CardDescription className="font-Annapura ">
                      Edit your profile and manage your devices
                    </CardDescription>
                  </div>
                </div>
                <div className="flex w-fit mr-5 group-hover:mr-0 group-hover:text-blue-500 transition-all duration-300">
                  <MoveRight />
                </div>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/example">
            <Card className="h-fit w-full border-transparent hover:border-blue-500 group cursor-pointer transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center justify-center gap-4">
                  <BadgeCheck className="size-10 group-hover:text-blue-500" />
                  <div className="flex flex-col gap-2">
                    <CardTitle className="font-Anta">User Support</CardTitle>
                    <CardDescription className="font-Annapura ">
                      Get help, support and contact the support team.
                    </CardDescription>
                  </div>
                </div>
                <div className="flex w-fit mr-5 group-hover:mr-0 group-hover:text-blue-500 transition-all duration-300">
                  <MoveRight />
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
