import { SignIn } from "@clerk/nextjs"
import { createPageMetadata, getMetadataLocale } from "@/lib/metadata"

export async function generateMetadata() {
  const locale = await getMetadataLocale()
  const title = locale === "en" ? "Sign in" : "Logga in"
  const description =
    locale === "en"
      ? "Sign in to Vidat to access your dashboard, reports, and workspace settings."
      : "Logga in till Vidat för att komma åt din dashboard, rapporter och workspace-inställningar."

  return createPageMetadata({
    title,
    description,
    path: "/sign-in",
    noIndex: true,
  })
}

export default function SignInPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignIn
          forceRedirectUrl="/dashboard"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            variables: {
              colorShadow: "transparent",
            },
          }}
        />
      </div>
    </div>
  )
}
