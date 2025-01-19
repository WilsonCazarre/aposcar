import { AvatarDropdown } from "@/components/ProfileBadge";
import Link from "next/link";

export const Navbar = async () => {
  return (
    <nav className="z-50 flex w-full items-center justify-between bg-gradient-to-t from-transparent to-background px-6 py-4 lg:px-12 lg:py-6">
      <Link href="/" className="transition-opacity hover:opacity-90">
        <h1 className="text-lg font-light text-primary lg:text-2xl">Aposcar</h1>
      </Link>

      <AvatarDropdown />
    </nav>
  );
};
