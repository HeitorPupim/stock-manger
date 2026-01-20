export type UserSummary = {
  name: string | null;
  email: string | null;
  image: string | null;
};

type UserLike = {
  name?: string | null;
  email?: string | null;
  image?: string | null | undefined;
};

export const toUserSummary = (user?: UserLike | null): UserSummary | null => {
  if (!user) {
    return null;
  }

  return {
    name: user.name ?? null,
    email: user.email ?? null,
    image: user.image ?? null,
  };
};
