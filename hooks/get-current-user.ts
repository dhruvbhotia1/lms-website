import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getCurrentUser = async () => {
  const data = auth.api.getSession({
    headers: await headers(),
  });

  return { data };
};
