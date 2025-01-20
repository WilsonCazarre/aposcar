"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarImage } from "@radix-ui/react-avatar";
import PhSignOut from "~icons/ph/sign-out";
// import PhGear from "~icons/ph/gear";
// import PhCheckSquare from "~icons/ph/check-square";
// import PhFlask from "~icons/ph/flask";
// import PhUser from "~icons/ph/user";
// import PhTicket from "~icons/ph/ticket"
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useSession, signOut } from "next-auth/react";
import { api } from "@/trpc/react";

const LoginButton = () => (
  <Button variant="ghost" asChild>
    <Link href="/login">Login</Link>
  </Button>
);

export const AvatarDropdown: React.FC = () => {
  const { data: session } = useSession();
  if (!session) {
    return <LoginButton />;
  }

  // const user = await api.users.getUserById(session.user.id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="space-x-2 hover:bg-transparent">
          <div className="flex flex-col">
            <div>{session.user?.username}</div>
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
        {/* TODO: Only show this button if there's no winning nomination still */}
        <DropdownMenuItem asChild>
          <Link href="/votes">Cast your vote!</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/users/${session.user.username}`}>Your Profile</Link>
        </DropdownMenuItem>

        {session.user?.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin">Admin Tools</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <button
            type="submit"
            className="flex items-center gap-x-1"
            onClick={() => signOut()}
          >
            <PhSignOut />
            Sign out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
