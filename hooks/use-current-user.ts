import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const useCurrentUser = async () => {
  const data = auth.api.getSession({
    headers: await headers(),
  });

  return { data };
};
