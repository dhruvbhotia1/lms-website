"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { UserButton } from "./UserButton";
import { authClient } from "@/lib/auth-client";

const navigationItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Courses",
    href: "/courses",
  },
  {
    name: "Dashboard",
    href: "/learner-dashboard",
  },
];

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  //navbar fetches the current session

  return (
    <header
      className={
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60"
      }
    >
      <div
        className={
          "container flex min-h-16 items-center mx-auto px-4 md:px-4 lg:px-8"
        }
      >
        <Link href="/" className={"flex items-center space-x-2 mr-4"}>
          <Image
            src={"/logo.svg"}
            alt={"Logo"}
            width={35}
            height={35}
            loading="lazy"
          />
          <span>LearnersHub</span>
        </Link>

        <nav
          className={
            "hidden md:flex md:flex-1 md:items-center md:justify-between"
          }
        >
          <div className={"flex items-center space-x-4"}>
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={
                  "text-sm font-medium transition-colors hover:text-primary"
                }
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className={"flex items-center space-x-4"}>
            {isPending ? null : session ? (
              <UserButton user={session.user} />
            ) : (
              <>
                <Link
                  href={"/sign-up"}
                  className={buttonVariants({
                    variant: "secondary",
                  })}
                >
                  Sign Up
                </Link>
              </>
            )}

            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
