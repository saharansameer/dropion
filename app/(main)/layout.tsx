import type { Metadata } from "next";
import { ReactChildren } from "@/types";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar/AppSidebar";
import { AppBreadcrumb } from "@/components/Layout/AppBreadcrumb";
import { Separator } from "@/components/ui/separator";
import { FileViewer } from "@/components/Files/FileViewer";

export const metadata: Metadata = {
  title: "Home | Dropion",
  description: "Manage Your Drops With Ease",
  metadataBase: new URL("https://dropion.sameersaharan.com/home"),
};

export default function Layout({ children }: ReactChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <AppBreadcrumb />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min px-2 py-1">
            {children}
            <FileViewer />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
