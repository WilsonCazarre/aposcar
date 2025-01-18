import { WelcomeForm } from "@/components/auth/WelcomeForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function WelcomePage() {
  try {
    const user = await api.users.getUserFromSession();
    if (user.completedOnboarding) return redirect("/");
  } catch {
    redirect("/");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome aboard</CardTitle>
        <CardDescription>we need to see some id</CardDescription>
      </CardHeader>
      <CardContent>
        <WelcomeForm />
      </CardContent>
    </Card>
  );
}
