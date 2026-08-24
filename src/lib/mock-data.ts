import type { MockApplication, MockEvent, MockStat } from "./data/types"

export const applications: MockApplication[] = [
  { id: "1", roleTitle: "Software Engineer Intern", company: "Shopify", status: "interview", position: 0, dateApplied: "2026-04-12", location: "Toronto, ON", jobUrl: "https://shopify.com/careers", notes: "Had phone screen, awaiting technical", salary: 85000, salaryCurrency: "CAD", createdAt: "2026-05-15T12:00:00.000Z", updatedAt: "2026-05-15" },
  { id: "2", roleTitle: "Frontend Developer", company: "Vercel", status: "applied", position: 0, dateApplied: "2026-05-01", location: "Remote", jobUrl: "https://vercel.com/careers", notes: null, salary: 140000, salaryCurrency: "USD", createdAt: "2026-05-01T12:00:00.000Z", updatedAt: "2026-05-01" },
  { id: "3", roleTitle: "Full Stack Engineer", company: "Stripe", status: "screening", position: 0, dateApplied: "2026-04-28", location: "San Francisco, CA", jobUrl: "https://stripe.com/jobs", notes: "Recruiter call scheduled", salary: 160000, salaryCurrency: "USD", createdAt: "2026-05-10T12:00:00.000Z", updatedAt: "2026-05-10" },
  { id: "4", roleTitle: "Platform Engineer", company: "Linear", status: "offer", position: 0, dateApplied: "2026-03-20", location: "Remote", jobUrl: "https://linear.app/careers", notes: "Offer received — reviewing", salary: 180000, salaryCurrency: "USD", createdAt: "2026-05-18T12:00:00.000Z", updatedAt: "2026-05-18" },
  { id: "5", roleTitle: "Backend Engineer Intern", company: "Google", status: "rejected", position: 0, dateApplied: "2026-04-05", location: "Waterloo, ON", jobUrl: "https://careers.google.com", notes: "Rejected after technical interview", salary: 90000, salaryCurrency: "CAD", createdAt: "2026-05-08T12:00:00.000Z", updatedAt: "2026-05-08" },
  { id: "6", roleTitle: "SDET Intern", company: "Notion", status: "screening", position: 1, dateApplied: "2026-05-10", location: "New York, NY", jobUrl: "https://notion.so/careers", notes: null, salary: null, salaryCurrency: null, createdAt: "2026-05-12T12:00:00.000Z", updatedAt: "2026-05-12" },
  { id: "7", roleTitle: "Product Engineer", company: "Figma", status: "applied", position: 1, dateApplied: "2026-05-14", location: "San Francisco, CA", jobUrl: "https://figma.com/careers", notes: null, salary: 150000, salaryCurrency: "USD", createdAt: "2026-05-14T12:00:00.000Z", updatedAt: "2026-05-14" },
  { id: "8", roleTitle: "React Developer", company: "Supabase", status: "todo", position: 0, dateApplied: null, location: "Remote", jobUrl: "https://supabase.com/careers", notes: "Need to apply before deadline", salary: null, salaryCurrency: null, createdAt: "2026-05-19T12:00:00.000Z", updatedAt: "2026-05-19" },
  { id: "9", roleTitle: "ML Engineer Intern", company: "Cloudflare", status: "withdrawn", position: 0, dateApplied: "2026-04-20", location: "Austin, TX", jobUrl: "https://cloudflare.com/careers", notes: "Withdrew — accepted another offer", salary: 130000, salaryCurrency: "USD", createdAt: "2026-05-02T12:00:00.000Z", updatedAt: "2026-05-02" },
  { id: "10", roleTitle: "DevOps Engineer", company: "Datadog", status: "applied", position: 2, dateApplied: "2026-05-16", location: "New York, NY", jobUrl: "https://careers.datadog.com", notes: null, salary: 155000, salaryCurrency: "USD", createdAt: "2026-05-16T12:00:00.000Z", updatedAt: "2026-05-16" },
  { id: "11", roleTitle: "Junior Developer", company: "PlanetScale", status: "interview", position: 1, dateApplied: "2026-04-30", location: "Remote", jobUrl: null, notes: "Technical interview next week", salary: null, salaryCurrency: null, createdAt: "2026-05-17T12:00:00.000Z", updatedAt: "2026-05-17" },
  { id: "12", roleTitle: "Software Engineer", company: "Railway", status: "todo", position: 1, dateApplied: null, location: "Remote", jobUrl: "https://railway.app/careers", notes: "Referral from friend", salary: null, salaryCurrency: null, createdAt: "2026-05-19T12:00:00.000Z", updatedAt: "2026-05-19" },
  { id: "13", roleTitle: "Data Science Intern", company: "Shopify", status: "applied", position: 3, dateApplied: "2026-05-20", location: "Toronto, ON", jobUrl: "https://shopify.com/careers", notes: null, salary: null, salaryCurrency: null, createdAt: "2026-05-20T12:00:00.000Z", updatedAt: "2026-05-20" },
  { id: "14", roleTitle: "Engineering Manager", company: "Linear", status: "applied", position: 4, dateApplied: "2026-05-22", location: "Remote", jobUrl: "https://linear.app/careers", notes: "Asked for referral from former colleague", salary: 220000, salaryCurrency: "USD", createdAt: "2026-05-22T12:00:00.000Z", updatedAt: "2026-05-22" },
  { id: "15", roleTitle: "Site Reliability Engineer", company: "Cloudflare", status: "screening", position: 2, dateApplied: "2026-05-18", location: "Austin, TX", jobUrl: "https://cloudflare.com/careers", notes: "Recruiter reached out on LinkedIn", salary: 145000, salaryCurrency: "USD", createdAt: "2026-05-21T12:00:00.000Z", updatedAt: "2026-05-21" },
  { id: "16", roleTitle: "iOS Developer", company: "Stripe", status: "todo", position: 2, dateApplied: null, location: "San Francisco, CA", jobUrl: "https://stripe.com/jobs", notes: "Need to prepare portfolio", salary: null, salaryCurrency: null, createdAt: "2026-05-22T12:00:00.000Z", updatedAt: "2026-05-22" },
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
  { id: "e14", applicationId: "1", eventType: "interview", eventDate: "2026-06-02", notes: "Technical interview - round 2" },
  { id: "e15", applicationId: "4", eventType: "offer", eventDate: "2026-06-05", notes: "Offer response deadline" },
  { id: "e16", applicationId: "11", eventType: "interview", eventDate: "2026-06-10", notes: "System design interview" },
  { id: "e17", applicationId: "3", eventType: "screening", eventDate: "2026-05-30", notes: "Follow-up call" },
  { id: "e18", applicationId: "8", eventType: "todo", eventDate: "2026-06-01", notes: "Application deadline" },
  { id: "e19", applicationId: "13", eventType: "applied", eventDate: "2026-05-20", notes: null },
  { id: "e20", applicationId: "14", eventType: "applied", eventDate: "2026-05-22", notes: null },
  { id: "e21", applicationId: "15", eventType: "applied", eventDate: "2026-05-18", notes: null },
  { id: "e22", applicationId: "15", eventType: "screening", eventDate: "2026-05-21", notes: "Initial call with recruiter" },
  { id: "e23", applicationId: "16", eventType: "todo", eventDate: "2026-06-10", notes: "Portfolio review deadline" },
]

export const stats: MockStat[] = [
  { label: "Active", value: 10, trend: "In Progress", hex: "#5b7fa5" },
  { label: "Interviews", value: 2, trend: "Scheduled", hex: "#8a7ab5" },
  { label: "Offers", value: 1, trend: "Under Review", hex: "#5d9f6a" },
  { label: "Rejected", value: 1, trend: "No Offer", hex: "#b56a6a" },
]
