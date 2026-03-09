type Website = {
  id: string
  url: string
  name?: string | null
  last_checked_at?: Date
  interval: number

  created_at: Date
  updated_at: Date
}
