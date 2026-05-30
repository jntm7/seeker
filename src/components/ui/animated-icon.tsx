"use client"

import { type ElementType } from "react"
import { motion } from "motion/react"

type AnimatedIconProps = {
  icon: ElementType<{ size?: number; className?: string }>
  size?: number
  className?: string
}

export function AnimatedIcon({ icon: Icon, size = 18, className }: AnimatedIconProps) {
  return (
    <motion.span
      className="inline-flex items-center justify-center shrink-0"
      whileHover={{ rotate: [0, -8, 8, 0], scale: 1.15 }}
      whileTap={{ scale: 0.85 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <Icon size={size} className={className} />
    </motion.span>
  )
}
