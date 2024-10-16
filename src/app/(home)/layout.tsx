import "@/styles/globals.css";

import { type Metadata } from "next";

import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Aposcar",
  description: "Aposcar",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session) return redirect("/login");
  return (
    <div className="flex flex-col items-center justify-center">
      <Navbar />
      <hr className="w-full" />
      <div className="mt-40">{children}</div>
    </div>
  );
}
