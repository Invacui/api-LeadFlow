# LeadFlow — Frontend Architecture Reference
> Next.js 14 · TypeScript · Tailwind · React Query · Zustand · App Router

---

## What We're Building

The LeadFlow frontend is a **Next.js 14 App Router** application. It serves two distinct user surfaces — a **corporate user dashboard** and an **admin panel** — with SSR where SEO or first-load data matters, and client-side interactivity for dynamic dashboards, real-time campaign stats, and the template/engagement builder.

The goal of this document is to be the single source of truth for every frontend decision: folder structure, component conventions, data fetching strategy, state management, code style rules, and library choices. If you're building a new feature, this doc tells you exactly where things go and how they should be written.

---

## Tech Stack

| Category | Library | Version | Why |
|---|---|---|---|
| Framework | Next.js | 14 (App Router) | SSR, SSG, route-level code split, server actions |
| Language | TypeScript | 5.x | Strict mode on everywhere |
| Styling | Tailwind CSS | 3.x | Utility-first, pairs well with component libs |
| Component Library | shadcn/ui | latest | Radix primitives + Tailwind, fully owned code |
| Server State | TanStack Query (React Query) | v5 | Caching, background refetch, mutations |
| Client State | Zustand | v4 | Auth state, UI state, no boilerplate |
| Form Handling | React Hook Form + Zod | latest | Client-side validation; backend uses Joi with equivalent rules |
| HTTP Client | Axios | v1 | Interceptors for auth headers + token refresh |
| Tables | TanStack Table | v8 | Leads list, campaign logs — complex tabular data |
| Charts | Recharts | v2 | Campaign analytics, token usage graphs |
| File Upload | react-dropzone | latest | Lead list CSV/XLSX upload with drag-and-drop |
| Notifications | Sonner | latest | Toast system |
| Date Handling | date-fns | v3 | Format timestamps, relative dates |
| Icons | Lucide React | latest | Consistent icon set |
| Animation | Framer Motion | v11 | Page transitions, skeleton reveals |
| SEO | next-sitemap | latest | Auto-generates sitemap.xml + robots.txt |
| Testing | Vitest + Testing Library | latest | Unit + integration tests |

---

## Folder Structure

```
leadflow-web/
│
├── public/
│   ├── favicon.ico
│   ├── og-image.png                 # Open Graph default image
│   └── robots.txt                   # Auto-managed by next-sitemap
│
├── src/
│   │
│   ├── app/                         ── NEXT.JS APP ROUTER ──
│   │   │
│   │   ├── (marketing)/             # Route group — public pages, no auth
│   │   │   ├── layout.tsx           # Marketing layout (navbar, footer)
│   │   │   ├── page.tsx             # Landing page (SSG)
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx         # Pricing page (SSG)
│   │   │   └── about/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (auth)/                  # Route group — login/signup pages
│   │   │   ├── layout.tsx           # Centered card layout
│   │   │   ├── login/
│   │   │   │   └── page.tsx         # Client component (form)
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── verify-email/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/             # Route group — protected corporate user area
│   │   │   ├── layout.tsx           # Sidebar + topbar layout (SSR auth check)
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx         # Overview: token balance, recent activity (SSR)
│   │   │   │
│   │   │   ├── leads/
│   │   │   │   ├── page.tsx         # Lead requests list (SSR initial data)
│   │   │   │   ├── upload/
│   │   │   │   │   └── page.tsx     # Upload / link new lead list (CSR form)
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx     # Lead request detail + leads table (SSR)
│   │   │   │       └── loading.tsx  # Skeleton loader
│   │   │   │
│   │   │   ├── templates/
│   │   │   │   ├── page.tsx         # Template list (SSR)
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx     # Template builder (CSR — interactive)
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx     # Template detail + preview (SSR + CSR hybrid)
│   │   │   │       └── loading.tsx
│   │   │   │
│   │   │   ├── campaigns/
│   │   │   │   ├── page.tsx         # Campaign list (SSR)
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx     # Campaign stats + logs (SSR + polling)
│   │   │   │       └── loading.tsx
│   │   │   │
│   │   │   ├── conversations/
│   │   │   │   ├── page.tsx         # Conversations list (SSR)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     # Conversation thread (CSR — real-time updates)
│   │   │   │
│   │   │   └── settings/
│   │   │       └── page.tsx         # Profile, corp info (CSR form)
│   │   │
│   │   ├── (admin)/                 # Route group — admin panel
│   │   │   ├── layout.tsx           # Admin sidebar layout (SSR role check)
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx         # Platform stats overview (SSR)
│   │   │   │   ├── users/
│   │   │   │   │   ├── page.tsx     # All users table (SSR)
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── lead-requests/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── campaigns/
│   │   │   │       └── page.tsx
│   │   │
│   │   ├── api/                     # Next.js Route Handlers (thin proxy layer)
│   │   │   └── auth/
│   │   │       └── refresh/
│   │   │           └── route.ts     # Handles httpOnly cookie refresh silently
│   │   │
│   │   ├── sitemap.ts               # Dynamic sitemap (Next.js native)
│   │   ├── robots.ts                # Robots rules (Next.js native)
│   │   ├── not-found.tsx            # Global 404 page
│   │   ├── error.tsx                # Global error boundary
│   │   ├── loading.tsx              # Global loading fallback
│   │   └── layout.tsx               # Root layout — fonts, providers, metadata
│   │
│   │
│   ├── components/                  ── UI COMPONENTS ──
│   │   │
│   │   ├── ui/                      # shadcn/ui generated components (never edit manually)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   │
│   │   ├── common/                  # Reusable non-feature components
│   │   │   ├── PageHeader.tsx       # Page title + subtitle + optional action button
│   │   │   ├── DataTable.tsx        # TanStack Table wrapper with pagination
│   │   │   ├── EmptyState.tsx       # Empty list illustrations + CTA
│   │   │   ├── ErrorBoundary.tsx    # Client-side error boundary wrapper
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ConfirmDialog.tsx    # Generic "are you sure?" dialog
│   │   │   ├── StatusBadge.tsx      # Coloured status chips (PENDING, DONE, etc.)
│   │   │   ├── TokenBadge.tsx       # Shows current token balance
│   │   │   └── FileDropzone.tsx     # react-dropzone wrapper with preview
│   │   │
│   │   ├── layout/                  # Layout-level components
│   │   │   ├── DashboardSidebar.tsx
│   │   │   ├── DashboardTopbar.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── MarketingNav.tsx
│   │   │
│   │   ├── leads/                   # Feature-scoped components
│   │   │   ├── LeadRequestCard.tsx
│   │   │   ├── LeadRequestTable.tsx
│   │   │   ├── LeadUploadForm.tsx
│   │   │   ├── LeadStatsBar.tsx     # Count, dups removed, status
│   │   │   └── LeadStatusTracker.tsx # Polling progress indicator
│   │   │
│   │   ├── templates/
│   │   │   ├── TemplateBuilderForm.tsx
│   │   │   ├── TemplatePreviewCard.tsx  # Shows sample email + WA side by side
│   │   │   ├── LeadListSelector.tsx     # Pick up to 2 lead lists
│   │   │   └── ToneSelector.tsx
│   │   │
│   │   ├── campaigns/
│   │   │   ├── CampaignStatsGrid.tsx    # Sent / replied / hot counters
│   │   │   ├── CampaignLogTable.tsx
│   │   │   ├── HotLeadsList.tsx
│   │   │   └── CampaignStatusBanner.tsx
│   │   │
│   │   ├── conversations/
│   │   │   ├── ConversationThread.tsx   # Message bubble list
│   │   │   ├── ConversationListItem.tsx
│   │   │   └── ManualReplyForm.tsx
│   │   │
│   │   └── admin/
│   │       ├── UserTable.tsx
│   │       ├── TokenAdjustDialog.tsx
│   │       ├── PlatformStatsGrid.tsx
│   │       └── SuspendUserDialog.tsx
│   │
│   │
│   ├── hooks/                       ── REACT QUERY HOOKS ──
│   │   ├── auth/
│   │   │   ├── useMe.ts             # GET /auth/me
│   │   │   ├── useLogin.ts          # POST /auth/login mutation
│   │   │   ├── useSignup.ts         # POST /auth/signup mutation
│   │   │   └── useLogout.ts         # POST /auth/logout mutation
│   │   │
│   │   ├── leads/
│   │   │   ├── useLeadRequests.ts   # GET /leads (list)
│   │   │   ├── useLeadRequest.ts    # GET /leads/:id
│   │   │   ├── useLeads.ts          # GET /leads/:id/leads (paginated)
│   │   │   ├── useUploadLead.ts     # POST /leads/upload mutation
│   │   │   └── useDeleteLead.ts     # DELETE /leads/:id mutation
│   │   │
│   │   ├── templates/
│   │   │   ├── useTemplates.ts
│   │   │   ├── useTemplate.ts
│   │   │   ├── useCreateTemplate.ts
│   │   │   ├── useUpdateTemplate.ts
│   │   │   ├── usePreviewTemplate.ts  # POST /templates/:id/preview
│   │   │   └── useLaunchTemplate.ts   # POST /templates/:id/launch
│   │   │
│   │   ├── campaigns/
│   │   │   ├── useCampaigns.ts
│   │   │   ├── useCampaign.ts
│   │   │   ├── useCampaignLogs.ts
│   │   │   ├── useHotLeads.ts
│   │   │   ├── usePauseCampaign.ts
│   │   │   └── useResumeCampaign.ts
│   │   │
│   │   ├── conversations/
│   │   │   ├── useConversations.ts
│   │   │   ├── useConversation.ts
│   │   │   └── useManualReply.ts
│   │   │
│   │   └── admin/
│   │       ├── useAdminUsers.ts
│   │       ├── useAdminStats.ts
│   │       ├── useAdjustTokens.ts
│   │       └── useSuspendUser.ts
│   │
│   │
│   ├── store/                       ── ZUSTAND STORES ──
│   │   ├── auth.store.ts            # user, accessToken, isAuthenticated, setUser, clearAuth
│   │   ├── ui.store.ts              # sidebarOpen, activeModal, globalLoading
│   │   └── demo.store.ts            # isDemoMode, demoTokensUsed
│   │
│   │
│   ├── lib/                         ── SHARED UTILITIES ──
│   │   ├── axios.ts                 # Axios instance + interceptors (auth header, refresh)
│   │   ├── queryClient.ts           # TanStack Query client config
│   │   ├── queryKeys.ts             # Centralised query key factory
│   │   └── utils.ts                 # cn() (clsx + twMerge), formatDate, truncate
│   │
│   │
│   ├── services/                    ── API CALL FUNCTIONS ──
│   │   ├── auth.service.ts          # Raw axios calls for auth endpoints
│   │   ├── leads.service.ts
│   │   ├── templates.service.ts
│   │   ├── campaigns.service.ts
│   │   ├── conversations.service.ts
│   │   └── admin.service.ts
│   │
│   │
│   ├── types/                       ── TYPESCRIPT TYPES ──
│   │   ├── api.types.ts             # API response wrappers, pagination meta
│   │   ├── auth.types.ts
│   │   ├── leads.types.ts
│   │   ├── templates.types.ts
│   │   ├── campaigns.types.ts
│   │   ├── conversations.types.ts
│   │   └── admin.types.ts
│   │
│   │
│   ├── schemas/                     ── ZOD VALIDATION SCHEMAS ──
│   │   ├── auth.schema.ts           # Align with backend Joi rules (same fields/constraints)
│   │   ├── leads.schema.ts
│   │   └── templates.schema.ts
│   │
│   │
│   ├── constants/
│   │   ├── routes.ts                # All route strings as constants
│   │   ├── queryKeys.ts             # Re-exported from lib/queryKeys.ts
│   │   └── industries.ts            # Industry enum values for dropdowns
│   │
│   │
│   └── middleware.ts                # Next.js middleware — auth redirect guard
│
│
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── next-sitemap.config.js
```

---

## High-Level Design (HLD)

```
┌─────────────────────────────────────────────────────────────┐
│                      BROWSER / CLIENT                       │
│                                                             │
│   React Components  ──  React Query Cache  ──  Zustand     │
│                                  │                         │
│              Axios Instance (with interceptors)             │
└──────────────────────────────────┬──────────────────────────┘
                                   │ HTTPS
┌──────────────────────────────────▼──────────────────────────┐
│                   NEXT.JS SERVER (Railway)                  │
│                                                             │
│  App Router                                                 │
│  ├── Server Components  ──  fetch() with server token       │
│  ├── Route Handlers     ──  /api/auth/refresh (cookie ops)  │
│  └── Middleware         ──  auth redirect guard             │
└──────────────────────────────────┬──────────────────────────┘
                                   │
┌──────────────────────────────────▼──────────────────────────┐
│              EXPRESS API  (leadflow-api on Railway)         │
│                    /api/v1/...                              │
└─────────────────────────────────────────────────────────────┘
```

### Rendering strategy per route

| Route | Strategy | Why |
|---|---|---|
| Landing, Pricing, About | **SSG** | No auth, static content, best SEO |
| `/dashboard` | **SSR** | First paint shows real data, no flash |
| `/leads` list | **SSR** | Initial data server-fetched, then React Query takes over |
| `/leads/:id` | **SSR** | Lead request detail preloaded |
| `/leads/upload` | **CSR** | Form-only, no SEO value |
| `/templates/new` | **CSR** | Interactive builder, Groq preview calls |
| `/templates/:id` | **SSR + CSR hybrid** | Template data SSR, preview interaction CSR |
| `/campaigns/:id` | **SSR + polling** | Initial stats SSR, live stats poll every 10s |
| `/conversations/:id` | **CSR** | Real-time message thread |
| `/admin/*` | **SSR** | Data tables, role check server-side |
| Auth pages | **CSR** | Forms only |

---

## Low-Level Design (LLD)

### Data Flow Pattern

Every feature follows this strict chain. Never skip a layer.

```
Page (Server Component)
  └── prefetches via fetch() with server session token
  └── dehydrates React Query cache (HydrationBoundary)
        └── Client Component
              └── useQuery hook (from hooks/)
                    └── service function (from services/)
                          └── axios instance (from lib/axios.ts)
                                └── Express API /api/v1/...
```

### Mutation pattern

```
User action (button click / form submit)
  └── useMutation hook (from hooks/)
        └── onSuccess → queryClient.invalidateQueries([queryKey])
        └── onError   → toast.error(err.message)
        └── service function (from services/)
              └── axios instance
```

---

## Import Aliases

Add these to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*":            ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/hooks/*":      ["src/hooks/*"],
      "@/store/*":      ["src/store/*"],
      "@/lib/*":        ["src/lib/*"],
      "@/services/*":   ["src/services/*"],
      "@/types/*":      ["src/types/*"],
      "@/schemas/*":    ["src/schemas/*"],
      "@/constants/*":  ["src/constants/*"]
    }
  }
}
```

And mirror in `next.config.ts`:

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: { typedRoutes: true },
};

export default nextConfig;
```

**Usage:**

```ts
// Correct
import { useLeadRequests } from '@/hooks/leads/useLeadRequests';
import { DataTable }       from '@/components/common/DataTable';
import { ROUTES }          from '@/constants/routes';

// Avoid relative paths that cross feature boundaries
import { useLeadRequests } from '../../../hooks/leads/useLeadRequests';
```

---

## React Query — Setup & Conventions

### Query client config (`lib/queryClient.ts`)

```ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:        60 * 1000,     // 1 min — don't refetch if fresh
      gcTime:           5 * 60 * 1000, // 5 min — keep in cache after unmount
      retry:            1,
      refetchOnWindowFocus: false,     // disable globally, opt-in per query
    },
    mutations: {
      onError: (err) => {
        // global mutation error handler
        console.error('[Mutation Error]', err);
      },
    },
  },
});
```

### Query key factory (`lib/queryKeys.ts`)

```ts
export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  leads: {
    all:    ()          => ['leads'] as const,
    list:   ()          => ['leads', 'list'] as const,
    detail: (id: string) => ['leads', 'detail', id] as const,
    items:  (id: string) => ['leads', 'detail', id, 'items'] as const,
  },
  templates: {
    all:    ()          => ['templates'] as const,
    list:   ()          => ['templates', 'list'] as const,
    detail: (id: string) => ['templates', 'detail', id] as const,
  },
  campaigns: {
    all:    ()          => ['campaigns'] as const,
    list:   ()          => ['campaigns', 'list'] as const,
    detail: (id: string) => ['campaigns', 'detail', id] as const,
    logs:   (id: string) => ['campaigns', 'detail', id, 'logs'] as const,
    hot:    (id: string) => ['campaigns', 'detail', id, 'hot'] as const,
  },
  conversations: {
    all:    ()          => ['conversations'] as const,
    list:   ()          => ['conversations', 'list'] as const,
    detail: (id: string) => ['conversations', 'detail', id] as const,
  },
  admin: {
    users:  ()          => ['admin', 'users'] as const,
    stats:  ()          => ['admin', 'stats'] as const,
    user:   (id: string) => ['admin', 'users', id] as const,
  },
};
```

### Hook pattern (example)

```ts
// hooks/leads/useLeadRequests.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys }     from '@/lib/queryKeys';
import { getLeadRequests } from '@/services/leads.service';
import type { LeadRequest } from '@/types/leads.types';

/**
 * Fetches the current user's lead requests list.
 * Data is stale after 1 minute, refetches in background.
 */
export function useLeadRequests() {
  return useQuery({
    queryKey: queryKeys.leads.list(),
    queryFn:  getLeadRequests,
    select: (data) => data.data, // unwrap { success, data } envelope
  });
}
```

### SSR prefetch pattern (server component)

```tsx
// app/(dashboard)/leads/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getLeadRequestsServer } from '@/services/leads.service.server';
import { queryKeys }              from '@/lib/queryKeys';
import { LeadsPageClient }        from '@/components/leads/LeadsPageClient';

/**
 * SSR: prefetches lead requests so the client hydrates with data immediately.
 * No loading spinner on first paint.
 */
export default async function LeadsPage() {
  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: queryKeys.leads.list(),
    queryFn:  getLeadRequestsServer,
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <LeadsPageClient />
    </HydrationBoundary>
  );
}
```

### Polling (live campaign stats)

```ts
// hooks/campaigns/useCampaign.ts
export function useCampaign(id: string) {
  return useQuery({
    queryKey: queryKeys.campaigns.detail(id),
    queryFn:  () => getCampaign(id),
    // Poll every 10s only while campaign is running
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      return status === 'RUNNING' ? 10_000 : false;
    },
  });
}
```

---

## Zustand Stores

### Auth store (`store/auth.store.ts`)

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/auth.types';

interface AuthState {
  user:            User | null;
  accessToken:     string | null;
  isAuthenticated: boolean;
  setAuth:  (user: User, token: string) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:            null,
      accessToken:     null,
      isAuthenticated: false,
      setAuth:  (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
      setToken: (accessToken)       => set({ accessToken }),
      clearAuth: ()                 => set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    { name: 'lf-auth', partialize: (s) => ({ user: s.user }) }
    // Only persist user to localStorage — never persist accessToken
  )
);
```

### UI store (`store/ui.store.ts`)

```ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen:  boolean;
  activeModal:  string | null;
  toggleSidebar: () => void;
  openModal:    (id: string) => void;
  closeModal:   () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen:  true,
  activeModal:  null,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openModal:    (id) => set({ activeModal: id }),
  closeModal:   () => set({ activeModal: null }),
}));
```

---

## Axios Instance & Token Refresh

```ts
// lib/axios.ts
import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/v1',
  withCredentials: true, // send httpOnly refresh cookie
});

// ── Request interceptor: attach access token ──────────────────────────────
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor: silent token refresh on 401 ────────────────────
let isRefreshing = false;
let failedQueue: Array<{ resolve: (t: string) => void; reject: (e: unknown) => void }> = [];

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status !== 401 || original._retry) {
      return Promise.reject(err);
    }
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }
    original._retry = true;
    isRefreshing = true;
    try {
      // Call Next.js route handler which has access to httpOnly cookie
      const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
      const newToken = data.accessToken;
      useAuthStore.getState().setToken(newToken);
      failedQueue.forEach((p) => p.resolve(newToken));
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (refreshErr) {
      failedQueue.forEach((p) => p.reject(refreshErr));
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
      failedQueue = [];
    }
  }
);
```

---

## Middleware — Auth Route Guard

```ts
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS  = ['/', '/pricing', '/about', '/login', '/signup', '/forgot-password'];
const ADMIN_PATHS   = ['/admin'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('lf-refresh')?.value;

  // Public paths — always allow
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // No token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Admin paths — role check handled server-side in layout.tsx
  // Middleware only checks token existence, not role (role needs DB lookup)
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
```

---

## SSR Components List

These page-level components run on the server. They call the Express API directly with a server-side session token (not through Axios). They hydrate the React Query cache before the page reaches the browser.

| Component | Data Prefetched | Notes |
|---|---|---|
| `app/(dashboard)/dashboard/page.tsx` | `GET /auth/me` | Token balance, user info |
| `app/(dashboard)/leads/page.tsx` | `GET /leads` | Lead requests list |
| `app/(dashboard)/leads/[id]/page.tsx` | `GET /leads/:id` | Lead request detail |
| `app/(dashboard)/templates/page.tsx` | `GET /templates` | Template list |
| `app/(dashboard)/templates/[id]/page.tsx` | `GET /templates/:id` | Template + sample preview |
| `app/(dashboard)/campaigns/page.tsx` | `GET /campaigns` | Campaign list |
| `app/(dashboard)/campaigns/[id]/page.tsx` | `GET /campaigns/:id`, `GET /campaigns/:id/logs` | Stats + logs |
| `app/(dashboard)/conversations/page.tsx` | `GET /conversations` | Conversation list |
| `app/(admin)/admin/page.tsx` | `GET /admin/stats` | Platform metrics |
| `app/(admin)/admin/users/page.tsx` | `GET /admin/users` | User table |
| `app/(admin)/admin/lead-requests/page.tsx` | `GET /admin/lead-requests` | All lead requests |
| `app/(dashboard)/layouts/layout.tsx` | `GET /auth/me` | Role check, redirects non-corp |
| `app/(admin)/layout.tsx` | `GET /auth/me` | Role check, redirects non-admin |

---

## Code Conventions

### Component structure

Every component follows this exact top-to-bottom order:

```tsx
'use client'; // only if needed — omit for server components

// 1. React imports
import { useState, useCallback } from 'react';

// 2. Third-party
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// 3. Internal — aliases only, ordered: components → hooks → store → lib → types
import { DataTable }        from '@/components/common/DataTable';
import { useLeadRequests }  from '@/hooks/leads/useLeadRequests';
import { useAuthStore }     from '@/store/auth.store';
import { cn }               from '@/lib/utils';
import type { LeadRequest } from '@/types/leads.types';

// 4. Local schema / constants
import { createLeadSchema } from '@/schemas/leads.schema';

// ── Types ──────────────────────────────────────────────────────────────────

interface LeadUploadFormProps {
  /** Called with the new LeadRequest id after successful upload */
  onSuccess: (id: string) => void;
  className?: string;
}

// ── Component ──────────────────────────────────────────────────────────────

/**
 * LeadUploadForm
 *
 * Handles CSV/XLSX lead list upload with industry selection and description.
 * Calls POST /leads/upload. On success invalidates the leads list cache.
 *
 * @example
 * <LeadUploadForm onSuccess={(id) => router.push(`/leads/${id}`)} />
 */
export function LeadUploadForm({ onSuccess, className }: LeadUploadFormProps) {
  // hooks first
  const { mutate, isPending } = useUploadLead();
  const [preview, setPreview] = useState<File | null>(null);

  // handlers
  const handleSubmit = useCallback(() => {
    // ...
  }, []);

  // early returns / guards
  if (!preview) return <FileDropzone onDrop={setPreview} />;

  // render
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* ... */}
    </div>
  );
}
```

### Lazy loading

Use `next/dynamic` for any component that is heavy, below the fold, or only shown conditionally:

```ts
// Heavy chart — not needed on first paint
const CampaignChart = dynamic(
  () => import('@/components/campaigns/CampaignChart'),
  { loading: () => <Skeleton className="h-64 w-full" />, ssr: false }
);

// Admin-only dialog — only rendered when modal is open
const TokenAdjustDialog = dynamic(
  () => import('@/components/admin/TokenAdjustDialog'),
  { ssr: false }
);
```

**Rule:** Any component not visible on first paint should be `dynamic`. Any component that uses `window`, `localStorage`, or browser APIs must have `ssr: false`.

### LFT (Left-to-right) checks — defensive rendering

Always check loading → error → empty → data in that order. Never skip a state:

```tsx
// Always handle all four states
function LeadsList() {
  const { data, isLoading, isError, error } = useLeadRequests();

  if (isLoading) return <LeadRequestSkeleton />;
  if (isError)   return <ErrorBoundary message={error.message} />;
  if (!data?.length) return <EmptyState title="No lead lists yet" cta="Upload your first list" />;

  return <LeadRequestTable data={data} />;
}
```

### Preloading (link hover intent)

```tsx
import { useRouter } from 'next/navigation';

// Prefetch on hover for instant navigation
function LeadRequestCard({ id }: { id: string }) {
  const router = useRouter();

  return (
    <div
      onMouseEnter={() => router.prefetch(`/leads/${id}`)}
      onClick={() => router.push(`/leads/${id}`)}
    >
      {/* ... */}
    </div>
  );
}
```

### Image optimisation

Always use `next/image`. Never use `<img>` tags:

```tsx
import Image from 'next/image';

// Always specify width, height, and alt
<Image src="/og-image.png" width={1200} height={630} alt="LeadFlow dashboard" priority />
```

### Error boundaries

Wrap every major page section in an `ErrorBoundary`:

```tsx
<ErrorBoundary fallback={<SectionErrorFallback />}>
  <CampaignStatsGrid campaignId={id} />
</ErrorBoundary>
```

### JSDoc requirements

All exported functions, hooks, components, and service functions must have JSDoc:

```ts
/**
 * Fetches paginated leads for a given lead request.
 *
 * @param leadRequestId - The id of the parent LeadRequest
 * @param page - Page number (1-indexed)
 * @param limit - Items per page (default 50)
 * @returns Paginated list of Lead records with meta
 */
export async function getLeads(leadRequestId: string, page = 1, limit = 50) {
  return api.get(`/leads/${leadRequestId}/leads`, { params: { page, limit } });
}
```

### Strict TypeScript rules (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

---

## Sitemap & SEO

### Native Next.js sitemap (`app/sitemap.ts`)

```ts
import { MetadataRoute } from 'next';

/**
 * Dynamic sitemap. Static public routes are hardcoded.
 * Dashboard/admin routes are excluded (require auth).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://leadflow.app',          lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: 'https://leadflow.app/pricing',   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://leadflow.app/about',     lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.5 },
  ];
}
```

### Robots (`app/robots.ts`)

```ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/dashboard', '/admin', '/api'] },
    ],
    sitemap: 'https://leadflow.app/sitemap.xml',
  };
}
```

### Page-level metadata (SSR pages)

```tsx
// app/(dashboard)/leads/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Lead Lists — LeadFlow',
  description: 'Manage and view your uploaded lead lists.',
  robots: { index: false }, // dashboard pages should not be indexed
};
```

---

## All API Calls — Services Layer

All raw API calls live in `services/`. Hooks consume these. Components never call `api.*` directly.

### `services/auth.service.ts`

```ts
import { api } from '@/lib/axios';
import type { LoginDto, SignupDto, AuthResponse } from '@/types/auth.types';

export const authService = {
  login:              (dto: LoginDto)       => api.post<AuthResponse>('/auth/login', dto),
  signup:             (dto: SignupDto)      => api.post('/auth/signup', dto),
  logout:             ()                   => api.post('/auth/logout'),
  me:                 ()                   => api.get('/auth/me'),
  verifyEmail:        (token: string)      => api.post(`/auth/verify-email/${token}`),
  resendVerification: (email: string)      => api.post('/auth/resend-verification', { email }),
  forgotPassword:     (email: string)      => api.post('/auth/forgot-password', { email }),
  resetPassword:      (token: string, password: string) =>
                        api.post('/auth/reset-password', { token, password }),
};
```

### `services/leads.service.ts`

```ts
import { api } from '@/lib/axios';
import type { CreateLeadDto, PaginationParams } from '@/types/leads.types';

export const leadsService = {
  list:       ()                         => api.get('/leads'),
  get:        (id: string)               => api.get(`/leads/${id}`),
  getLeads:   (id: string, p: PaginationParams) =>
                api.get(`/leads/${id}/leads`, { params: p }),
  getFile:    (id: string)               => api.get(`/leads/${id}/file`),
  upload:     (dto: CreateLeadDto)       => api.post('/leads/upload', dto, {
                headers: { 'Content-Type': 'multipart/form-data' }
              }),
  link:       (dto: CreateLeadDto)       => api.post('/leads/link', dto),
  remove:     (id: string)               => api.delete(`/leads/${id}`),
};
```

### `services/templates.service.ts`

Launch requires body `{ name: string; leadListIds: string[] }` (campaign name and at least one lead list id).

```ts
import { api } from '@/lib/axios';
import type { CreateTemplateDto, UpdateTemplateDto, LaunchCampaignDto } from '@/types/templates.types';

export const templatesService = {
  list:    ()                              => api.get('/templates'),
  get:     (id: string)                    => api.get(`/templates/${id}`),
  create:  (dto: CreateTemplateDto)       => api.post('/templates', dto),
  update:  (id: string, dto: UpdateTemplateDto) => api.patch(`/templates/${id}`, dto),
  remove:  (id: string)                   => api.delete(`/templates/${id}`),
  preview: (id: string)                   => api.post(`/templates/${id}/preview`),
  launch:  (id: string, dto: LaunchCampaignDto) =>
            api.post(`/templates/${id}/launch`, dto),
};
```

### `services/campaigns.service.ts`

```ts
import { api } from '@/lib/axios';

export const campaignsService = {
  list:     ()             => api.get('/campaigns'),
  get:      (id: string)   => api.get(`/campaigns/${id}`),
  logs:     (id: string, page = 1) => api.get(`/campaigns/${id}/logs`, { params: { page } }),
  hotLeads: (id: string)   => api.get(`/campaigns/${id}/hot-leads`),
  pause:    (id: string)   => api.patch(`/campaigns/${id}/pause`),
  resume:   (id: string)   => api.patch(`/campaigns/${id}/resume`),
};
```

### `services/conversations.service.ts`

Reply requires `content` and `channel` (`EMAIL` or `WHATSAPP`) to match the backend validator.

```ts
import { api } from '@/lib/axios';

export type ReplyPayload = { content: string; channel: 'EMAIL' | 'WHATSAPP' };

export const conversationsService = {
  list:   (status?: string)  => api.get('/conversations', { params: { status } }),
  get:    (id: string)       => api.get(`/conversations/${id}`),
  reply:  (id: string, payload: ReplyPayload) =>
            api.post(`/conversations/${id}/reply`, payload),
};
```

### `services/admin.service.ts`

Token update body uses `tokenBalance` (number), not `amount`. Suspend uses `suspend` (boolean).

```ts
import { api } from '@/lib/axios';

export const adminService = {
  users:          (page = 1)              => api.get('/admin/users', { params: { page } }),
  user:           (id: string)            => api.get(`/admin/users/${id}`),
  stats:          ()                      => api.get('/admin/stats'),
  leadRequests:   (page = 1)              => api.get('/admin/lead-requests', { params: { page } }),
  campaigns:      (page = 1)              => api.get('/admin/campaigns', { params: { page } }),
  adjustTokens:   (id: string, tokenBalance: number) =>
                    api.patch(`/admin/users/${id}/tokens`, { tokenBalance }),
  suspend:        (id: string, suspend: boolean) =>
                    api.patch(`/admin/users/${id}/suspend`, { suspend }),
  deleteUser:     (id: string)            => api.delete(`/admin/users/${id}`),
};
```

---

## Environment Variables

```env
# API
NEXT_PUBLIC_API_URL=https://api.leadflow.app

# App URL (used in sitemap, OG tags)
NEXT_PUBLIC_APP_URL=https://leadflow.app

# Used server-side only (not NEXT_PUBLIC_)
# These are set in Next.js server context for SSR fetch calls
API_URL=https://api.leadflow.app
INTERNAL_API_SECRET=<same as backend INTERNAL_SERVICE_KEY>
```

---

## Constants — Routes

```ts
// constants/routes.ts
export const ROUTES = {
  home:       '/',
  pricing:    '/pricing',
  login:      '/login',
  signup:     '/signup',

  dashboard:  '/dashboard',

  leads:      '/leads',
  leadUpload: '/leads/upload',
  lead:       (id: string) => `/leads/${id}`,

  templates:     '/templates',
  templateNew:   '/templates/new',
  template:      (id: string) => `/templates/${id}`,

  campaigns:   '/campaigns',
  campaign:    (id: string) => `/campaigns/${id}`,

  conversations: '/conversations',
  conversation:  (id: string) => `/conversations/${id}`,

  settings: '/settings',

  admin: {
    root:         '/admin',
    users:        '/admin/users',
    user:         (id: string) => `/admin/users/${id}`,
    leadRequests: '/admin/lead-requests',
    campaigns:    '/admin/campaigns',
  },
} as const;
```

---

## Build Order (Frontend)

| Phase | What to build |
|---|---|
| 1 | Project setup: Next.js, Tailwind, shadcn/ui, Axios, React Query, Zustand, aliases |
| 2 | Auth pages + Zustand auth store + token refresh interceptor + middleware |
| 3 | Dashboard layout: sidebar, topbar, mobile nav |
| 4 | Leads module: upload form, lead requests list, detail page, polling status tracker |
| 5 | Templates module: builder form, Groq preview card, lead list selector, launch flow |
| 6 | Campaigns module: stats grid, log table, hot leads list, pause/resume |
| 7 | Conversations module: thread view, manual reply, status filter |
| 8 | Admin panel: user table, token adjust dialog, platform stats |
| 9 | Marketing pages: landing, pricing (SSG) + sitemap + OG metadata |
| 10 | Vitest unit tests for hooks + service functions |

---

*LeadFlow Frontend v1.0 — Architecture Reference*
