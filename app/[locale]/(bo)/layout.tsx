import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import BoShellClient from "./BoShellClient";
import LegalFooter from "../components/LegalFooter";

export default async function BoLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session) redirect(`/${locale}/login`);
  if (role !== "ADMIN") redirect(`/${locale}`);

  return (
    <>
      <BoShellClient>{children}</BoShellClient>
      <LegalFooter hasSidebar={false} />
    </>
  );
}
