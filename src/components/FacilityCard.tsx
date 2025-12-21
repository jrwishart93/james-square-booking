import Image from 'next/image';
import Link from 'next/link';

interface FacilityCardProps {
  title: string;
  href: string;
  imageSrc: string;
  description?: string;
}

export function FacilityCard({ title, href, imageSrc, description }: FacilityCardProps) {
  return (
    <Link
      href={href}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black dark:focus-visible:ring-white"
    >
      <article className="h-full overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-gray-800">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/80 dark:bg-white/10">
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-contain p-6 transition duration-300 group-hover:scale-105"
            priority
          />
        </div>
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-black dark:text-white">{title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{description ?? 'View availability & book'}</p>
          </div>
          <span className="rounded-full bg-black/5 px-3 py-1 text-sm font-medium text-black transition group-hover:bg-black/10 dark:bg-white/10 dark:text-white dark:group-hover:bg-white/20">
            Explore
          </span>
        </div>
      </article>
    </Link>
  );
}
