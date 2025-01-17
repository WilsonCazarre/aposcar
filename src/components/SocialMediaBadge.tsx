import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import PhArrowUpRight from "~icons/ph/arrow-up-right";

export function SocialMediaBadge({
  text = "Letterboxd",
  url,
}: {
  text: string;
  url: string;
}) {
  return (
    <Badge variant="outline" className="hover:text-primary">
      <Link href={url} target="_blank" className="flex items-center gap-1 p-1">
        {text} <PhArrowUpRight className="h-4 w-4" />
      </Link>
    </Badge>
  );
}
