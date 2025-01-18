import SimpleIconsGoogle from "~icons/simple-icons/google";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth, signIn } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    if (session.user.completedOnboarding) {
      redirect("/");
    } else {
      redirect("/welcome");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Aposcar</CardTitle>
          <CardDescription>
            Chose a login method!
            <br />
            (We only have one)
          </CardDescription>
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
  );
}
