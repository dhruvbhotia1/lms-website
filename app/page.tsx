"use client"


import {ThemeToggle} from "@/components/theme-toggle";
import {Button} from "@/components/ui/button"
import {authClient} from "@/lib/auth-client";
import {useRouter} from "next/navigation";

export default function Home() {

  const router = useRouter();

  const handleSignOut = async () => {

    await authClient.signOut();
    router.push("/sign-in");

  }


  return (
    <>
      <ThemeToggle/>

      <div>
        <Button onClick={() => handleSignOut()}>

          Logout

        </Button>
      </div>
    </>

  );
}
