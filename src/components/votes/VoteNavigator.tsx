"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { FullNomination } from "@/server/api/routers/nominations";
import { type Category } from "@/server/api/zod/schema";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import Link from "next/link";
import { useParams } from "next/navigation";
import PhCircleIcon from "~icons/ph/circle-fill";

interface Props {
  categories: Category[];
}

export const VoteNavigator = ({ categories }: Props) => {
  const { slug } = useParams();

  return (
    <nav className="flex items-center justify-center gap-x-2">
      {categories.map((c) => (
        <TooltipProvider key={c.id} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>
              <Link href={`${c.slug}`}>
                <PhCircleIcon
                  className={cn(
                    "size-3",
                    slug === c.slug && "size-5 text-primary",
                  )}
                />
              </Link>
            </TooltipTrigger>
            <TooltipContent>{c.name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </nav>
  );
};
