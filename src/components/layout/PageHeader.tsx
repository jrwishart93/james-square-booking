export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>

      {subtitle && (
        <p className="mt-2 max-w-2xl text-white/70">
          {subtitle}
        </p>
      )}
    </header>
  );
}
