'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { db } from '@/lib/firebase';
import {
  LOCAL_PROJECTS_COLLECTION,
  PROJECT_STATUS_LABELS,
  STARTER_PROJECTS,
  parseLocalProject,
  sortProjects,
  splitParagraphs,
  type LocalProject,
  type ProjectStatus,
} from '@/lib/localProjects';
import { glass, secondaryButton } from './ui';

const STATUS_STYLES: Record<ProjectStatus, string> = {
  ongoing: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200',
  upcoming: 'border-sky-500/40 bg-sky-500/10 text-sky-800 dark:text-sky-200',
  'in-progress': 'border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-200',
  completed: 'border-neutral-500/30 bg-neutral-500/10 text-neutral-700 dark:text-neutral-300',
};

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export default function LocalProjects() {
  const [projects, setProjects] = useState<LocalProject[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Firestore can wait a long time before failing when offline; show the starter list instead.
    const fallback = window.setTimeout(() => {
      if (!cancelled) setProjects((current) => current ?? STARTER_PROJECTS);
    }, 6000);
    getDocs(query(collection(db, LOCAL_PROJECTS_COLLECTION), where('published', '==', true)))
      .then((snap) => {
        if (cancelled) return;
        const list = snap.docs.map((d) => parseLocalProject(d.id, d.data()));
        setProjects(list.length ? sortProjects(list) : STARTER_PROJECTS);
      })
      .catch(() => {
        if (!cancelled) setProjects((current) => current ?? STARTER_PROJECTS);
      })
      .finally(() => window.clearTimeout(fallback));
    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
  }, []);

  if (!projects) {
    return (
      <div className="grid gap-4 md:grid-cols-2" aria-busy="true">
        {[0, 1].map((i) => (
          <div key={i} className={`${glass} h-48 animate-pulse`} />
        ))}
      </div>
    );
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </ul>
  );
}

function ProjectCard({ project }: { project: LocalProject }) {
  const [open, setOpen] = useState(false);
  const paragraphs = splitParagraphs(project.body);
  const detailsId = `project-details-${project.id}`;

  return (
    <li className={`${glass} flex flex-col overflow-hidden`}>
      {project.imageUrl && (
        // Admin-supplied images may be remote, so a plain img avoids next/image domain config.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.imageUrl} alt="" loading="lazy" className="h-44 w-full object-cover" />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[project.status]}`}
          >
            {PROJECT_STATUS_LABELS[project.status]}
          </span>
          {project.updatedAt && (
            <span className="text-xs text-[color:var(--text-muted)]">
              Updated {dateFormat.format(new Date(project.updatedAt))}
            </span>
          )}
        </div>
        <h3 className="mt-2 text-lg font-semibold">{project.title}</h3>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">{project.summary}</p>

        {open && paragraphs.length > 0 && (
          <div id={detailsId} className="mt-3 space-y-2 text-sm">
            {paragraphs.map((p, i) => (
              <p key={i} className="whitespace-pre-line">
                {p}
              </p>
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          {paragraphs.length > 0 && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={detailsId}
              className={secondaryButton}
            >
              {open ? 'Show less' : 'Read more'}
              <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} aria-hidden />
            </button>
          )}
          {project.linkUrl && (
            <a
              href={project.linkUrl}
              target={project.linkUrl.startsWith('/') ? undefined : '_blank'}
              rel={project.linkUrl.startsWith('/') ? undefined : 'noopener noreferrer'}
              className={secondaryButton}
            >
              {project.linkLabel || 'Find out more'}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
