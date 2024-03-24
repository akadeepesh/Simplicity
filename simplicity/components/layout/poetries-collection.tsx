"use client";
import React, { useState } from "react";
import { Authenticated, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Clipboard,
  Flag,
  Heart,
  CircleCheck,
  EllipsisVertical,
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { Input } from "../aceternity/input";
import { Label } from "../aceternity/label";
import { useUser } from "@clerk/clerk-react";
import { Textarea } from "../aceternity/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  id: z.any(),
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string(),
});

const UpdateFun = ({
  id,
  title,
  description,
  content,
}: {
  id: Id<"poetry">;
  title: string;
  description: string;
  content: string;
}) => {
  const router = useRouter();
  const update = useMutation(api.poetry.updatePoetry);

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      id: id,
      title: title,
      description: description,
      content: content,
    },
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await update({
      id: id,
      title: data.title,
      description: data.description,
      content: data.content,
    });
    router.push("/");
  }

  const [isInvalid, setIsInvalid] = useState(false);

  const handleInvalid = (e: React.InvalidEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsInvalid(true);
  };

  return (
    <div className="max-w-xl w-full rounded-none md:rounded-2xl mx-auto p-4 md:p-8 shadow-input mt-20">
      <h2 className="font-bold text-xl">Welcome to Simplicity</h2>
      <p className="text-muted-foreground text-sm max-w-sm mt-2">
        Add your poetry collection to the world of Simplicity
      </p>
      <Form {...form}>
        <form
          className="my-8 flex flex-col space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <LabelInputContainer>
                  <FormLabel>
                    <Label>ID</Label>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </LabelInputContainer>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <LabelInputContainer>
                  <FormLabel>
                    <Label htmlFor="title">Title</Label>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder="You would like to address your poetry as"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                </LabelInputContainer>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <LabelInputContainer>
                  <FormLabel>
                    <Label htmlFor="description">Description</Label>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="description"
                      placeholder="Wanna share any special memory about this?"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                </LabelInputContainer>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <LabelInputContainer>
                  <FormLabel>
                    <div className="flex flex-row gap-2">
                      <Label htmlFor="content">Poetry</Label>
                      <div
                        className={`text-xs transition-all duration-300 ${
                          isInvalid
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }`}
                      >
                        (Required)
                      </div>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="h-20 text-left align-top"
                      {...field}
                      placeholder="Write Your Poetry Here..."
                      required
                      onInvalid={handleInvalid}
                      onFocus={() => setIsInvalid(false)}
                    />
                  </FormControl>
                </LabelInputContainer>
              </FormItem>
            )}
          />
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Post &rarr;
            <BottomGradient />
          </button>
          <div className="bg-gradient-to-r from-transparent via-blue-500 to-transparent my-8 h-[1px] w-full" />
        </form>
      </Form>
    </div>
  );
};

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

const PoetriesCollection = () => {
  const { viewer, poetries } = useQuery(api.poetry.getPoetry) ?? {};
  const likePoetry = useMutation(api.likes.LikePoetry);
  const likesData = useQuery(api.likes.LikesData, {});
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const unlikePoetry = useMutation(api.likes.UnlikePoetry);

  const handleLikeClick = async (poetryId: Id<"poetry">) => {
    const isLiked = likesData?.some(
      (like) => like.poetryId === poetryId && like.userId === viewer?.subject
    );

    if (isLiked) {
      await unlikePoetry({
        poetryId: poetryId,
        userId: viewer?.subject ?? "",
      });
    } else {
      await likePoetry({
        poetryId: poetryId,
        userId: viewer?.subject ?? "",
      });
    }
  };

  const handleCopyClick = async (content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedText(content);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  if (viewer === undefined || poetries === undefined) {
    return (
      <div className="flex-col space-y-10">
        <Skeleton className="flex h-[40vh] w-full" />
        <Skeleton className="flex h-[40vh] w-full" />
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-col gap-2">
        {poetries?.map((poetry) => {
          const numLikes =
            likesData?.filter((like) => like.poetryId === poetry._id).length ??
            0;
          const isLiked = likesData?.some(
            (like) =>
              like.poetryId === poetry._id && like.userId === viewer?.subject
          );
          return (
            <>
              <div
                key={poetry.id}
                className="rounded-lg flex flex-col gap-8 p-6 group"
              >
                <div className="flex flex-col">
                  <div className={`flex flex-row justify-between items-center`}>
                    <div className="flex flex-col">
                      <div className="text-xl font-bold">
                        {poetry.title ? poetry.title : "Simplicity"}
                      </div>
                      <div className="text-base text-muted-foreground">
                        {poetry.description ? poetry.description : "..."}
                      </div>
                    </div>
                    <Authenticated>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="rounded-md">
                          <div className="group-hover:opacity-80 opacity-0 flex text-muted-foreground p-3 rounded-2xl hover:bg-muted cursor-pointer transition-all duration-300">
                            <EllipsisVertical size={20} />
                          </div>
                        </DropdownMenuTrigger>
                        {poetry.username === viewer?.nickname ? (
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              // onClick={() => (
                              //   <UpdateFun
                              //     id={poetry._id}
                              //     title={poetry.title}
                              //     description={poetry.description}
                              //     content={poetry.content}
                              //   />
                              // )}
                              className="cursor-pointer"
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        ) : (
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Flag size={20} />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        )}
                      </DropdownMenu>
                    </Authenticated>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-transparent my-2 h-[1px] w-full" />
                </div>
                <div className="flex whitespace-pre-wrap leading-8 font-Alkatra h-full justify-center items-center">
                  {poetry.content}
                </div>
                <div className="bg-secondary mt-2 h-[1px] w-full" />
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row gap-2 group-hover:opacity-100 opacity-0 text-muted-foreground transition-all duration-300">
                    <Authenticated>
                      <div
                        onClick={() => handleLikeClick(poetry._id)}
                        className="flex flex-row gap-2 items-center p-3 rounded-2xl hover:bg-secondary cursor-pointer"
                      >
                        <Heart
                          size={20}
                          className={
                            isLiked ? "fill-blue-500 text-blue-500" : ""
                          }
                        />
                        <div>{numLikes}</div>
                      </div>
                    </Authenticated>
                    <div
                      onClick={() => handleCopyClick(poetry.content)}
                      className="flex flex-row gap-2 items-center p-3 rounded-2xl hover:bg-secondary cursor-pointer"
                    >
                      {copiedText === poetry.content ? (
                        <CircleCheck size={20} className="text-green-500" />
                      ) : (
                        <Clipboard size={20} />
                      )}
                    </div>
                  </div>
                  <div className="text-muted-foreground">
                    ~{poetry.username}
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-12 h-[1px] w-full" />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default PoetriesCollection;
