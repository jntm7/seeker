import { PrismaClient } from "../src/generated/prisma/client.js"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const url = process.env["DATABASE_URL"]
if (!url) throw new Error("DATABASE_URL is required")
const adapter = new PrismaLibSql({ url })

const prisma = new PrismaClient({ adapter })

async function main() {
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@seeker.local" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@seeker.local",
    },
  })

  const shopify = await prisma.company.upsert({
    where: { id: "cm9t08h7l0002t6m8h1d8z8p1" },
    update: {},
    create: {
      id: "cm9t08h7l0002t6m8h1d8z8p1",
      name: "Shopify",
      website: "https://shopify.com/careers",
      location: "Toronto, ON",
      industry: "E-commerce",
    },
  })

  const vercel = await prisma.company.upsert({
    where: { id: "cm9t08h7l0003t6m8h1d8z8p2" },
    update: {},
    create: {
      id: "cm9t08h7l0003t6m8h1d8z8p2",
      name: "Vercel",
      website: "https://vercel.com/careers",
      location: "Remote",
      industry: "Cloud Infrastructure",
    },
  })

  const stripe = await prisma.company.upsert({
    where: { id: "cm9t08h7l0004t6m8h1d8z8p3" },
    update: {},
    create: {
      id: "cm9t08h7l0004t6m8h1d8z8p3",
      name: "Stripe",
      website: "https://stripe.com/jobs",
      location: "San Francisco, CA",
      industry: "Fintech",
    },
  })

  const linear = await prisma.company.upsert({
    where: { id: "cm9t08h7l0005t6m8h1d8z8p4" },
    update: {},
    create: {
      id: "cm9t08h7l0005t6m8h1d8z8p4",
      name: "Linear",
      website: "https://linear.app/careers",
      location: "Remote",
      industry: "Developer Tools",
    },
  })

  const google = await prisma.company.upsert({
    where: { id: "cm9t08h7l0006t6m8h1d8z8p5" },
    update: {},
    create: {
      id: "cm9t08h7l0006t6m8h1d8z8p5",
      name: "Google",
      website: "https://careers.google.com",
      location: "Waterloo, ON",
      industry: "Technology",
    },
  })

  const notion = await prisma.company.upsert({
    where: { id: "cm9t08h7l0007t6m8h1d8z8p6" },
    update: {},
    create: {
      id: "cm9t08h7l0007t6m8h1d8z8p6",
      name: "Notion",
      website: "https://notion.so/careers",
      location: "New York, NY",
      industry: "Productivity Software",
    },
  })

  const figma = await prisma.company.upsert({
    where: { id: "cm9t08h7l0008t6m8h1d8z8p7" },
    update: {},
    create: {
      id: "cm9t08h7l0008t6m8h1d8z8p7",
      name: "Figma",
      website: "https://figma.com/careers",
      location: "San Francisco, CA",
      industry: "Design Tools",
    },
  })

  const supabase = await prisma.company.upsert({
    where: { id: "cm9t08h7l0009t6m8h1d8z8p8" },
    update: {},
    create: {
      id: "cm9t08h7l0009t6m8h1d8z8p8",
      name: "Supabase",
      website: "https://supabase.com/careers",
      location: "Remote",
      industry: "Developer Tools",
    },
  })

  const cloudflare = await prisma.company.upsert({
    where: { id: "cm9t08h7l0010t6m8h1d8z8p9" },
    update: {},
    create: {
      id: "cm9t08h7l0010t6m8h1d8z8p9",
      name: "Cloudflare",
      website: "https://cloudflare.com/careers",
      location: "Austin, TX",
      industry: "Cloud Infrastructure",
    },
  })

  const datadog = await prisma.company.upsert({
    where: { id: "cm9t08h7l0011t6m8h1d8z8pa" },
    update: {},
    create: {
      id: "cm9t08h7l0011t6m8h1d8z8pa",
      name: "Datadog",
      website: "https://careers.datadog.com",
      location: "New York, NY",
      industry: "Observability",
    },
  })

  const planetscale = await prisma.company.upsert({
    where: { id: "cm9t08h7l0012t6m8h1d8z8pb" },
    update: {},
    create: {
      id: "cm9t08h7l0012t6m8h1d8z8pb",
      name: "PlanetScale",
      website: null,
      location: "Remote",
      industry: "Database",
    },
  })

  const railway = await prisma.company.upsert({
    where: { id: "cm9t08h7l0013t6m8h1d8z8pc" },
    update: {},
    create: {
      id: "cm9t08h7l0013t6m8h1d8z8pc",
      name: "Railway",
      website: "https://railway.app/careers",
      location: "Remote",
      industry: "Cloud Infrastructure",
    },
  })

  const app1 = await prisma.application.upsert({
    where: { id: "cm9t08h7l0014t6m8h1d8z8pd" },
    update: {},
    create: {
      id: "cm9t08h7l0014t6m8h1d8z8pd",
      userId: demoUser.id,
      companyId: shopify.id,
      roleTitle: "Software Engineer Intern",
      status: "interview",
      dateApplied: new Date("2026-04-12"),
      location: "Toronto, ON",
      jobUrl: "https://shopify.com/careers",
      notes: "Had phone screen, awaiting technical",
    },
  })

  await prisma.application.upsert({
    where: { id: "cm9t08h7l0015t6m8h1d8z8pe" },
    update: {},
    create: {
      id: "cm9t08h7l0015t6m8h1d8z8pe",
      userId: demoUser.id,
      companyId: vercel.id,
      roleTitle: "Frontend Developer",
      status: "applied",
      dateApplied: new Date("2026-05-01"),
      location: "Remote",
      jobUrl: "https://vercel.com/careers",
    },
  })

  await prisma.application.upsert({
    where: { id: "cm9t08h7l0016t6m8h1d8z8pf" },
    update: {},
    create: {
      id: "cm9t08h7l0016t6m8h1d8z8pf",
      userId: demoUser.id,
      companyId: stripe.id,
      roleTitle: "Full Stack Engineer",
      status: "screening",
      dateApplied: new Date("2026-04-28"),
      location: "San Francisco, CA",
      jobUrl: "https://stripe.com/jobs",
      notes: "Recruiter call scheduled",
    },
  })

  await prisma.application.upsert({
    where: { id: "cm9t08h7l0017t6m8h1d8z8pg" },
    update: {},
    create: {
      id: "cm9t08h7l0017t6m8h1d8z8pg",
      userId: demoUser.id,
      companyId: linear.id,
      roleTitle: "Platform Engineer",
      status: "offer",
      dateApplied: new Date("2026-03-20"),
      location: "Remote",
      jobUrl: "https://linear.app/careers",
      notes: "Offer received — reviewing",
    },
  })

  await prisma.application.upsert({
    where: { id: "cm9t08h7l0018t6m8h1d8z8ph" },
    update: {},
    create: {
      id: "cm9t08h7l0018t6m8h1d8z8ph",
      userId: demoUser.id,
      companyId: google.id,
      roleTitle: "Backend Engineer Intern",
      status: "rejected",
      dateApplied: new Date("2026-04-05"),
      location: "Waterloo, ON",
      jobUrl: "https://careers.google.com",
      notes: "Rejected after technical interview",
    },
  })

  await prisma.application.upsert({
    where: { id: "cm9t08h7l0019t6m8h1d8z8pi" },
    update: {},
    create: {
      id: "cm9t08h7l0019t6m8h1d8z8pi",
      userId: demoUser.id,
      companyId: notion.id,
      roleTitle: "SDET Intern",
      status: "screening",
      dateApplied: new Date("2026-05-10"),
      location: "New York, NY",
    },
  })

  await prisma.application.upsert({
    where: { id: "cm9t08h7l0020t6m8h1d8z8pj" },
    update: {},
    create: {
      id: "cm9t08h7l0020t6m8h1d8z8pj",
      userId: demoUser.id,
      companyId: figma.id,
      roleTitle: "Product Engineer",
      status: "applied",
      dateApplied: new Date("2026-05-14"),
      location: "San Francisco, CA",
    },
  })

  await prisma.application.upsert({
    where: { id: "cm9t08h7l0021t6m8h1d8z8pk" },
    update: {},
    create: {
      id: "cm9t08h7l0021t6m8h1d8z8pk",
      userId: demoUser.id,
      companyId: supabase.id,
      roleTitle: "React Developer",
      status: "todo",
      location: "Remote",
      jobUrl: "https://supabase.com/careers",
      notes: "Need to apply before deadline",
    },
  })

  await prisma.application.upsert({
    where: { id: "cm9t08h7l0022t6m8h1d8z8pl" },
    update: {},
    create: {
      id: "cm9t08h7l0022t6m8h1d8z8pl",
      userId: demoUser.id,
      companyId: cloudflare.id,
      roleTitle: "ML Engineer Intern",
      status: "withdrawn",
      dateApplied: new Date("2026-04-20"),
      location: "Austin, TX",
      notes: "Withdrew — accepted another offer",
    },
  })

  await prisma.application.upsert({
    where: { id: "cm9t08h7l0023t6m8h1d8z8pm" },
    update: {},
    create: {
      id: "cm9t08h7l0023t6m8h1d8z8pm",
      userId: demoUser.id,
      companyId: datadog.id,
      roleTitle: "DevOps Engineer",
      status: "applied",
      dateApplied: new Date("2026-05-16"),
      location: "New York, NY",
    },
  })

  await prisma.application.upsert({
    where: { id: "cm9t08h7l0024t6m8h1d8z8pn" },
    update: {},
    create: {
      id: "cm9t08h7l0024t6m8h1d8z8pn",
      userId: demoUser.id,
      companyId: planetscale.id,
      roleTitle: "Junior Developer",
      status: "interview",
      dateApplied: new Date("2026-04-30"),
      location: "Remote",
      notes: "Technical interview next week",
    },
  })

  await prisma.application.upsert({
    where: { id: "cm9t08h7l0025t6m8h1d8z8po" },
    update: {},
    create: {
      id: "cm9t08h7l0025t6m8h1d8z8po",
      userId: demoUser.id,
      companyId: railway.id,
      roleTitle: "Software Engineer",
      status: "todo",
      location: "Remote",
      jobUrl: "https://railway.app/careers",
      notes: "Referral from friend",
    },
  })

  const eventData = [
    { id: "e1", appId: app1.id, eventType: "applied" as const, date: "2026-04-12", notes: "Applied via referral" },
    { id: "e2", appId: app1.id, eventType: "screening" as const, date: "2026-04-28", notes: "Phone screen with recruiter" },
    { id: "e3", appId: app1.id, eventType: "interview" as const, date: "2026-05-10", notes: "Technical interview" },
    { id: "e14", appId: app1.id, eventType: "interview" as const, date: "2026-06-02", notes: "Technical interview - round 2" },
    { id: "e15", appId: "cm9t08h7l0017t6m8h1d8z8pg", eventType: "offer" as const, date: "2026-06-05", notes: "Offer response deadline" },
    { id: "e16", appId: "cm9t08h7l0024t6m8h1d8z8pn", eventType: "interview" as const, date: "2026-06-10", notes: "System design interview" },
    { id: "e17", appId: "cm9t08h7l0016t6m8h1d8z8pf", eventType: "screening" as const, date: "2026-05-30", notes: "Follow-up call" },
    { id: "e18", appId: "cm9t08h7l0021t6m8h1d8z8pk", eventType: "todo" as const, date: "2026-06-01", notes: "Application deadline" },
  ]

  for (const evt of eventData) {
    await prisma.event.upsert({
      where: { id: evt.id },
      update: {},
      create: {
        id: evt.id,
        applicationId: evt.appId,
        eventType: evt.eventType,
        eventDate: new Date(evt.date),
        notes: evt.notes,
      },
    })
  }

  console.log("Seed complete: demo user and sample applications created")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
