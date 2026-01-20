"use client";


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import SignOutButton from "./sign-out-button";

type DashboardHeaderProps = {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
};

const getInitials = (value: string | null) => {
  if (!value) return "U";
  const parts = value.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return `${first}${last}`.toUpperCase() || "U";
};

const DashboardHeader = ({ user }: DashboardHeaderProps) => {


  const avatarAlt = user.name ?? user.email ?? "User avatar";
  const avatarFallback = getInitials(user.name ?? user.email);



  return (
    <header>
      <div className="flex flex-row flex-wrap items-center gap-12"></div>

      <div className="flex items-center justify-between border-b px-6 py-5">
        <h1 className="text-foreground text-xl font-bold uppercase">
          Dashboard
        </h1>

        <div className="flex items-center justify-center gap-3">
          <Avatar>
            <AvatarImage src={user.image ?? undefined} alt={avatarAlt} />
            <AvatarFallback className="bg-amber-300">{avatarFallback}</AvatarFallback>
          </Avatar>

          <SignOutButton />

        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
