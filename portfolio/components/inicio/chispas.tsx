"use client"

import ClickSpark from "@/components/ClickSpark"

/** Detalle sorpresa: cada clic en la página suelta un destello de estrellas. */
export function Chispas({ children }: { children: React.ReactNode }) {
  return (
    <ClickSpark
      sparkColor={["#39d5ff", "#7c5cff", "#f5f7ff"]}
      shape="star"
      sparkCount={10}
      sparkRadius={26}
      sparkSize={9}
      duration={520}
      glow={0.6}
      layer="front"
    >
      {children}
    </ClickSpark>
  )
}
