'use client';

import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';
import {
  BODY_MAX,
  EMPTY_PROJECT,
  LOCAL_PROJECTS_COLLECTION,
  PROJECT_STATUSES,
  PROJECT_STATUS_LABELS,
  STARTER_PROJECTS,
  SUMMARY_MAX,
  parseLocalProject,
  safeUrl,
  sortProjects,
  toProjectInput,
  validateProject,
  type LocalProject,
  type LocalProjectInput,
  type ProjectStatus,
} from '@/lib/localProjects';

type StatusMessage = { text: string; tone: 'idle' | 'error' | 'success' };

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-white/10 dark:text-white';
const labelClass = 'block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1';
const buttonClass =
  'rounded-full px-4 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50';

function toFirestore(input: LocalProjectInput) {
  return {
    title: input.title.trim(),
    summary: input.summary.trim(),
    body: input.body.trim(),
    status: input.status,
    linkUrl: safeUrl(input.linkUrl),
    linkLabel: input.linkLabel.trim(),
    imageUrl: safeUrl(input.imageUrl),
    order: input.order,
    published: input.published,
    updatedAt: serverTimestamp(),
    updatedBy: auth.currentUser?.email ?? '',
  };
}

const LocalProjectsPanel = () => {
  const [projects, setProjects] = useState<LocalProject[] | null>(null);
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [draft, setDraft] = useState<LocalProjectInput>(EMPTY_PROJECT);
  const [status, setStatus] = useState<StatusMessage>({ text: '', tone: 'idle' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, LOCAL_PROJECTS_COLLECTION),
      (snap) => setProjects(sortProjects(snap.docs.map((d) => parseLocalProject(d.id, d.data())))),
      () => setStatus({ text: 'Could not load local projects.', tone: 'error' })
    );
    return () => unsubscribe();
  }, []);

  const startNew = () => {
    setDraft(EMPTY_PROJECT);
    setEditingId('new');
    setStatus({ text: '', tone: 'idle' });
  };

  const startEdit = (project: LocalProject) => {
    setDraft(toProjectInput(project));
    setEditingId(project.id);
    setStatus({ text: '', tone: 'idle' });
  };

  const cancel = () => {
    setEditingId(null);
    setDraft(EMPTY_PROJECT);
  };

  const save = async () => {
    const error = validateProject(draft);
    if (error) {
      setStatus({ text: error, tone: 'error' });
      return;
    }
    setBusy(true);
    try {
      if (editingId === 'new') {
        await addDoc(collection(db, LOCAL_PROJECTS_COLLECTION), toFirestore(draft));
      } else if (editingId) {
        await updateDoc(doc(db, LOCAL_PROJECTS_COLLECTION, editingId), toFirestore(draft));
      }
      setStatus({ text: 'Saved. The Living Here page now shows this change.', tone: 'success' });
      cancel();
    } catch {
      setStatus({ text: 'Save failed. Check you are signed in as an admin.', tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const togglePublished = async (project: LocalProject) => {
    setBusy(true);
    try {
      await updateDoc(
        doc(db, LOCAL_PROJECTS_COLLECTION, project.id),
        toFirestore({ ...toProjectInput(project), published: !project.published })
      );
    } catch {
      setStatus({ text: 'Could not update the project.', tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (project: LocalProject) => {
    if (!window.confirm(`Delete “${project.title}”? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await deleteDoc(doc(db, LOCAL_PROJECTS_COLLECTION, project.id));
      setStatus({ text: 'Project deleted.', tone: 'success' });
      if (editingId === project.id) cancel();
    } catch {
      setStatus({ text: 'Delete failed.', tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const importStarters = async () => {
    setBusy(true);
    try {
      const batch = writeBatch(db);
      STARTER_PROJECTS.forEach((p) => {
        batch.set(doc(collection(db, LOCAL_PROJECTS_COLLECTION)), toFirestore(toProjectInput(p)));
      });
      await batch.commit();
      setStatus({ text: 'Starter projects imported. Edit them as needed.', tone: 'success' });
    } catch {
      setStatus({ text: 'Import failed.', tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const set = <K extends keyof LocalProjectInput>(key: K, value: LocalProjectInput[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const statusTone = {
    idle: 'text-slate-600 dark:text-slate-300',
    error: 'text-rose-600 dark:text-rose-300',
    success: 'text-emerald-600 dark:text-emerald-300',
  }[status.tone];

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        These cards appear under “Local projects” on the{' '}
        <a href="/local#projects" className="underline" target="_blank" rel="noreferrer">
          Living Here
        </a>{' '}
        page. Hidden projects are kept here but not shown publicly. Completed projects are listed last.
      </p>

      {projects && projects.length === 0 && editingId === null && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm dark:border-white/20">
          <p>
            No projects saved yet, so the page is showing the built-in starter list. Import it to start editing, or
            add your own.
          </p>
          <button
            type="button"
            onClick={importStarters}
            disabled={busy}
            className={`${buttonClass} mt-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900`}
          >
            Import starter projects
          </button>
        </div>
      )}

      {editingId === null && (
        <button
          type="button"
          onClick={startNew}
          className={`${buttonClass} bg-indigo-600 text-white hover:bg-indigo-500`}
        >
          Add project
        </button>
      )}

      {status.text && <p className={`text-sm ${statusTone}`}>{status.text}</p>}

      {editingId !== null && (
        <form
          className="space-y-3 rounded-2xl border border-indigo-500/30 bg-white/70 p-4 dark:bg-white/5"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <h3 className="text-sm font-semibold">{editingId === 'new' ? 'New project' : 'Edit project'}</h3>
          <div>
            <label className={labelClass} htmlFor="lp-title">Title</label>
            <input id="lp-title" className={inputClass} value={draft.title} onChange={(e) => set('title', e.target.value)} maxLength={120} required />
          </div>
          <div>
            <label className={labelClass} htmlFor="lp-summary">
              Summary (shown on the card, {draft.summary.length}/{SUMMARY_MAX})
            </label>
            <textarea id="lp-summary" className={inputClass} rows={2} value={draft.summary} onChange={(e) => set('summary', e.target.value)} maxLength={SUMMARY_MAX} required />
          </div>
          <div>
            <label className={labelClass} htmlFor="lp-body">
              More detail (optional, shown under “Read more”; leave a blank line between paragraphs, {draft.body.length}/{BODY_MAX})
            </label>
            <textarea id="lp-body" className={inputClass} rows={5} value={draft.body} onChange={(e) => set('body', e.target.value)} maxLength={BODY_MAX} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className={labelClass} htmlFor="lp-status">Status</label>
              <select id="lp-status" className={inputClass} value={draft.status} onChange={(e) => set('status', e.target.value as ProjectStatus)}>
                {PROJECT_STATUSES.map((s) => (
                  <option key={s} value={s}>{PROJECT_STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="lp-order">Order (lower shows first)</label>
              <input id="lp-order" type="number" className={inputClass} value={draft.order} onChange={(e) => set('order', Number(e.target.value))} />
            </div>
            <label className="flex items-center gap-2 pt-5 text-sm">
              <input type="checkbox" checked={draft.published} onChange={(e) => set('published', e.target.checked)} />
              Show on the public page
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="lp-link">Link URL (optional)</label>
              <input id="lp-link" className={inputClass} value={draft.linkUrl} onChange={(e) => set('linkUrl', e.target.value)} placeholder="https://…" maxLength={500} />
            </div>
            <div>
              <label className={labelClass} htmlFor="lp-link-label">Link button label</label>
              <input id="lp-link-label" className={inputClass} value={draft.linkLabel} onChange={(e) => set('linkLabel', e.target.value)} placeholder="Find out more" maxLength={60} />
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="lp-image">Image (optional): a site path such as /images/area/voi-bike.png, or an https link</label>
            <input id="lp-image" className={inputClass} value={draft.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} maxLength={500} />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={busy} className={`${buttonClass} bg-indigo-600 text-white hover:bg-indigo-500`}>
              {busy ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={cancel} disabled={busy} className={`${buttonClass} border border-slate-300 dark:border-white/20`}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {projects === null ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 dark:divide-white/10 dark:border-white/10">
          {projects.map((project) => (
            <li key={project.id} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {project.title}
                  {!project.published && (
                    <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-[0.65rem] font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-200">
                      Hidden
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {PROJECT_STATUS_LABELS[project.status]} · order {project.order}
                  {project.updatedAt ? ` · updated ${new Date(project.updatedAt).toLocaleDateString('en-GB')}` : ''}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => startEdit(project)} disabled={busy} className={`${buttonClass} border border-slate-300 dark:border-white/20`}>
                  Edit
                </button>
                <button type="button" onClick={() => togglePublished(project)} disabled={busy} className={`${buttonClass} border border-slate-300 dark:border-white/20`}>
                  {project.published ? 'Hide' : 'Show'}
                </button>
                <button type="button" onClick={() => remove(project)} disabled={busy} className={`${buttonClass} border border-rose-300 text-rose-600 dark:border-rose-400/40 dark:text-rose-300`}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocalProjectsPanel;
