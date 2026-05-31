# Seeker

Seeker is a self-hosted job application tracking platform, designed with Grafana-inspired dashboards to organize and track application status for job seekers.

## Project Goals

A core objective of this project is to practice my skills in leveraging AI as both a development tool (code generation, PR reviews, commit assistance) and as product features built into the app itself (job description parsing, listing discovery, and stale application detection).

## AI Tools

- Opencode as CLI coding agent
- GitHub Copilot for code review and suggestions
- Claude Code for architectural design and planning

### Models

- Claude Opus 4.6
- GLM 5.1
- Deepseek V4 Flash

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | Next.js 15 (App Router) + TypeScript |
| **UI** | Tailwind CSS + shadcn/ui |
| **Table** | TanStack Table v8 |
| **Drag and Drop** | dnd-kit |
| **Backend** | Turso (LibSQL) via Prisma ORM |
| **Auth** | Auth.js v5 (OAuth + session-based) |
| **Deployment** | Vercel (production) + Docker (self-host fallback) |

## Deployment

Two Vercel projects share the same repository, differentiated by environment variables:

### Production Project (real data)

| Variable | Value |
|---|---|
| `DEMO_MODE` | `false` |
| `DATABASE_URL` | `libsql://<db>-<org>.turso.io` |
| `DATABASE_AUTH_TOKEN` | Turso auth token |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | GitHub OAuth app |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth app |
| `AUTH_APPLE_ID` / `AUTH_APPLE_SECRET` | Apple OAuth app |
| `ADMIN_EMAIL` | Your email |

### Demo Project (preview / recruiter demo)

| Variable | Value |
|---|---|
| `DEMO_MODE` | `true` |
| `NEXT_PUBLIC_DEMO_MODE` | `true` |
| `DATABASE_URL` | Not needed |

OAuth buttons are disabled; access via "Continue to Dashboard" card with mock data.

### Deploy Rules

Only `main` branch deploys to production. All other branches and PRs are ignored — previews use the separate demo project (configured in `vercel.json`).

## Local Development

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

## Pre-requisites (self-host via Docker)

- Docker & Docker Compose
- Google or GitHub OAuth app for authentication

## AI Features (Planned)

- **Job Description Parser** — paste a job posting URL or raw text when adding an application and the app extracts company, role, salary, deadline, and tech stack automatically. Outputs are validated against a typed schema; low-confidence fields are flagged rather than silently accepted.

- **Job Discovery Agent** — a background agent that searches LinkedIn, Indeed, and Glassdoor (via SerpAPI) for new listings matching your profile and adds relevant ones to your Wishlist. Each run is logged with the agent's reasoning steps and relevance scores.

- **Stale Application Detector** — flags applications with no activity past a set threshold and suggests a follow-up action.
