import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/server/auth";
import { AvatarImage } from "@radix-ui/react-avatar";
import PhSignOut from "~icons/ph/sign-out";
// import PhGear from "~icons/ph/gear";
// import PhCheckSquare from "~icons/ph/check-square";
// import PhFlask from "~icons/ph/flask";
// import PhUser from "~icons/ph/user";
// import PhTicket from "~icons/ph/ticket"
import { type Session } from "next-auth";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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
        <Button variant="ghost" className="space-x-2 hover:bg-transparent">
          <div className="flex flex-col">
            <div>{session.user?.name}</div>
            {session.user.role === "admin" && (
              <Badge variant="default" className="ml-auto">
                Admin
              </Badge>
            )}
          </div>
          <Avatar>
            <AvatarImage src={session.user?.image ?? ""} />
            <AvatarFallback />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href="/votes">Cast your vote!</Link>
        </DropdownMenuItem>

        {session.user?.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin">Admin Tools</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

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
