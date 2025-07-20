"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { type LucideIcon } from "lucide-react";
import { Home, FolderClosed, Trash, Star, FolderPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FileUpload, FolderForm } from "@/components/client";

const navMain: {
  title: string;
  icon: LucideIcon;
  href: string;
}[] = [
  {
    title: "Home",
    icon: Home,
    href: "/home",
  },
  {
    title: "My Files",
    icon: FolderClosed,
    href: "/my-files",
  },
  {
    title: "Starred",
    icon: Star,
    href: "/starred",
  },
  {
    title: "Trash",
    icon: Trash,
    href: "/trash",
  },
];

const iconStyle = { width: "18px", height: "18px" };

export function NavMain() {
  const router = useRouter();
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <FileUpload variant="button" />
        </SidebarMenuItem>
        <SidebarMenuItem>
          <FolderForm
            trigger={
              <SidebarMenuButton tooltip={"New Folder"}>
                <FolderPlus style={iconStyle} />
                New Folder
              </SidebarMenuButton>
            }
          />
        </SidebarMenuItem>

        <SidebarSeparator />

        {navMain.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              onClick={() => router.push(item.href)}
            >
              {item.icon && <item.icon style={iconStyle} />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
