import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Route protected -> only logged-in users with verified email can access.
  if (!session) {
    redirect("/auth");
  }

  if (!session?.user.emailVerified) {
    redirect("/auth");
  }

  return (
    <div>
      <h1>Dashboard Page!</h1>
    </div>
  );
};

export default DashboardPage;
