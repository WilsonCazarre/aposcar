import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Aposcar Login",
  description: "Login to Aposcar",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session) return redirect("/");
  return <>{children}</>;
}
