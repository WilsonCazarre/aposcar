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
    onSuccess: (_, {categorySlug}) => {
      void utils.nominations.getCategoryWithNavigation.invalidate({categorySlug});
    },
    onMutate: ({ categorySlug, nominationId }) => {
      utils.nominations.getCategoryWithNavigation.setData(
        { categorySlug },
        (old) => {
          if (old) {
            console.log({ old });
            const oldNominationIdx = old?.nominations.findIndex(
              (n) => n.id === nominationId,
            );
            if (oldNominationIdx) {
              console.log({ oldNominationIdx });
              old.nominations[oldNominationIdx]!.isUserVote = true;
            }
          }
          return old;
        },
      );
    },
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
