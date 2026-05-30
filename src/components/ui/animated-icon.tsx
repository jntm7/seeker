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
      whileHover={{ scale: 1.15, transition: { type: "spring", stiffness: 400, damping: 15 } }}
      whileTap={{ scale: 0.9, transition: { type: "spring", stiffness: 400, damping: 15 } }}
    >
      <Icon size={size} className={className} />
    </motion.span>
  )
}