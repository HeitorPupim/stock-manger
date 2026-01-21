import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { toUserSummary } from "@/lib/user";

import { AppSidebar } from "../_components/app-sidebar";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth");
  }


  return (
    <SidebarProvider>
      <AppSidebar user={toUserSummary(session?.user)}/>
      <SidebarInset>
        <header className="flex h-12 items-center justify-between gap-4 border-b px-4">
          <SidebarTrigger />
        </header>
        <div className="flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
