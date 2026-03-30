import { cn } from "@/lib/utils"

import { Loader2Icon } from "lucide-react"
import { useT } from "next-i18next/client"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  const { t } = useT("common")

  return (
    <Loader2Icon
      role="status"
      aria-label={t("common.loadingLabel")}
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
