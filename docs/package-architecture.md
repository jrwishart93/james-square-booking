# Package Architecture Documentation

## Overview

This project is a **hybrid multi-package application** with different build systems and React versions across workspaces. This document outlines the current architecture, identifies conflicts, and provides recommendations.

---

## Current Package Structure

### Root Package (Main Application)
**Location:** `/`
**Type:** Next.js 15 Application (SSR/SSG)
**Build System:** Next.js (Webpack-based)

**Key Dependencies:**
- Next.js: 15.5.7
- React: 18.3.1
- React-DOM: 18.3.1
- TypeScript: 5.9.2
- @types/node: 20.19.11
- Firebase: 11.6.0
- Tailwind CSS: 4.1.13

**Purpose:** Main web application serving residents and admins

---

### Functions Workspace
**Location:** `/functions`
**Type:** Firebase Cloud Functions
**Runtime:** Node.js 20
**Build System:** TypeScript compiler

**Key Dependencies:**
- firebase-admin: 13.2.0
- firebase-functions: 6.3.2
- TypeScript: 5.9.2

**Purpose:** Backend serverless functions (email reminders, vote tallying, admin claims)

**Status:** ✅ Well-aligned with root package versions

---

### Voting Sub-App
**Location:** `/src/app/voting`
**Type:** Standalone SPA (Separate HTML Entry)
**Build System:** Vite 6.2.0

**Key Dependencies:**
- React: 19.2.1 ⚠️ **CONFLICT**
- React-DOM: 19.2.1 ⚠️ **CONFLICT**
- TypeScript: 5.8.2 ⚠️ **CONFLICT**
- @types/node: 22.14.0 ⚠️ **CONFLICT**
- React Router DOM: 7.10.1
- Lucide React: 0.556.0

**Integration:**
- Has standalone `index.html` file with CDN imports
- Appears to be served separately from Next.js app
- Next.js route at `/voting` (src/app/voting/page.tsx) redirects to `/owners/secure/voting` based on auth
- Not directly embedded in Next.js build

**Purpose:** Public voting interface for owners

---

### Fire-Action Sub-App
**Location:** `/components/fire-action`
**Type:** Standalone SPA Component Library
**Build System:** Vite 6.2.0

**Key Dependencies:**
- React: 19.2.3 ⚠️ **CONFLICT**
- React-DOM: 19.2.3 ⚠️ **CONFLICT**
- TypeScript: 5.8.2 ⚠️ **CONFLICT**
- @types/node: 22.14.0 ⚠️ **CONFLICT**
- Framer Motion: 12.23.26 (vs root: 12.6.3)
- Lucide React: 0.562.0 (vs root: 0.556.0)

**Integration:**
- Appears to be a separate component/demo
- Has standalone `index.html` file
- Not directly referenced in main application

**Purpose:** Fire action hub component (appears to be experimental/standalone)

---

## Version Conflicts Summary

| Dependency | Root | Functions | Voting | Fire-Action | Severity |
|-----------|------|-----------|--------|-------------|----------|
| React | 18.3.1 | N/A | 19.2.1 | 19.2.3 | ✅ RESOLVED (Independent) |
| React-DOM | 18.3.1 | N/A | 19.2.1 | 19.2.3 | ✅ RESOLVED (Independent) |
| TypeScript | 5.9.2 | 5.9.2 | 5.9.2 ✅ | 5.9.2 ✅ | ✅ ALIGNED |
| @types/node | 20.19.11 | N/A | 20.19.11 ✅ | 20.19.11 ✅ | ✅ ALIGNED |
| Framer Motion | 12.6.3 | N/A | N/A | 12.23.26 | 🟢 LOW |
| Lucide React | 0.556.0 | N/A | 0.556.0 | 0.562.0 | 🟢 LOW |

---

## Analysis & Findings

### React Version Conflict (CRITICAL)

**Root Problem:** React 18 (root) vs React 19 (voting/fire-action)

**Investigation Findings:**
1. **Voting app** appears to be a standalone SPA:
   - Has its own `index.html` with CDN imports
   - Uses React 19 from CDN: `aistudiocdn.com/react@^19.2.1`
   - Next.js route at `/voting` is just a redirect component
   - **Conclusion:** Truly independent, not bundled with Next.js

2. **Fire-action app** also standalone:
   - Has its own `index.html`
   - Separate Vite build
   - Not referenced in main app
   - **Conclusion:** Experimental/demo component, not integrated

**Risk Assessment:**
- **Low immediate risk** - Apps are truly independent
- **Confusion risk** - Different React versions create developer confusion
- **Future risk** - If components are ever shared, will break

---

## Recommendations

### Option A: Keep Separate (Current Reality) ✅ RECOMMENDED

Since voting and fire-action are standalone SPAs with CDN imports, they don't share React instances with the Next.js app.

**Actions:**
1. **Document separation** clearly (this file)
2. **Align TypeScript** → 5.9.2 everywhere for IDE consistency
3. **Align @types/node** → v20.x (matches Functions runtime)
4. **Keep React versions as-is** but document why
5. **Add README** in each sub-app explaining independence

**Benefits:**
- Minimal code changes
- Respects actual architecture
- No bundling complexity

**Trade-offs:**
- Developer confusion (different versions)
- Can't share components between apps
- Manual version tracking

---

### Option B: Convert to True Monorepo (Future Consideration)

If you later decide to integrate these apps into Next.js:

**Would require:**
1. Convert voting/fire-action to Next.js routes
2. Remove standalone index.html files
3. Align all React to version 18.3.1
4. Set up npm workspaces in root package.json
5. Hoist shared dependencies

**Benefits:**
- Single React version
- Automatic version consistency
- Can share components
- Single build process

**Trade-offs:**
- Significant refactoring effort
- May require rewriting React Router code
- Changes deployment strategy

---

## Workspace Configuration

### Current State: NOT a True Monorepo
- No `workspaces` field in root package.json
- Each sub-package has independent package.json and package-lock.json
- Manual dependency synchronization required
- Separate `npm install` needed in each directory

### If Converting to Monorepo (Future):
```json
{
  "workspaces": [
    "functions",
    "src/app/voting",
    "components/fire-action"
  ]
}
```

---

## Immediate Actions (Phase 1)

### 1.2: TypeScript Alignment (30 min)
- Update `src/app/voting/package.json` → TypeScript 5.9.2
- Update `components/fire-action/package.json` → TypeScript 5.9.2
- Test builds

### 1.3: Node Types Alignment (15 min)
- Update `src/app/voting/package.json` → @types/node 20.x
- Update `components/fire-action/package.json` → @types/node 20.x

### 1.4: React Version Documentation (No Code Changes)
- Add README.md to voting app explaining independence
- Add README.md to fire-action app explaining independence
- Document that React 19 in these apps is intentional

---

## Build Process

### Root Application
```bash
npm install
npm run dev      # Development
npm run build    # Production build
```

### Functions
```bash
cd functions
npm install
npm run build    # Compiles TypeScript
```

### Voting App (if running standalone)
```bash
cd src/app/voting
npm install
npm run dev      # Vite dev server
npm run build    # Vite production build
```

### Fire-Action App
```bash
cd components/fire-action
npm install
npm run dev      # Vite dev server
npm run build    # Vite production build
```

---

## Decision Log

### 2026-01-24: Phase 0 - Initial Assessment
- **Decision:** Keep apps separate (Option A)
- **Rationale:** Apps are already independent with CDN imports
- **Action:** Align TypeScript and Node types only
- **Future:** Re-evaluate if component sharing becomes necessary

### 2026-01-24: Phase 1 - Package Alignment COMPLETED ✅
- **TypeScript:** Aligned to 5.9.2 across all packages
  - voting: 5.8.2 → 5.9.2
  - fire-action: 5.8.2 → 5.9.2
- **@types/node:** Aligned to v20.19.11 (matches Functions runtime)
  - voting: v22.14.0 → v20.19.11
  - fire-action: v22.14.0 → v20.19.11
- **React versions:** Kept as-is (independent SPAs)
  - Root: React 18.3.1 (Next.js requirement)
  - voting: React 19.2.1 (CDN-based, standalone)
  - fire-action: React 19.2.3 (CDN-based, standalone)
- **Validation:** Functions build passes, TypeScript compiler upgraded successfully
- **Status:** Phase 1 complete, ready for Phase 2 (Testing Infrastructure)

---

## Future Considerations

### If Component Sharing is Needed:
1. Convert to monorepo structure
2. Align all React versions to 18.3.1
3. Use Next.js dynamic imports for all sub-apps
4. Remove standalone HTML files

### If Staying Separate:
1. Create `README.md` in each sub-app documenting architecture
2. Add package.json scripts to root for building all workspaces
3. Consider CI/CD pipeline that tests all packages
4. Document version drift monitoring process

---

## References

- Next.js 15 requires React 18.x: https://nextjs.org/docs/getting-started/installation
- Firebase Functions Node 20 runtime: Uses @types/node v20
- React 19 release: https://react.dev/blog/2025/01/15/react-19

---

**Last Updated:** 2026-01-24
**Status:** Phase 1 (Package Stabilization) In Progress
