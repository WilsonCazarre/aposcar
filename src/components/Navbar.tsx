import { AvatarDropdown } from "@/components/ProfileBadge";
import { auth } from "@/server/auth";
import Link from "next/link";

export const Navbar = async () => {
  const session = await auth();
  return (
    <nav className="flex w-full items-center justify-between px-12 py-6">
      <Link href="/" className="transition-opacity hover:opacity-80">
        <h1 className="text-2xl font-light text-primary">Aposcar</h1>
      </Link>

      <AvatarDropdown session={session} />
    </nav>
  );
};
