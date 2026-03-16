import { AdminAppShell } from "@/components/admin/AppShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <AdminAppShell>{children}</AdminAppShell>
    </div>
  );
}
