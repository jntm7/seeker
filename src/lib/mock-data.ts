import { ApplicationStatus, EventType } from "@/generated/prisma/client"

export type MockApplication = {
  id: string
  roleTitle: string
  company: string
  status: ApplicationStatus
  dateApplied: string | null
  location: string | null
  jobUrl: string | null
  notes: string | null
  updatedAt: string
}

export type MockEvent = {
  id: string
  applicationId: string
  eventType: EventType
  eventDate: string
  notes: string | null
}

export type MockStat = {
  label: string
  value: number
  trend?: string
}

const companies = [
  "Shopify", "Google", "Stripe", "Vercel", "Figma",
  "Notion", "Linear", "Supabase", "PlanetScale", "Railway",
  "Cloudflare", "Datadog", "Square", "Block", "Mercy",
]

const roles = [
  "Software Engineer Intern", "Junior Frontend Developer", "Full Stack Engineer",
  "Backend Engineer", "Platform Engineer", "SDET Intern",
  "DevOps Engineer", "Product Engineer", "React Developer",
  "ML Engineer Intern",
]

const locations = [
  "Toronto, ON", "San Francisco, CA", "Remote", "New York, NY",
  "Vancouver, BC", "Waterloo, ON", "Seattle, WA", "Austin, TX",
]

const statuses: ApplicationStatus[] = [
  "todo", "applied", "screening", "interview", "offer", "rejected", "withdrawn",
]

export const applications: MockApplication[] = [
  { id: "1", roleTitle: "Software Engineer Intern", company: "Shopify", status: "interview", dateApplied: "2026-04-12", location: "Toronto, ON", jobUrl: "https://shopify.com/careers", notes: "Had phone screen, awaiting technical", updatedAt: "2026-05-15" },
  { id: "2", roleTitle: "Frontend Developer", company: "Vercel", status: "applied", dateApplied: "2026-05-01", location: "Remote", jobUrl: "https://vercel.com/careers", notes: null, updatedAt: "2026-05-01" },
  { id: "3", roleTitle: "Full Stack Engineer", company: "Stripe", status: "screening", dateApplied: "2026-04-28", location: "San Francisco, CA", jobUrl: "https://stripe.com/jobs", notes: "Recruiter call scheduled", updatedAt: "2026-05-10" },
  { id: "4", roleTitle: "Platform Engineer", company: "Linear", status: "offer", dateApplied: "2026-03-20", location: "Remote", jobUrl: "https://linear.app/careers", notes: "Offer received — reviewing", updatedAt: "2026-05-18" },
  { id: "5", roleTitle: "Backend Engineer Intern", company: "Google", status: "rejected", dateApplied: "2026-04-05", location: "Waterloo, ON", jobUrl: "https://careers.google.com", notes: "Rejected after technical interview", updatedAt: "2026-05-08" },
  { id: "6", roleTitle: "SDET Intern", company: "Notion", status: "screening", dateApplied: "2026-05-10", location: "New York, NY", jobUrl: "https://notion.so/careers", notes: null, updatedAt: "2026-05-12" },
  { id: "7", roleTitle: "Product Engineer", company: "Figma", status: "applied", dateApplied: "2026-05-14", location: "San Francisco, CA", jobUrl: "https://figma.com/careers", notes: null, updatedAt: "2026-05-14" },
  { id: "8", roleTitle: "React Developer", company: "Supabase", status: "todo", dateApplied: null, location: "Remote", jobUrl: "https://supabase.com/careers", notes: "Need to apply before deadline", updatedAt: "2026-05-19" },
  { id: "9", roleTitle: "ML Engineer Intern", company: "Cloudflare", status: "withdrawn", dateApplied: "2026-04-20", location: "Austin, TX", jobUrl: "https://cloudflare.com/careers", notes: "Withdrew — accepted another offer", updatedAt: "2026-05-02" },
  { id: "10", roleTitle: "DevOps Engineer", company: "Datadog", status: "applied", dateApplied: "2026-05-16", location: "New York, NY", jobUrl: "https://careers.datadog.com", notes: null, updatedAt: "2026-05-16" },
  { id: "11", roleTitle: "Junior Developer", company: "PlanetScale", status: "interview", dateApplied: "2026-04-30", location: "Remote", jobUrl: null, notes: "Technical interview next week", updatedAt: "2026-05-17" },
  { id: "12", roleTitle: "Software Engineer", company: "Railway", status: "todo", dateApplied: null, location: "Remote", jobUrl: "https://railway.app/careers", notes: "Referral from friend", updatedAt: "2026-05-19" },
]

export const events: MockEvent[] = [
  { id: "e1", applicationId: "1", eventType: "applied", eventDate: "2026-04-12", notes: "Applied via referral" },
  { id: "e2", applicationId: "1", eventType: "screening", eventDate: "2026-04-28", notes: "Phone screen with recruiter" },
  { id: "e3", applicationId: "1", eventType: "interview", eventDate: "2026-05-10", notes: "Technical interview" },
  { id: "e4", applicationId: "3", eventType: "applied", eventDate: "2026-04-28", notes: null },
  { id: "e5", applicationId: "3", eventType: "screening", eventDate: "2026-05-10", notes: "Recruiter call" },
  { id: "e6", applicationId: "4", eventType: "applied", eventDate: "2026-03-20", notes: null },
  { id: "e7", applicationId: "4", eventType: "interview", eventDate: "2026-04-15", notes: "2 rounds of interviews" },
  { id: "e8", applicationId: "4", eventType: "offer", eventDate: "2026-05-18", notes: "$95k CAD, remote-first" },
  { id: "e9", applicationId: "5", eventType: "applied", eventDate: "2026-04-05", notes: null },
  { id: "e10", applicationId: "5", eventType: "interview", eventDate: "2026-04-25", notes: "Technical round" },
  { id: "e11", applicationId: "5", eventType: "rejection", eventDate: "2026-05-08", notes: "Moved forward with another candidate" },
  { id: "e12", applicationId: "11", eventType: "applied", eventDate: "2026-04-30", notes: null },
  { id: "e13", applicationId: "11", eventType: "screening", eventDate: "2026-05-08", notes: "Initial call" },
]

export const stats: MockStat[] = [
  { label: "Active", value: 8, trend: "+2 this week" },
  { label: "Interviews", value: 2, trend: "1 upcoming" },
  { label: "Offers", value: 1, trend: "Under review" },
  { label: "Rejected", value: 1, trend: "-1 from last week" },
]

export const statusConfig: Record<ApplicationStatus, { label: string; color: string }> = {
  todo: { label: "To Do", color: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400" },
  applied: { label: "Applied", color: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
  screening: { label: "Screening", color: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400" },
  interview: { label: "Interview", color: "bg-purple-500/15 text-purple-600 dark:text-purple-400" },
  offer: { label: "Offer", color: "bg-green-500/15 text-green-600 dark:text-green-400" },
  rejected: { label: "Rejected", color: "bg-red-500/15 text-red-600 dark:text-red-400" },
  withdrawn: { label: "Withdrawn", color: "bg-zinc-500/10 text-zinc-500 dark:text-zinc-500" },
}