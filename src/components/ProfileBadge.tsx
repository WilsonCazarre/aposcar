import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/server/auth";
import { AvatarImage } from "@radix-ui/react-avatar";
import PhSignOut from "~icons/ph/sign-out";
import { type Session } from "next-auth";
import Link from "next/link";

interface Props {
  session: Session | null;
}

const LoginButton = () => (
  <Button variant="ghost" asChild>
    <Link href="/login">Login</Link>
  </Button>
);

export const AvatarDropdown: React.FC<Props> = async ({ session }) => {
  if (!session) {
    return <LoginButton />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="space-x-2">
          <div>{session.user?.name}</div>
          <Avatar>
            <AvatarImage src={session.user?.image ?? ""} />
            <AvatarFallback />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href="/bets">Place your bets</Link>
        </DropdownMenuItem>

        {session.user?.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin">Admin Tools</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit" className="flex items-center gap-x-1">
              <PhSignOut />
              Sign out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
