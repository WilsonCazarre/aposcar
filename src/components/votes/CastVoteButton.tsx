"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import PhCircleNotch from "~icons/ph/circle-notch";

interface Props {
  nominationId: string;
  categorySlug: string;
}
export const CastVoteButton = ({ nominationId, categorySlug }: Props) => {
  const utils = api.useUtils();

  const { mutate, isPending } = api.votes.castVote.useMutation({
    onSuccess: (_, { categorySlug }) => {
      void utils.nominations.getCategoryWithNavigation.invalidate({
        categorySlug,
      });
    }
  });

  return (
    <Button
      onClick={() => {
        mutate({ nominationId, categorySlug });
      }}
    >
      {isPending ? <PhCircleNotch className="animate-spin" /> : "Cast vote"}
    </Button>
  );
};
