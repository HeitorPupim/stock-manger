export type UserSummary = {
  name: string;
  email: string;
  image: string | null;
};

type UserLike = {
  name?: string;
  email?: string;
  image?: string | null | undefined;
};

export const toUserSummary = (user?: UserLike | null): UserSummary | null => {
  if (!user) {
    return null;
  }

  return {
    name: user.name ?? "",
    email: user.email ?? "",
    image: user.image ?? null,
  };
};
