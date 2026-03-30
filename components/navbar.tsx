import { UserButton, Show, SignInButton } from "@clerk/nextjs"
import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md md:px-16">
      <div className="container mx-auto flex w-full items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-base leading-none font-bold text-chart-1">
            ▸
          </span>
          <span className="text-sm font-bold tracking-widest text-foreground">
            VIDAT
          </span>
        </Link>

        <div>
          <Show when="signed-in">
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton />
          </Show>
        </div>
      </div>
    </nav>
  )
}
