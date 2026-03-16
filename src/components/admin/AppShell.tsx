"use client";

import { usePathname } from "next/navigation";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { AdminAuthGuard } from "./AuthGuard";
import { AdminSidebar } from "./Sidebar";

export function AdminAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <AdminAuthProvider>
      <AdminAuthGuard>
        {isLoginPage ? (
          children
        ) : (
          <>
            <AdminSidebar />
            <main className="ml-64 min-h-screen">{children}</main>
          </>
        )}
      </AdminAuthGuard>
    </AdminAuthProvider>
  );
}
