import { Sidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-4.6rem)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 font-sans">{children}</main>
    </div>
  );
}
