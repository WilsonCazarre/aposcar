"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import PhCircleNotch from "~icons/ph/circle-notch";
import { useToast } from "@/hooks/use-toast";
import {
  OnboardUserInput,
  onboardUserInputSchema,
} from "@/server/api/zod/users";
import { redirect, useRouter } from "next/navigation";

export const WelcomeForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { mutate, isPending, isSuccess } = api.users.onboardUser.useMutation({
    onSuccess: (data, { username }) => {
      console.log({ data });
      toast({
        title: "Account created successfully",
        description: `Welcome ${username}`,
      });
      router.push("/");
    },
  });

  const form = useForm<OnboardUserInput>({
    resolver: zodResolver(onboardUserInputSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = (data: OnboardUserInput) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          disabled={isSuccess}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="madelineThorson" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mt-8 w-full"
          disabled={isSuccess || isPending}
        >
          {isPending ? <PhCircleNotch className="animate-spin" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
