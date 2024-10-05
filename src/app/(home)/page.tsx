import { HydrateClient } from "@/trpc/server";
import SimpleIconsGoogle from '~icons/simple-icons/google';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { auth, signIn, signOut } from "@/server/auth";


export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      Welcome, {session?.user?.email}
      <form action={async () => {
        "use server"
        await signOut()
      }}>
        <Button>Sign Out</Button>
      </form>
    </HydrateClient>
  );
}
