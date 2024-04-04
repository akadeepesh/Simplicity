"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "../typography/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
const FormSchema = z
  .object({
    topic: z.string({
      required_error: "Please select an topic to display.",
    }),
    reason: z.string().optional(),
    termsAccepted: z
      .boolean({
        required_error: "You must read the guidelines.",
      })
      .refine((value) => value === true, {
        message: "You must read the guidelines.",
      }),
  })
  .refine(
    (data) =>
      data.topic !== "other" ||
      (data.topic === "other" && data.reason && data.reason.trim() !== ""),
    {
      message: "Please provide a reason for reporting.",
      path: ["reason"],
    }
  );

export default function SelectForm({ poetryId }: { poetryId: Id<"poetry"> }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const report = useMutation(api.reports.ReportPoetry);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    let reportMessage = "You reported for ";
    if (data.topic !== "other") {
      reportMessage += data.topic;
    } else {
      reportMessage += `"${data.reason}"`;
    }
    await report({
      poetryId: poetryId,
      topic: data.topic,
      reason: data.reason,
    });

    toast({
      title: "Poetry Submitted For Review",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{reportMessage}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason of reporting</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Reason To Report" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="inaproppriate_content">
                    Inaproppriate content
                  </SelectItem>
                  <SelectItem value="plagiarism">Plagiarism</SelectItem>
                  <SelectItem value="harassment">Harassment</SelectItem>
                  <SelectItem value="offensive_language">
                    Offensive Language
                  </SelectItem>
                  <SelectItem value="personal_attacks">
                    Personal Attacks
                  </SelectItem>
                  <SelectItem value="promotion_of_violence">
                    Promotion of Violence
                  </SelectItem>
                  <SelectItem value="sensitive_topics">
                    Sensitive Topics
                  </SelectItem>
                  <SelectItem value="privacy_violation">
                    Privacy Violation
                  </SelectItem>
                  <SelectItem value="misleading">Misleading</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage topic addresses in your
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("topic") === "other" && (
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sepcify Reason</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Please provide the reason for reporting"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="termsAccepted"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I hereby confirm that I&apos;ve read the
                  <Link href="/guidelines">&apos;guidelines&apos;</Link>.
                </label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
