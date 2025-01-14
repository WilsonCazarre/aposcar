import { AvatarDropdown } from "@/components/ProfileBadge";
import { auth } from "@/server/auth";


export const Navbar = async () => {
  const session = await auth();
  return (
    <nav className="flex w-full max-w-[1000px] items-center justify-between p-2">
      <h1 className="text-2xl font-semibold text-primary">Aposcar</h1>
      
      <AvatarDropdown session={session} />
    </nav>
  );
};
