import { describe, expect, it } from 'vitest';
import {
  EMPTY_PROJECT,
  STARTER_PROJECTS,
  parseLocalProject,
  safeUrl,
  sortProjects,
  splitParagraphs,
  toProjectInput,
  validateProject,
} from './localProjects';

describe('safeUrl', () => {
  it('keeps site paths and web links', () => {
    expect(safeUrl('/images/area/voi-bike.png')).toBe('/images/area/voi-bike.png');
    expect(safeUrl('https://www.voi.com')).toBe('https://www.voi.com/');
  });

  it('rejects script and protocol-relative links', () => {
    expect(safeUrl('javascript:alert(1)')).toBe('');
    expect(safeUrl('//evil.example')).toBe('');
    expect(safeUrl('not a url')).toBe('');
  });
});

describe('parseLocalProject', () => {
  it('fills defaults and drops unsafe values from a sparse document', () => {
    const project = parseLocalProject('x', { title: 'Park', status: 'bogus', linkUrl: 'javascript:void(0)' });
    expect(project).toMatchObject({ id: 'x', title: 'Park', status: 'ongoing', linkUrl: '', order: 100, published: true });
  });

  it('reads Firestore timestamps', () => {
    const project = parseLocalProject('x', { title: 'Park', updatedAt: { toMillis: () => 42 } });
    expect(project.updatedAt).toBe(42);
  });
});

describe('sortProjects', () => {
  it('lists completed projects last, then by order', () => {
    const [a, b, c] = STARTER_PROJECTS;
    const sorted = sortProjects([
      { ...a, order: 1, status: 'completed' },
      { ...b, order: 5 },
      { ...c, order: 2 },
    ]);
    expect(sorted.map((p) => p.id)).toEqual([c.id, b.id, a.id]);
  });
});

describe('splitParagraphs', () => {
  it('splits on blank lines and trims', () => {
    expect(splitParagraphs('One\n\n  Two  \n\n\n')).toEqual(['One', 'Two']);
  });
});

describe('validateProject', () => {
  const valid = { ...EMPTY_PROJECT, title: 'Park', summary: 'A park.' };

  it('accepts a minimal project', () => {
    expect(validateProject(valid)).toBeNull();
  });

  it('requires a link label when a link is set', () => {
    expect(validateProject({ ...valid, linkUrl: 'https://example.com' })).toMatch(/label/);
  });

  it('rejects unsafe links', () => {
    expect(validateProject({ ...valid, linkUrl: 'javascript:alert(1)', linkLabel: 'Go' })).toMatch(/link/);
  });

  it('keeps the starter projects valid', () => {
    for (const project of STARTER_PROJECTS) {
      expect(validateProject(toProjectInput(project))).toBeNull();
    }
  });
});
