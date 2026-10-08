# NUBCPC Documentation

NUBCPC (Northern University Bangladesh Programming Community) is a university competitive-programming community platform for student profiles, verified coding-platform identities, unified ratings, leaderboards, contests, resources, notices, and administration.

## Documentation map

- [Product Requirements](./PRD.md) — product goals, users, features, requirements, and acceptance criteria.
- [Technical Requirements](./TRD.md) — architecture, stack, modules, interfaces, non-functional requirements, and implementation rules.
- [Design System](./DESIGN_SYSTEM.md) — visual language, tokens, typography, components, states, accessibility, and responsive rules.
- [System Architecture](./ARCHITECTURE.md) — application layers, data flow, integrations, and deployment topology.
- [Data Model](./DATA_MODEL.md) — Supabase entities, relationships, constraints, indexes, and data ownership.
- [Security](./SECURITY.md) — threat model, authentication, authorization, RLS, secrets, input validation, and incident response.
- [API & Integrations](./API.md) — Supabase and competitive-platform integration contracts.
- [Testing Strategy](./TESTING.md) — unit, integration, security, accessibility, and end-to-end testing.
- [Deployment & Operations](./DEPLOYMENT.md) — environments, configuration, releases, backups, monitoring, and rollback.
- [Contributing](./CONTRIBUTING.md) — branch, commit, PR, review, and coding conventions.
- [Roadmap](./ROADMAP.md) — phased delivery plan and future capabilities.

## Current implementation baseline

The current repository uses React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Motion, Supabase JS, Express, and external competitive-programming platform services.

The application currently exposes home, leaderboard, contests, contest detail, resources, notices, about, student profile, authentication modals, and an admin dashboard. The database schema includes profiles, coding profiles, rating history, leaderboard statistics, contests, participants, resources, notices, achievements, sync logs, departments, and rating configuration.

## Source of truth

When a document conflicts with implementation, use this order:

1. Security constraints and database RLS.
2. Approved product requirements.
3. Technical requirements and architecture.
4. Design system.
5. Existing implementation.

Any intentional deviation should be documented in an issue or PR.
