import { auth } from "@/lib/auth";

export const useCurrentUser = () => {
  const data = auth.api.getSession();

  return { data };
};
