type SendEmailInput = {
  to: string | string[]
  subject: string
  html: string
  text: string
  replyTo?: string | null
}

type ResendEmailResponse = {
  id?: string
  error?: {
    message?: string
  }
}

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`${name} is not configured`)
  }

  return value
}

export async function sendEmail(input: SendEmailInput) {
  const apiKey = getRequiredEnv("RESEND_API_KEY")
  const from = getRequiredEnv("SUPPORT_FROM_EMAIL")
  const to = Array.isArray(input.to) ? input.to : [input.to]

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      reply_to: input.replyTo ?? undefined,
    }),
  })

  const data = (await response.json().catch(() => null)) as
    | ResendEmailResponse
    | null

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
        `Email delivery failed with status ${response.status}`
    )
  }

  return {
    id: data?.id ?? null,
  }
}

export function getSupportInboxAddress() {
  return process.env.SUPPORT_INBOX_EMAIL?.trim() || "support@vidat.app"
}
