import { headers } from "next/headers";
import type { ReactNode } from "react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { toUserSummary } from "@/lib/user";

import { AppSidebar } from "../components/app-sidebar";
import DashboardHeader from "./dashboard/components/dashboard-header";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 items-center justify-between gap-4 border-b px-4">
          <SidebarTrigger />
          <DashboardHeader user={toUserSummary(session?.user)} />
        </header>
        <div className="flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
