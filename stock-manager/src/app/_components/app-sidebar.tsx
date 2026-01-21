"use client";

import { LayoutDashboard, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import type { ComponentProps } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserSummary } from "@/lib/user";
import { getInitials } from "@/lib/utils";

import SignOutButton from "../(protected)/dashboard/_components/log-out-button";
import { NavUser } from "./nav-user";

type NavItem = {
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Catalogo",
    href: "/catalog",
    icon: Package,
  },
];

export function AppSidebar({
  user,
  ...props
}: ComponentProps<typeof Sidebar> & { user: UserSummary | null }) {
  const { state } = useSidebar();
  const pathname = usePathname();


  if (!user) {
    redirect("/auth");
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Image
            src="/logo.svg"
            alt="CasaDasRedes"
            width={state === "collapsed" ? 24 : 32}
            height={state === "collapsed" ? 24 : 32}
            priority
          />
          <span className="text-sm font-semibold group-data-[collapsible=icon]:hidden">
            CasaDasRedes
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter className="border-t p-3">
        <NavUser user={user}/>
        {/* <div className="flex items-center justify-between gap-2 ">
          <Avatar>
            <AvatarImage
              src={user?.image ?? undefined}
              alt={user?.name ?? "User avatar"}
            />
            <AvatarFallback className="bg-accent border-accent-foreground border">
              {getInitials(user?.name ?? "User")}
            </AvatarFallback>
          </Avatar>
          <SignOutButton />
        </div> */}
      </SidebarFooter>
    </Sidebar>
  );
}
