import { HydrateClient } from "@/trpc/server";
import SimpleIconsGoogle from "~icons/simple-icons/google";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signIn } from "@/server/auth";

export default async function LoginPage() {
  return (
    <HydrateClient>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Aposcar</CardTitle>
            <CardDescription>Chose a login method!<br/>(We only have one)</CardDescription>
          </CardHeader>

          <CardContent>
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <Button
                className="flex w-full items-center space-x-2"
                type="submit"
              >
                <SimpleIconsGoogle />
                <div>Sign in with Google</div>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </HydrateClient>
  );
}
