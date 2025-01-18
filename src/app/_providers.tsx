import { PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";
export const AppProviders = ({ children }: PropsWithChildren) => {
  return <SessionProvider>{children}</SessionProvider>;
};
