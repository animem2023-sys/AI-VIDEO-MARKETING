export default async function SectionPlaceholder({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;

  const title = section.charAt(0).toUpperCase() + section.slice(1);

  return (
    <section>
      <p className="text-sm font-semibold text-indigo-600">PROJECT MODULE</p>
      <h1 className="mt-1 text-3xl font-bold">{title}</h1>
      <p className="mt-4 text-slate-600">
        Module này đã sẵn sàng về navigation; business logic sẽ được triển khai
        trong phase tiếp theo.
      </p>
    </section>
  );
}
