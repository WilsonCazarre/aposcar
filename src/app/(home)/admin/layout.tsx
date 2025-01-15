import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { type PropsWithChildren } from "react";

const AdminLayout: React.FC<PropsWithChildren> = async ({ children }) => {
  const session = await auth();

  if (session?.user?.role !== "admin") return redirect("/");

  return <>{children}</>;
};

export default AdminLayout;
