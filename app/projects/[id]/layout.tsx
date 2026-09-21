import { ProjectSidebar } from "@/components/project-sidebar";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen md:flex">
      <ProjectSidebar id={id} />
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
