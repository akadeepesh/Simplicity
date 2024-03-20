"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "../aceternity/input";
import { Label } from "../aceternity/label";
import { useUser } from "@clerk/clerk-react";
import { Textarea } from "../ui/textarea";

export function SignupFormDemo() {
  const { user } = useUser();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      username: e.currentTarget.username.value,
      title: e.currentTarget.firstname.value,
      description: e.currentTarget.lastname.value,
      poetry: e.currentTarget.content.value,
    };

    console.log("Form Data:", formData);
  };
  return (
    <div className="max-w-xl w-full rounded-none md:rounded-2xl mx-auto p-4 md:p-8 shadow-input mt-20">
      <h2 className="font-bold text-xl">Welcome to Simplicity</h2>
      <p className="text-muted-foreground text-sm max-w-sm mt-2">
        Add your poetry collection to the world of Simplicity
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-6">
          <LabelInputContainer>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={
                user?.username || "Something went wrong while fetching username"
              }
              disabled
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="firstname">Title</Label>
            <Input
              id="firstname"
              placeholder="You would like to address it as"
              type="text"
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Description</Label>
            <Input
              id="lastname"
              placeholder="Wanna share any special memory about this?"
              type="text"
            />
          </LabelInputContainer>
          <LabelInputContainer className="">
            <Label htmlFor="content">Poetry</Label>
            <Textarea
              id="content"
              className="h-20 text-left align-top"
              placeholder="Write Your Poetry Here..."
              required
            />
          </LabelInputContainer>
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Post &rarr;
            <BottomGradient />
          </button>
        </div>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

const AddPoetry = () => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-2rem)]">
      <SignupFormDemo />
    </div>
  );
};

export default AddPoetry;
