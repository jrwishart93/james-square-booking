export default function PageContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={[
        "page-container relative mx-auto w-full max-w-6xl px-4 sm:px-6 pb-16",
        className,
      ].join(" ")}
    >
      {children}
    </main>
  );
}
