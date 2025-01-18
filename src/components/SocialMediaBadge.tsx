import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import PhArrowUpRight from "~icons/ph/arrow-up-right";
import PhTwiterLogo from "~icons/ph/twitter-logo";
import PhDotsThreeOutline from "~icons/ph/dots-three-outline";
import PhButterfly from "~icons/ph/butterfly";

export function SocialMediaBadge({
  text = "Letterboxd",
  url,
}: {
  text?: string;
  url: string;
}) {
  return (
    <Badge variant="outline" className="group hover:text-primary">
      <Link href={url} target="_blank" className="flex items-center gap-[6px] p-1">
        {text === "Twitter" && <PhTwiterLogo className="h-4 w-4" />}
        {text === "Bluesky" && <PhButterfly className="h-4 w-4" />}
        {text === "Letterboxd" && <PhDotsThreeOutline className="h-4 w-4" />}

        <p>{text}</p>
        <PhArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </Badge>
  );
}
