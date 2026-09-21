import { ProjectSidebar } from "@/components/project-sidebar";
export default function ProjectLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) { return <div className="min-h-screen md:flex"><ProjectSidebar id={params.id} /><main className="flex-1 p-6 md:p-10">{children}</main></div>; }
