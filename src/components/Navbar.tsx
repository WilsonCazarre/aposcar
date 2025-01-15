import { AvatarDropdown } from "@/components/ProfileBadge";
import { auth } from "@/server/auth";
import Link from "next/link";

export const Navbar = async () => {
  const session = await auth();
  return (
    <nav className="flex w-full items-center justify-between py-6 px-12">
      <Link href="/" className="hover:opacity-80 transition-opacity">
        <h1 className="text-2xl font-light text-primary">Aposcar</h1>
      </Link>  

      <AvatarDropdown session={session} />
    </nav>
  );
};
