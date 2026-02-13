"use client";

import { AlertCircle, Box,  Flame, Goal, LayoutDashboard,  OctagonAlert,  Siren, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import type { ComponentProps } from "react";

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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserSummary } from "@/lib/user";

import { NavUser } from "./nav-user";

type NavItem = {
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
};

const navItemsMenu: NavItem[] = [
  {
    title: "Estoque Minimo",
    href: "/minimum-stock",
    icon: Siren,
  },
  // {
  //   title: "Panos sem venda",
  //   href: "/stuck-products",
  //   icon: AlertCircle,
  // },
  // {
  //   title: "Produtos",
  //   href: "/products",
  //   icon: Box,
  // },
  {
    title: "Mais vendidos",
    href: "/sales-ranking",
    icon: Flame,
  },
  {
    title: "Encalhados",
    href: "/product-flops",
    icon: OctagonAlert,
  },
  {
    title: "Catalogo",
    href: "/catalog",
    icon: Star
  },
];

const navItemsMateriaPrima: NavItem[] = [
  {
    title: "Saída de Matéria Prima",
    href: "/products",
    icon: Box,
  },
  {
    title: "Panagem sem venda",
    href: "/stuck-products",
    icon: AlertCircle,
  },
];

const navItemsProducao: NavItem[] = [
  {
    title: "Prioridade de Produção",
    href: "/production-priority",
    icon: Goal,
  },
];


export function AppSidebar({
  user,
  ...props
}: ComponentProps<typeof Sidebar> & { user: UserSummary | null }) {
  const { state, setOpen } = useSidebar();
  const pathname = usePathname();

  if (!user) {
    redirect("/auth");
  }

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      onClick={() => {
        if (state === "collapsed") {
          setOpen(true);
        }
      }}
    >
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between gap-2 px-2 py-1.5">
          <div className="flex items-center gap-2">
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
          <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItemsMenu.map((item) => {
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
        <SidebarGroup>
          <SidebarGroupLabel>Matéria Prima</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItemsMateriaPrima.map((item) => {
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
        <SidebarGroup>
          <SidebarGroupLabel>Produção</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItemsProducao.map((item) => {
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
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
