export const config = {
  get demoMode() {
    return process.env.DEMO_MODE === "true"
  },
  get adminEmail() {
    return process.env.ADMIN_EMAIL || null
  },
} as const
