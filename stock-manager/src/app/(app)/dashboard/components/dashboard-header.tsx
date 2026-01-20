"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UserSummary } from "@/lib/user";

import SignOutButton from "./sign-out-button";

type DashboardHeaderProps = {
  user: UserSummary | null;
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
  if (!user) {
    return null;
  }

  const avatarAlt = user.name ?? user.email ?? "User avatar";
  const avatarFallback = getInitials(user.name ?? user.email);

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={user.image ?? undefined} alt={avatarAlt} />
        <AvatarFallback className="bg-accent border-accent-foreground border">{avatarFallback}</AvatarFallback>
      </Avatar>
      <SignOutButton />
    </div>
  );
};

export default DashboardHeader;
