"use client"

import {Badge} from "@/components/ui/badge"
import {authClient} from "@/lib/auth-client";
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function Home() {

  const router = useRouter();

  const handleSignOut = async () => {

    await authClient.signOut();
    router.push("/sign-in");

  }


  return (
    <>
      <section className={"relative py-20"}>

          <div className={"flex flex-col items-center text-center space-y-8"}>
              <Badge variant={"outline"}>
                  The Future of Online Education
              </Badge>
              <h1 className={"text-4xl md:text-6xl font-bold tracking-tight"}>Elevate your Learning Experience</h1>
              <p className={"font-semibold max-w-175 md:text-xl text-muted-foreground"}>Discover a new way to learn with our modern, interactive learning management system. Access high-quality courses anytime, anywhere.</p>

              <div className={"flex flex-col sm:flex-row gap-4 mt-8"}>

                  <Link href={"/"}>
                      Explore Courses
                  </Link>

              </div>
          </div>



      </section>
    </>

  );
}
