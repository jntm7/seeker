export const config = {
  get demoMode() {
    return process.env.DEMO_MODE === "true"
  },
} as const
