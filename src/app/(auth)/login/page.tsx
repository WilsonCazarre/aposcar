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
import { signIn } from "@/server/auth";


export default async function LoginPage() {
  return (
    <HydrateClient>

      <Card>
        <CardHeader>
          <CardTitle>Aposcar</CardTitle>
          <CardDescription>Escolha um dos métodos de Login</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <Button className="flex items-center space-x-2 w-full" type="submit">
              <SimpleIconsGoogle />
              <div>Login com Google</div>
            </Button>
          </form>
        </CardContent>
      </Card>
    </HydrateClient>
  );
}
