import { OrganizationProfile } from "@clerk/nextjs"

export default async function Page() {
  return (
    <div className="space-y-6">
      <OrganizationProfile
        appearance={{
          variables: {
            colorShadow: "transparent",
          },
        }}
      />
    </div>
  )
}
