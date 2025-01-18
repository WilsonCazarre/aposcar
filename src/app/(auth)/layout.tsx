import { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return <main className="flex items-center justify-center h-screen">{children}</main>;
}
