"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import PhCircleNotch from "~icons/ph/circle-notch";

interface Props {
  nominationId: string;
  categorySlug: string;
  nextCategorySlug?: string;
}

export const CastVoteButton = ({
  nominationId,
  categorySlug,
  nextCategorySlug,
}: Props) => {
  const utils = api.useUtils();
  const router = useRouter();

  const { mutate, isPending } = api.votes.castVote.useMutation({
    onSuccess: (_, { categorySlug }) => {
      void utils.nominations.getCategoryWithNavigation.invalidate({
        categorySlug,
      });

      if (nextCategorySlug) {
        router.push(`/votes/${nextCategorySlug}`);
      }
    },
  });

  return (
    <Button
      className="absolute bottom-0 w-full rounded-sm"
      onClick={() => {
        mutate({ nominationId, categorySlug });
      }}
    >
      {isPending ? <PhCircleNotch className="animate-spin" /> : "Confirm vote"}
    </Button>
  );
};
