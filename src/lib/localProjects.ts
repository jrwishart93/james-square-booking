/**
 * Local projects and community updates shown on /local.
 *
 * Stored in the `localProjects` Firestore collection so admins can add, edit and
 * remove them from the admin dashboard. The starter list below is shown only
 * when the collection is empty (or unreachable), and can be imported into
 * Firestore from the admin panel as a starting point.
 */

export const LOCAL_PROJECTS_COLLECTION = 'localProjects';

export const PROJECT_STATUSES = ['ongoing', 'upcoming', 'in-progress', 'completed'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  ongoing: 'Ongoing',
  upcoming: 'Coming up',
  'in-progress': 'In progress',
  completed: 'Completed',
};

export const TITLE_MAX = 120;
export const SUMMARY_MAX = 400;
export const BODY_MAX = 4000;
export const URL_MAX = 500;
export const LINK_LABEL_MAX = 60;

export type LocalProject = {
  id: string;
  title: string;
  summary: string;
  /** Plain text. Blank lines separate paragraphs. Never rendered as HTML. */
  body: string;
  status: ProjectStatus;
  linkUrl: string;
  linkLabel: string;
  /** A site path such as /images/area/voi-bike.png, or an https URL. */
  imageUrl: string;
  /** Lower numbers show first. */
  order: number;
  published: boolean;
  /** Milliseconds since epoch, or null for starter content. */
  updatedAt: number | null;
};

export type LocalProjectInput = Omit<LocalProject, 'id' | 'updatedAt'>;

export const EMPTY_PROJECT: LocalProjectInput = {
  title: '',
  summary: '',
  body: '',
  status: 'ongoing',
  linkUrl: '',
  linkLabel: '',
  imageUrl: '',
  order: 100,
  published: true,
};

export const STARTER_PROJECTS: LocalProject[] = [
  {
    id: 'starter-dalry-community',
    title: 'Get involved around Dalry',
    summary:
      'Litter picks, buggy walks, park clean-ups and other community projects are organised through the local Dalry community Facebook group.',
    body:
      'The Friends of Dalry Community Park and neighbours across Dalry organise regular volunteering and social activities. It is a good way to meet people nearby and help look after the area.\n\nJoin the group to see upcoming events and how to take part.',
    status: 'ongoing',
    linkUrl: 'https://www.facebook.com/share/g/18piAygayV/?mibextid=wwXIfr',
    linkLabel: 'Join the Facebook group',
    imageUrl: '/images/area/Dalry-play park.PNG',
    order: 10,
    published: true,
    updatedAt: null,
  },
  {
    id: 'starter-voi',
    title: 'Voi e-bikes',
    summary:
      'Dockless Voi e-bikes operate around James Square. Bikes are usually beside the Co-op on Dalry Road and at the bottom end of Dalry Community Park.',
    body:
      'Bikes are unlocked and paid for in the Voi app, which also shows where the nearest bikes are right now. Discounts are available for groups including students, people over 60, people on low incomes and blue light workers.',
    status: 'ongoing',
    linkUrl: 'https://www.voi.com',
    linkLabel: 'Visit Voi',
    imageUrl: '/images/area/voi-bike.png',
    order: 20,
    published: true,
    updatedAt: null,
  },
  {
    id: 'starter-living-well-locally',
    title: 'Dalry: Living Well Locally',
    summary:
      'A City of Edinburgh Council project looking at wider pavements, safer junctions, cycle routes, planting and a possible Haymarket traffic filter.',
    body:
      'The Council consulted on its concept design and published the results in January 2025. The response was split (49% opposed, 46% in favour), and the Council said it would revisit the traffic filter, pavement widening, loading and the one-way system in the Caledonians and Orwells before going further.\n\nCheck the Council website for the latest position.',
    status: 'in-progress',
    linkUrl: 'https://consultationhub.edinburgh.gov.uk/sfc/dalry-living-well-locally/',
    linkLabel: 'Council project page',
    imageUrl: '',
    order: 30,
    published: true,
    updatedAt: null,
  },
];

function asString(value: unknown, max: number): string {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

function toMillis(value: unknown): number | null {
  if (value && typeof value === 'object' && 'toMillis' in value) {
    const fn = (value as { toMillis?: unknown }).toMillis;
    if (typeof fn === 'function') return (fn as () => number).call(value);
  }
  return typeof value === 'number' ? value : null;
}

/** Normalises a Firestore document into a LocalProject, tolerating missing fields. */
export function parseLocalProject(id: string, data: Record<string, unknown>): LocalProject {
  const status = PROJECT_STATUSES.includes(data.status as ProjectStatus)
    ? (data.status as ProjectStatus)
    : 'ongoing';
  return {
    id,
    title: asString(data.title, TITLE_MAX),
    summary: asString(data.summary, SUMMARY_MAX),
    body: asString(data.body, BODY_MAX),
    status,
    linkUrl: safeUrl(asString(data.linkUrl, URL_MAX)),
    linkLabel: asString(data.linkLabel, LINK_LABEL_MAX),
    imageUrl: safeUrl(asString(data.imageUrl, URL_MAX)),
    order: typeof data.order === 'number' && Number.isFinite(data.order) ? data.order : 100,
    published: data.published !== false,
    updatedAt: toMillis(data.updatedAt),
  };
}

/** Allows site-relative paths and http(s) URLs only, so a stored link can never run script. */
export function safeUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return '';
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : '';
  } catch {
    return '';
  }
}

/** Active work first, completed last; then by admin-set order, then title. */
export function sortProjects(projects: LocalProject[]): LocalProject[] {
  return [...projects].sort((a, b) => {
    const doneA = a.status === 'completed' ? 1 : 0;
    const doneB = b.status === 'completed' ? 1 : 0;
    if (doneA !== doneB) return doneA - doneB;
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });
}

export function splitParagraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** The editable fields of a project, without its id and timestamp. */
export function toProjectInput(project: LocalProject): LocalProjectInput {
  return {
    title: project.title,
    summary: project.summary,
    body: project.body,
    status: project.status,
    linkUrl: project.linkUrl,
    linkLabel: project.linkLabel,
    imageUrl: project.imageUrl,
    order: project.order,
    published: project.published,
  };
}

/** Returns an error message, or null when the input can be saved. */
export function validateProject(input: LocalProjectInput): string | null {
  if (!input.title.trim()) return 'Add a title.';
  if (input.title.length > TITLE_MAX) return `Keep the title under ${TITLE_MAX} characters.`;
  if (!input.summary.trim()) return 'Add a short summary.';
  if (input.summary.length > SUMMARY_MAX) return `Keep the summary under ${SUMMARY_MAX} characters.`;
  if (input.body.length > BODY_MAX) return `Keep the details under ${BODY_MAX} characters.`;
  if (input.linkUrl && !safeUrl(input.linkUrl)) return 'The link must start with https:// or /.';
  if (input.imageUrl && !safeUrl(input.imageUrl)) return 'The image must start with https:// or /.';
  if (input.linkUrl && !input.linkLabel.trim()) return 'Add a label for the link button.';
  if (input.linkLabel.length > LINK_LABEL_MAX) return `Keep the link label under ${LINK_LABEL_MAX} characters.`;
  if (!Number.isFinite(input.order)) return 'Order must be a number.';
  return null;
}
