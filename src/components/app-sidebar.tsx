"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Building,
  Command,
  CreditCard,
  Frame,
  Layers,
  LayoutDashboard,
  Leaf,
  LifeBuoy,
  Map,
  PieChart,
  PieChartIcon,
  Send,
  Signal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Codehagen",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Banking",
      url: "/banking",
      icon: Layers,
    },
    {
      title: "Categories",
      url: "/categories",
      icon: PieChartIcon,
    },
    {
      title: "Investments",
      url: "/investments",
      icon: Signal,
    },
    {
      title: "Assets",
      url: "/assets",
      icon: Building,
    },
    {
      title: "Savings",
      url: "/savings",
      icon: Leaf,
    },
    {
      title: "Liabilities",
      url: "/liabilities",
      icon: CreditCard,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Account 1",
      url: "#",
      icon: Frame,
    },
    {
      name: "Account 2",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Account 3",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // Add isActive property based on current pathname
  const navMainWithActive = data.navMain.map((item) => ({
    ...item,
    isActive: pathname.startsWith(item.url),
  }));

  const projectsWithActive = data.projects.map((item) => ({
    ...item,
    isActive: pathname === item.url,
  }));

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Badget</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithActive} />
        <NavProjects projects={projectsWithActive} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
