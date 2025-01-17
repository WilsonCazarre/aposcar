"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import PhCircleNotch from "~icons/ph/circle-notch";

interface Props {
  nominationId: string;
  categoryId: string;
}
export const CastVoteButton = ({ nominationId, categoryId }: Props) => {
  const { mutate, isPending } = api.votes.castVote.useMutation({
    onSuccess: () => {},
  });

  return (
    <Button
      onClick={() => {
        mutate({ nominationId , categoryId});
      }}
    >
      {isPending ? <PhCircleNotch className="animate-spin" /> : "Cast vote"}
    </Button>
  );
};
