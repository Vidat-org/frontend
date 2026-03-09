import { UserAvatar, UserButton, Show, SignInButton } from "@clerk/nextjs"

export default function Navbar() {
  return (
    <nav className="flex h-16 w-full items-center justify-center border-b bg-background">
      <div className="container mx-auto flex w-full items-center justify-between">
        <h3>Vidat</h3>

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
