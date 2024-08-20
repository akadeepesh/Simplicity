"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "../aceternity/input";
import { Label } from "../aceternity/label";
import { useUser } from "@clerk/nextjs";
import { Textarea } from "../aceternity/textarea";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useRouter } from "next/navigation";
import { CircleHelp } from "lucide-react";

const FormSchema = z.object({
  username: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string(),
});

const Post = () => {
  const router = useRouter();
  const { user } = useUser();
  const post = useMutation(api.poetry.AddPoetry);

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      username: user?.username || "Invalid User",
    },
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await post({
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
    <div className="max-w-xl w-full rounded-none md:rounded-2xl mx-auto p-4 md:p-8 shadow-input my-14 md:my-28">
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <LabelInputContainer>
                  <FormLabel>
                    <Label>Username</Label>
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
                    <Label
                      className="flex flex-row items-center gap-2"
                      htmlFor="title"
                    >
                      Title{" "}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <CircleHelp className="cursor-help" size={16} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="">
                              This is an optional field, if left blank others
                              will see &quot;Simplicity&quot; as title. <br />{" "}
                              Which can be disabled by filtering.
                            </div>{" "}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder="You would like to address your poetry as"
                      type="text"
                      spellCheck="false"
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
                    <Label
                      className="flex flex-row items-center gap-2"
                      htmlFor="description"
                    >
                      Description{" "}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <CircleHelp className="cursor-help" size={16} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="">
                              This is an optional field, if left blank others
                              will see &quot;...&quot; as description. <br />{" "}
                              Which can be disabled by filtering.
                            </div>{" "}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="description"
                      placeholder="Wanna share any special memory about this?"
                      type="text"
                      spellCheck="false"
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
                      className="h-20 text-left align-top max-h-32 leading-6 min-h-[60px]"
                      {...field}
                      placeholder="Write Your Poetry Here..."
                      spellCheck="false"
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
          <div className="bg-gradient-to-r from-transparent via-[#21bbdc] to-transparent my-8 h-[1px] w-full" />
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

export default Post;
