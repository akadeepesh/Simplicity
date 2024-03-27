import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
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
import { Input } from "../aceternity/input";
import { Label } from "../aceternity/label";
import { Textarea } from "../aceternity/textarea";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { useToast } from "@/components/ui/use-toast";
import { MoveRight } from "lucide-react";

const FormSchema = z.object({
  id: z.any(),
  username: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string(),
});

const EditPoetry = ({
  poetryId,
  title,
  description,
  content,
  onCloseEdit,
}: {
  poetryId: Id<"poetry">;
  title: string | null;
  description: string | null;
  content: string | null;
  onCloseEdit: () => void;
}) => {
  const update = useMutation(api.poetry.updatePoetry);
  const { user } = useUser();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      id: poetryId,
      username: user?.username ?? "",
      title: title ?? "",
      description: description ?? "",
      content: content ?? "",
    },
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    title ??= "";
    description ??= "";
    content ??= "";

    let caseNumber = 1;
    if (
      title !== data.title &&
      description !== data.description &&
      content !== data.content
    ) {
      caseNumber = 5;
    } else if (content !== data.content) {
      caseNumber = 4;
    } else if (description !== data.description) {
      caseNumber = 3;
    } else if (title !== data.title) {
      caseNumber = 2;
    }

    if (caseNumber === 1) {
      toast({
        title: "No Changes!",
        description: "You haven't made any changes to your poetry!",
      });
      return false;
    }

    await update({
      id: poetryId,
      title: data.title,
      description: data.description,
      content: data.content,
    });

    switch (caseNumber) {
      case 2:
        toast({
          title: "Title Changed Successfully!",
          description: "You've changed the title of your poetry!",
        });
        break;
      case 3:
        toast({
          title: "Description Changed Successfully!",
          description: "You've changed the description of your poetry!",
        });
        break;
      case 4:
        toast({
          title: "Content Changed Successfully!",
          description: "You've changed the content of your poetry!",
        });
        break;
      case 5:
        toast({
          title: "Updated Successfully!",
          description: "Your poetry has been updated successfully!",
        });
        break;
    }
    onCloseEdit();
  }

  const [isInvalid, setIsInvalid] = useState(false);

  const handleInvalid = (e: React.InvalidEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsInvalid(true);
  };
  return (
    <div className="max-w-xl w-full rounded-none md:rounded-2xl mx-auto p-4 md:p-8 shadow-input">
      <h2 className="font-bold text-xl">Welcome to Simplicity</h2>
      <p className="text-muted-foreground text-sm max-w-sm mt-2 flex flex-row items-center gap-2">
        Edit Your Poetry
        {title ? (
          ` "${title.split(" ").slice(0, 7).join(" ").substring(0, 50)}${
            title.split(" ").length > 7 || title.length > 50 ? "..." : ""
          }"`
        ) : (
          <MoveRight size={16} />
        )}
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
                      onInvalid={handleInvalid}
                      onFocus={() => setIsInvalid(false)}
                      required
                    />
                  </FormControl>
                </LabelInputContainer>
              </FormItem>
            )}
          />
          <div className="flex gap-4 flex-row-reverse">
            <button
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              Update &rarr;
              <BottomGradient />
            </button>
            <button
              className="bg-gradient-to-br relative group/btn bg-destructive w-full text-primary rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] items-center"
              onClick={onCloseEdit}
            >
              Close &times;
            </button>
          </div>
          <div className="bg-gradient-to-r from-transparent via-blue-500 to-transparent my-8 h-[1px] w-full" />
        </form>
      </Form>
    </div>
  );
};

export default EditPoetry;

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
