"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Session } from "next-auth";

interface ProvidersProps {
  children: ReactNode;
  session?: Session | null;
}

export const Providers = ({ children, session = null }: ProvidersProps) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};