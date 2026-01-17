'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';

type LocalSectionCategory = 'useful-info' | 'about-james-square';
type LocalSection = {
  id: string;
  title: string;
  body: string;
  category: LocalSectionCategory;
  linkUrl?: string;
  linkLabel?: string;
  order: number;
  isActive: boolean;
  createdBy?: string;
};

type FormState = {
  title: string;
  body: string;
  category: LocalSectionCategory;
  linkUrl: string;
  linkLabel: string;
  isActive: boolean;
};

type AdminStatus = 'checking' | 'denied' | 'ready';

const DEFAULT_FORM_STATE: FormState = {
  title: '',
  body: '',
  category: 'useful-info',
  linkUrl: '',
  linkLabel: '',
  isActive: true,
};

const categoryLabels: Record<LocalSectionCategory, string> = {
  'useful-info': 'Useful Info',
  'about-james-square': 'About James Square',
};

export default function AdminLocalSectionsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<AdminStatus>('checking');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sections, setSections] = useState<LocalSection[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [sectionsError, setSectionsError] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (!user) {
        setStatus('denied');
        return;
      }

      try {
        const [tokenResult, userSnap] = await Promise.all([
          user.getIdTokenResult(),
          getDoc(doc(db, 'users', user.uid)),
        ]);
        const isAdmin = tokenResult.claims.admin === true || userSnap.data()?.isAdmin === true;
        setStatus(isAdmin ? 'ready' : 'denied');
      } catch (error) {
        console.error('Failed to verify admin access', error);
        setStatus('denied');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (status !== 'ready') return;
    const sectionsQuery = query(
      collection(db, 'localSections'),
      orderBy('category', 'asc'),
      orderBy('order', 'asc')
    );

    const unsubscribe = onSnapshot(
      sectionsQuery,
      (snapshot) => {
        const nextSections = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Omit<LocalSection, 'id'>;
          return {
            id: docSnap.id,
            ...data,
            linkUrl: data.linkUrl ?? undefined,
            linkLabel: data.linkLabel ?? undefined,
          };
        });
        setSections(nextSections);
        setSectionsLoading(false);
        setSectionsError(null);
      },
      (error) => {
        console.error('Failed to load local sections', error);
        setSectionsError('Unable to load local sections.');
        setSectionsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [status]);

  useEffect(() => {
    if (status === 'denied') {
      router.replace('/');
    }
  }, [status, router]);

  const sortedSections = useMemo(() => {
    return [...sections].sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.order - b.order;
    });
  }, [sections]);

  const sectionPositions = useMemo(() => {
    const positions = new Map<string, { index: number; total: number }>();
    const grouped = new Map<LocalSectionCategory, LocalSection[]>();
    sortedSections.forEach((section) => {
      const list = grouped.get(section.category) ?? [];
      list.push(section);
      grouped.set(section.category, list);
    });
    grouped.forEach((list) => {
      list.forEach((section, index) => {
        positions.set(section.id, { index, total: list.length });
      });
    });
    return positions;
  }, [sortedSections]);

  const resetForm = () => {
    setFormState(DEFAULT_FORM_STATE);
    setEditingId(null);
    setFormError(null);
  };

  const handleEdit = (section: LocalSection) => {
    setFormState({
      title: section.title,
      body: section.body,
      category: section.category,
      linkUrl: section.linkUrl ?? '',
      linkLabel: section.linkLabel ?? '',
      isActive: section.isActive,
    });
    setEditingId(section.id);
    setFormError(null);
  };

  const handleMove = async (sectionId: string, direction: -1 | 1) => {
    const current = sections.find((section) => section.id === sectionId);
    if (!current) return;
    const categorySections = sections
      .filter((section) => section.category === current.category)
      .sort((a, b) => a.order - b.order);
    const index = categorySections.findIndex((section) => section.id === sectionId);
    const target = categorySections[index + direction];
    if (!target) return;

    const batch = writeBatch(db);
    batch.update(doc(db, 'localSections', current.id), {
      order: target.order,
      updatedAt: serverTimestamp(),
    });
    batch.update(doc(db, 'localSections', target.id), {
      order: current.order,
      updatedAt: serverTimestamp(),
    });
    await batch.commit();
  };

  const handleToggleActive = async (section: LocalSection) => {
    await updateDoc(doc(db, 'localSections', section.id), {
      isActive: !section.isActive,
      updatedAt: serverTimestamp(),
    });
  };

  const handleDelete = async (section: LocalSection) => {
    const confirmed = window.confirm(`Delete "${section.title}"? This cannot be undone.`);
    if (!confirmed) return;
    await deleteDoc(doc(db, 'localSections', section.id));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!formState.title.trim() || !formState.body.trim() || !formState.category) {
      setFormError('Title, body, and category are required.');
      return;
    }

    if (!currentUser) {
      setFormError('You must be signed in to manage sections.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formState.title.trim(),
        body: formState.body.trim(),
        category: formState.category,
        linkUrl: formState.linkUrl.trim() || null,
        linkLabel: formState.linkLabel.trim() || null,
        isActive: formState.isActive,
      };

      if (editingId) {
        await updateDoc(doc(db, 'localSections', editingId), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
      } else {
        const orderQuery = query(
          collection(db, 'localSections'),
          where('category', '==', formState.category),
          orderBy('order', 'desc'),
          limit(1)
        );
        const orderSnap = await getDocs(orderQuery);
        const nextOrder = orderSnap.empty ? 1 : (orderSnap.docs[0].data().order as number) + 1;

        await addDoc(collection(db, 'localSections'), {
          ...payload,
          order: nextOrder,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: currentUser.uid,
        });
      }

      resetForm();
    } catch (error) {
      console.error('Failed to save section', error);
      setFormError('Unable to save section. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'checking') {
    return (
      <main className="jqs-gradient-bg min-h-screen">
        <div className="max-w-5xl mx-auto p-6">
          <div className="jqs-glass rounded-2xl p-4">Checking admin access…</div>
        </div>
      </main>
    );
  }

  if (status === 'denied') {
    return (
      <main className="jqs-gradient-bg min-h-screen">
        <div className="max-w-5xl mx-auto p-6">
          <div className="jqs-glass rounded-2xl p-4 text-red-600 dark:text-red-400">
            Access denied. Redirecting…
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="jqs-gradient-bg min-h-screen">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold">Local Page Sections</h1>
          <p className="text-sm opacity-80">
            Manage Useful Info and About James Square sections. Updates appear immediately on the public page.
          </p>
        </header>

        <section className="jqs-glass rounded-2xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">
              {editingId ? 'Edit section' : 'Add section'}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-medium underline underline-offset-4"
              >
                Cancel edit
              </button>
            )}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm space-y-1">
                <span className="font-medium">Title</span>
                <input
                  type="text"
                  value={formState.title}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, title: event.target.value }))
                  }
                  className="w-full rounded-xl border border-white/20 bg-white/60 px-3 py-2 text-sm"
                  placeholder="Section title"
                />
              </label>

              <label className="text-sm space-y-1">
                <span className="font-medium">Category</span>
                <select
                  value={formState.category}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      category: event.target.value as LocalSectionCategory,
                    }))
                  }
                  className="w-full rounded-xl border border-white/20 bg-white/60 px-3 py-2 text-sm"
                >
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="text-sm space-y-1 block">
              <span className="font-medium">Body</span>
              <textarea
                value={formState.body}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, body: event.target.value }))
                }
                className="w-full min-h-[160px] rounded-xl border border-white/20 bg-white/60 px-3 py-2 text-sm"
                placeholder="Main text for this section"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm space-y-1">
                <span className="font-medium">Link URL (optional)</span>
                <input
                  type="url"
                  value={formState.linkUrl}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, linkUrl: event.target.value }))
                  }
                  className="w-full rounded-xl border border-white/20 bg-white/60 px-3 py-2 text-sm"
                  placeholder="https://example.com"
                />
              </label>

              <label className="text-sm space-y-1">
                <span className="font-medium">Link label (optional)</span>
                <input
                  type="text"
                  value={formState.linkLabel}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, linkLabel: event.target.value }))
                  }
                  className="w-full rounded-xl border border-white/20 bg-white/60 px-3 py-2 text-sm"
                  placeholder="Read more"
                />
              </label>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formState.isActive}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, isActive: event.target.checked }))
                }
                className="h-4 w-4"
              />
              Active (visible on public page)
            </label>

            {formError && <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/70 px-5 py-2 text-sm font-medium shadow-sm transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Saving…' : editingId ? 'Save changes' : 'Add section'}
            </button>
          </form>
        </section>

        <section className="jqs-glass rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">All sections</h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-sm font-medium underline underline-offset-4"
            >
              Add section
            </button>
          </div>

          {sectionsLoading && <div className="text-sm">Loading sections…</div>}
          {sectionsError && <div className="text-sm text-red-600 dark:text-red-400">{sectionsError}</div>}

          {!sectionsLoading && !sectionsError && sortedSections.length === 0 && (
            <div className="text-sm text-[color:var(--text-muted)]">No sections yet.</div>
          )}

          <div className="space-y-3">
            {sortedSections.map((section) => {
              const position = sectionPositions.get(section.id);
              const isFirst = position?.index === 0;
              const isLast = position ? position.index === position.total - 1 : false;
              return (
                <div
                  key={section.id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/20 bg-white/50 px-4 py-3 text-sm md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <div className="font-semibold">{section.title}</div>
                    <div className="text-xs text-[color:var(--text-muted)]">
                      {categoryLabels[section.category]} · Order {section.order} ·{' '}
                      {section.isActive ? 'Active' : 'Hidden'}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleMove(section.id, -1)}
                      disabled={isFirst}
                      className="rounded-full border border-white/20 bg-white/60 px-3 py-1 text-xs font-medium transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Move up
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(section.id, 1)}
                      disabled={isLast}
                      className="rounded-full border border-white/20 bg-white/60 px-3 py-1 text-xs font-medium transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Move down
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(section)}
                      className="rounded-full border border-white/20 bg-white/60 px-3 py-1 text-xs font-medium transition hover:bg-white/80"
                    >
                      {section.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(section)}
                      className="rounded-full border border-white/20 bg-white/60 px-3 py-1 text-xs font-medium transition hover:bg-white/80"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(section)}
                      className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
