"use client"

import * as React from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

type ThemeLogoProps = {
  className?: string
  alt?: string
  width?: number
  height?: number
}

export function ThemeLogo({
  className,
  alt = "Vidat",
  width = 132,
  height = 32,
}: ThemeLogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className={cn("rounded-md bg-muted/70", className)}
        style={{ width, height }}
      />
    )
  }

  return (
    <Image
      src={resolvedTheme === "dark" ? "/dark-logo.svg" : "/light-logo.svg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
    />
  )
}
