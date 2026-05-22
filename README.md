# Seeker

Seeker is a self-hosted job application tracking platform, designed with Grafana-inspired dashboards to organize and track application status for job seekers.

## Project Goals

A core objective of this project is to practice my skills in leveraging AI as both a development tool (code generation, PR reviews, commit assistance) and as product features built into the app itself (job description parsing, listing discovery, and stale application detection).

## AI Tools

- Opencode as CLI coding agent
- GitHub Copilot for code review and suggestions
- Claude Code for architectural design and planning

### Models

- Claude Sonnet 4.6
- GLM 5.1
- Qwen 3.6 Plus

## Tech Stack

- Next.js (App Router)
- TypeScript
- SQLite via Prisma ORM
- Auth.js
- Tailwind CSS
- shadcn/ui

## AI Features (Planned)

- **Job Description Parser** — paste a job posting URL or raw text when adding an application and the app extracts company, role, salary, deadline, and tech stack automatically. Outputs are validated against a typed schema; low-confidence fields are flagged rather than silently accepted.

- **Job Discovery Agent** — a background agent that searches LinkedIn, Indeed, and Glassdoor (via SerpAPI) for new listings matching your profile and adds relevant ones to your Wishlist. Each run is logged with the agent's reasoning steps and relevance scores.

- **Stale Application Detector** — flags applications with no activity past a set threshold and suggests a follow-up action.

## Pre-requisites (self-host)

- Docker & Docker Compose
- Google or GitHub OAuth app for authentication

## Known Bugs & Issues
