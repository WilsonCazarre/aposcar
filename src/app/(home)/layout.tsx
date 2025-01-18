import "@/styles/globals.css";

import { type Metadata } from "next";

import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Aposcar",
  description: "Aposcar",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Navbar />
      {/* <hr className="w-full" /> */}
      <div className="w-full flex-grow px-6 lg:px-12">{children}</div>
      <Toaster />

      <footer className="w-full py-4 text-center text-sm text-muted-foreground">
        <p className="">
          Made with 💛 by{" "}
          <a
            href="https://www.labquatro.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary"
          >
            LabQuatro
          </a>
        </p>
      </footer>
    </div>
  );
}
