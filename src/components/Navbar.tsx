import { AvatarDropdown } from "@/components/ProfileBadge";
import { auth } from "@/server/auth";
import Link from "next/link";

export const Navbar = async () => {
  const session = await auth();
  return (
    <nav className="flex w-full max-w-[1000px] items-center justify-between p-2">
      <Link href="/" className="hover:opacity-80 transition-opacity">
        <h1 className="text-2xl text-primary">Aposcar</h1>
      </Link>  

      <AvatarDropdown session={session} />
    </nav>
  );
};
