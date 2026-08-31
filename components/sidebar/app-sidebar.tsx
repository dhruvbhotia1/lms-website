"use client"

import * as React from "react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  ListIcon,

  UsersIcon,

  Settings2Icon,
  CircleHelpIcon,

  ArchiveIcon
} from "lucide-react"
import Link from "next/link";
import Image from "next/image";
import {authClient} from "@/lib/auth/auth-client";


interface Props extends React.ComponentProps<typeof Sidebar> {
  user: typeof authClient.$Infer.Session.user;
}

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/publisher",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },


    {
      // maybe current projects
      title: "Archives",
      url: "/publisher/courses/archive",
      icon: (
        <ArchiveIcon
        />
      ),
    },
    {
      // import data from the dms section if there is a workspace then it is a team....
      title: "Team",
      url: "#",
      icon: (
        <UsersIcon
        />
      ),
    },
  ],


}

export function AppSidebar({ user, ...props }: Props) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <Image src={'/logo.svg'} alt={'logo'} width={32} height={32} className="size-5!" />
                <span className="text-base font-semibold">LearnersHub</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
